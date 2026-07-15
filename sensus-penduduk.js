"use strict";
/* ==========================================================
   MASTER RT
========================================================== */

const MASTER_RT_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=1522488510&single=true&output=csv";

/* ==========================================================
   BASE SHEET RT
========================================================== */

const BASE_SHEET =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=";

const SHEET_END =
"&single=true&output=csv";

/* ==========================================================
   GLOBAL
========================================================== */

let PENDUDUK = [];

let MASTER_RT=[];

let CURRENT_RT="";

let CURRENT_GID="";

const CACHE_RT = {};

/* ==========================================================
   ICON
========================================================== */

const ICONS = {

    users: "👥",
    male: "👨",
    female: "👩",
    family: "👪",
    education: "🎓",
    mobility: "🚶",
    housing: "🏠",
    disability: "♿",
    birth: "👶",
    death: "🕊️"

};

/* ==========================================================
   FORMAT ANGKA
========================================================== */

function fmt(value){

    return Number(value).toLocaleString("id-ID");

}
/* ==========================================================
   LOAD CSV
========================================================== */

function loadCSV(url){

    return new Promise(function(resolve,reject){

        Papa.parse(url,{

            download:true,

            header:true,

            skipEmptyLines:true,

            complete:function(result){

                resolve(result.data);

            },

            error:function(err){

                reject(err);

            }

        });

    });

}

/* ==========================================================
   MENU MOBILE
========================================================== */

function initMenu(){

    const btn = document.getElementById("menuToggle");
    const nav = document.getElementById("navMobile");

    if(!btn || !nav) return;

    btn.onclick = function(){

        nav.classList.toggle("open");

    };

}

/* ==========================================================
   LOAD GOOGLE SHEET
========================================================== */

function loadData(){

    Papa.parse(SHEET_URL,{

        download:true,

        header:true,

        skipEmptyLines:true,

        complete:function(result){

           PENDUDUK = result.data;

            console.log("DATA :", PENDUDUK);

            console.log(PENDUDUK[0]);

            console.log(Object.keys(PENDUDUK[0]));

            initFilter();

            // Hapus baris ini
            // renderTopics();

            renderAll(PENDUDUK);

        }

    });

}
async function loadMasterRT(){

    MASTER_RT = await loadCSV(MASTER_RT_CSV);

    fillSelect(
        "filterRt",
        [...MASTER_RT]
            .sort((a, b) => Number(a["RT"]) - Number(b["RT"]))
            .map(function(item){
                return "RT " + item["RT"];
            }),
        "Pilih RT"
    );
    initFilter();

    initRTEvent();
    await loadAllRT();

    // ============================
    // Load RT pertama saat halaman dibuka
    // ============================

}
async function loadAllRT(){

    const semuaData = [];

    const promises = MASTER_RT.map(async function(item){

        const url =
            BASE_SHEET +
            item["GID"] +
            SHEET_END;

        const data = await loadCSV(url);

        semuaData.push(...data);

    });

        await Promise.all(promises);

        PENDUDUK = semuaData;

        console.log("Jumlah data =", PENDUDUK.length);

        console.log(
            "Jenis Kelamin =",
            [...new Set(PENDUDUK.map(x => x["Jenis Kelamin"]))]
        );

        console.log(
            "Generasi =",
            [...new Set(PENDUDUK.map(x => x["Generasi"]))]
        );

        initFilter();

        renderAll(PENDUDUK);

}
function getGID(rt){

    const nomor =

    rt.replace("RT","")

    .trim();

    const hasil =

    MASTER_RT.find(function(item){

        return String(item["RT"])===nomor;

    });

    if(!hasil){

        return "";

    }

    return hasil["GID"];

}
async function loadRT(rt){

    // Kalau sudah pernah didownload, pakai cache
    if(CACHE_RT[rt]){

        PENDUDUK = CACHE_RT[rt];

        renderAll(getFilteredData());

        return;

    }

    CURRENT_RT = rt;

    CURRENT_GID = getGID(rt);

    const url =
        BASE_SHEET +
        CURRENT_GID +
        SHEET_END;

    Papa.parse(url,{

        download:true,

        header:true,

        skipEmptyLines:true,

        complete:function(result){

            // Simpan ke cache
            CACHE_RT[rt] = result.data;

            PENDUDUK = result.data;

            initFilter();

            renderAll(getFilteredData());

        },

        error:function(err){

            console.error(err);

        }

    });

}
/* ==========================================================
   FILTER
========================================================== */

function fillSelect(id, data, firstText){

    const select = document.getElementById(id);

    if(!select) return;

    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = firstText;
    first.textContent = firstText;
    select.appendChild(first);

    [...new Set(data)]
    .filter(v => v && v.trim() !== "")
    .forEach(function(item){

        const option = document.createElement("option");

        option.value = item;

        option.textContent = item;

        select.appendChild(option);

    });

}

function initFilter(){

    fillSelect(
        "filterGen",
        [
            "Baby Boomer",
            "Generasi X",
            "Generasi X / Millennial",
            "Millennial",
            "Generasi Z",
            "Generasi Alpha"
        ],
        "Semua Generasi"
    );

    fillSelect(
        "filterJk",
        [
            "Laki-laki",
            "Perempuan"
        ],
        "Semua"
    );

}
function initRTEvent(){

}

/* ==========================================================
   AMBIL DATA FILTER
========================================================== */

function getFilteredData(){

    const gen =
    document.getElementById("filterGen").value;

    const jk =
    document.getElementById("filterJk").value;

    return PENDUDUK.filter(function(p){

        return(

            (gen==="Semua Generasi" ||
            p["Generasi"]===gen)

            &&

            (jk==="Semua" ||
            p["Jenis Kelamin"]===jk)

        );

    });

}

/* ==========================================================
   BUTTON TERAPKAN
========================================================== */

document.addEventListener("click", function(e){

    if(e.target.id !== "applyBtn") return;

    const rt = document.getElementById("filterRt").value;
    const gen = document.getElementById("filterGen").value;
    const jk = document.getElementById("filterJk").value;

    // Jika memilih RT tertentu, buka halaman RT Detail
    if(rt !== "Pilih RT"){

        let url = `rt-detail.html?rt=${encodeURIComponent(rt)}`;

        if(gen !== "Semua Generasi"){
            url += `&gen=${encodeURIComponent(gen)}`;
        }

        if(jk !== "Semua"){
            url += `&jk=${encodeURIComponent(jk)}`;
        }

        window.location.href = url;
        return;
    }

    // Jika memilih Semua RT tetap tampilkan statistik di halaman ini
    renderAll(getFilteredData());

});

/* ==========================================================
   STATISTIK
========================================================== */

function renderStats(data){

    const total = data.length;

    const laki = data.filter(function(p){

        const jk = String(p["Jenis Kelamin"] || "")
            .trim()
            .toLowerCase();

        return jk === "laki-laki" ||
               jk === "laki laki";

    }).length;

    const perempuan = data.filter(function(p){

        const jk = String(p["Jenis Kelamin"] || "")
            .trim()
            .toLowerCase();

        return jk === "perempuan";

    }).length;

    const kk = data.filter(function(p){

        const status = String(p["Status Keluarga"] || "")
            .trim()
            .toLowerCase();

        return status === "kepala keluarga";

    }).length;

    const stats = document.getElementById("censusStats");

    if(!stats) return;

    stats.innerHTML = `

<div class="stat-card">

    <div class="stat-icon">${ICONS.users}</div>

    <div>

        <div class="stat-label">Total Penduduk</div>

        <div class="stat-value">${fmt(total)}</div>

    </div>

</div>

<div class="stat-card">

    <div class="stat-icon">${ICONS.male}</div>

    <div>

        <div class="stat-label">Laki-laki</div>

        <div class="stat-value">${fmt(laki)}</div>

    </div>

</div>

<div class="stat-card">

    <div class="stat-icon">${ICONS.female}</div>

    <div>

        <div class="stat-label">Perempuan</div>

        <div class="stat-value">${fmt(perempuan)}</div>

    </div>

</div>

<div class="stat-card">

    <div class="stat-icon">${ICONS.family}</div>

    <div>

        <div class="stat-label">Kepala Keluarga</div>

        <div class="stat-value">${fmt(kk)}</div>

    </div>

</div>

`;

}
function normalisasiGenerasi(gen){

    gen = String(gen || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\s*\/\s*/g, " / ")
        .replace(/\s*-\s*/g, "-");

    if(gen === "") return "";

    // ===========================
    // Silent Generation
    // ===========================

    if(gen.includes("pre-boomer")){
        return "Silent Generation";
    }

    if(gen === "silent generation"){
        return "Silent Generation";
    }

    // ===========================
    // Baby Boomers
    // ===========================

    if(gen.includes("baby boomer")){
        return "Baby Boomers";
    }

    // ===========================
    // Generasi X
    // ===========================

    if(
        gen === "generasi x" ||
        gen === "gen x"
    ){
        return "Generasi X";
    }

    // ===========================
    // Generasi X / Millennial
    // ===========================

    if(
        gen.includes("x / millennial") ||
        gen.includes("x/millennial") ||
        gen.includes("x / milenial") ||
        gen.includes("x/milenial") ||
        gen.includes("x-millennial")
    ){
        return "Generasi X / Millennial";
    }

    // ===========================
    // Millennial
    // ===========================

    if(
        gen.includes("generasi y") ||
        gen.includes("generasi milenial") ||
        gen.includes("generasi millenial") ||
        gen === "milenial" ||
        gen === "millenial" ||
        gen === "millennial"
    ){
        return "Millennial";
    }

    // ===========================
    // Generasi Z
    // ===========================

    if(
        gen === "gen z" ||
        gen === "generasi z"
    ){
        return "Generasi Z";
    }

    // ===========================
    // Generasi Alpha
    // ===========================

    if(
        gen === "gen alpha" ||
        gen === "generasi alpha"
    ){
        return "Generasi Alpha";
    }

    // ===========================
    // Generasi Beta
    // ===========================

    if(
        gen === "gen beta" ||
        gen === "generasi beta"
    ){
        return "Generasi Beta";
    }

    return "";
}
function normalisasiTopik(field, value){

    let key = String(value || "").trim();

    /* ===============================
       JENIS KELAMIN
    ============================== */

    if(field === "Jenis Kelamin"){

        const jk = key.toLowerCase();

        if(jk === "laki-laki" || jk === "laki laki"){

            return "Laki-laki";

        }

        if(jk === "perempuan"){

            return "Perempuan";

        }

        return "-";

    }

    /* ===============================
       STATUS KELUARGA
    ============================== */

    if(field === "Status Keluarga"){

        const sk = key.toLowerCase();

        switch(sk){

            case "kepala keluarga":
                return "Kepala Keluarga";

            case "istri":
            case "isteri":
                return "Istri";

            case "anak":
                return "Anak";

            case "cucu":
                return "Cucu";

            case "mertua":
                return "Mertua";

            case "orang tua":
                return "Orang Tua";

            case "famili lain":
                return "Famili Lain";

            case "pembantu":
                return "Pembantu";

            case "sita / sederajat":
                return "SLTA / Sederajat";

            default:
                return key.replace(/\b\w/g,c=>c.toUpperCase());

        }

    }

    /* ===============================
       PENDIDIKAN
    ============================== */

    if(field === "Pendidikan"){

        const p = key.toLowerCase();

        switch(p){

            case "":
                return "-";

            case "belum sekolah":
                return "Belum Sekolah";

            case "belum tamat sd":
                return "Belum Tamat SD";

            case "belum tamat sd/sederajat":
            case "belum tamat sd / sederajat":
            case "blm tamat sd/sederajat":
                return "Belum Tamat SD / Sederajat";

            case "slta/sederajat":
            case "slta sederajat":
            case "slta / sederajat":
                return "SLTA / Sederajat";

            case "sltp/sederajat":
            case "sltp / sederajat":
                return "SLTP / Sederajat";

            case "sd/sederajat":
            case "sd / sederajat":
                return "SD / Sederajat";

            case "diploma i/ii":
            case "diploma i / ii":
                return "Diploma I / II";

            case "diploma iii":
                return "Diploma III";

            case "diploma iv/strata i":
            case "diploma iv / strata i":
                return "Diploma IV / Strata I";

            case "akademi/diploma iii/sarjana muda":
            case "akademi / diploma iii / sarjana muda":
                return "Akademi / Diploma III / Sarjana Muda";

            default:
                return key.replace(/\b\w/g,c=>c.toUpperCase());

        }

    }

    /* ===============================
       KELAHIRAN
    ============================== */

    if(field==="Kelahiran"){

        if(!key) return "-";

        return key.split(",")[0].trim();

    }

    /* ===============================
       MOBILITAS
    ============================== */

    if(field==="Mobilitas"){

        if(!key) return "-";

        return key.toUpperCase();

    }

    return key;

}
/* ==========================================================
   GRAFIK
========================================================== */

function renderChart(data){

    const chart = document.getElementById("chart");

    if(!chart) return;
    const cekJK = {};

data.forEach(function(item){

    const jk = String(item["Jenis Kelamin"] || "").trim();

    cekJK[jk] = (cekJK[jk] || 0) + 1;

});

console.table(cekJK);

    const genMap = {};

    data.forEach(function(item){

    console.log(
        "GEN =", item["Generasi"],
        "| JK =", item["Jenis Kelamin"]
    );

    const gen = normalisasiGenerasi(item["Generasi"]);
    const jk = normalisasiTopik(
        "Jenis Kelamin",
        item["Jenis Kelamin"]
    );
    console.log(
    item["Generasi"],
    "=>",
    gen
);

        if(gen === "" || jk === "-") return;

        if(!genMap[gen]){

            genMap[gen]={
                laki:0,
                perempuan:0
            };

        }

        if(jk==="Laki-laki"){

            genMap[gen].laki++;

        }else if(jk==="Perempuan"){

            genMap[gen].perempuan++;

        }

    });
    const beta = data.filter(item =>
    normalisasiGenerasi(item["Generasi"]) === "Generasi Beta"
);

console.table(beta);

       const urutan = [
    "Silent Generation",
    "Baby Boomers",
    "Generasi X",
    "Generasi X / Millennial",
    "Millennial",
    "Generasi Z",
    "Generasi Alpha",
    "Generasi Beta"
];
    let kosong = 0;

    data.forEach(function(item){

        const gen = String(item["Generasi"] || "").trim();

        if(gen === ""){

            kosong++;

        }

    });

    console.log("Generasi kosong =", kosong);

    const tidakMasuk = data.filter(function(item){

        const gen = normalisasiGenerasi(item["Generasi"]);
        const jk = normalisasiTopik(
            "Jenis Kelamin",
            item["Jenis Kelamin"]
        );

        return (
            !urutan.includes(gen) ||
            (jk !== "Laki-laki" && jk !== "Perempuan")
        );

    });

    console.table(tidakMasuk);
    console.log("Tidak masuk =", tidakMasuk.length);
    const entries = urutan
    .filter(nama => genMap[nama])
    .map(nama => [nama, genMap[nama]]);
    let totalGrafik = 0;

    entries.forEach(([nama, v]) => {

        console.log(
            nama,
            "L =", v.laki,
            "P =", v.perempuan,
            "Total =", v.laki + v.perempuan
        );

        totalGrafik += v.laki + v.perempuan;

    });

    console.log("TOTAL GRAFIK =", totalGrafik);

    if(entries.length===0){

        chart.innerHTML="<p>Tidak ada data.</p>";

        return;

    }

    let max=0;

    entries.forEach(([_,v])=>{

        if(v.laki>max) max=v.laki;

        if(v.perempuan>max) max=v.perempuan;

    });

entries.forEach(([_, v]) => {
    totalGrafik += v.laki + v.perempuan;
});

console.log("TOTAL GRAFIK =", totalGrafik);
console.log("TOTAL DATA =", data.length);
    chart.innerHTML = entries.map(([nama,v]) => `

<div class="chart-group">

    <div class="gen">
        ${nama}
    </div>

    <div class="bars">

        <div class="bar-track">
           <div class="bar-track">

                <div
                    class="bar-fill male"
                    style="width:${(v.laki/max)*100}%">

                    ${(v.laki/max)*100 > 15 ? v.laki : ""}

                </div>

                ${(v.laki/max)*100 <= 15
                    ? `<span class="bar-value">${v.laki}</span>`
                    : ""}

            </div>
        </div>

       <div class="bar-track">

                <div
                    class="bar-fill female"
                    style="width:${(v.perempuan/max)*100}%">

                    ${(v.perempuan/max)*100 > 15 ? v.perempuan : ""}

                </div>

                ${(v.perempuan/max)*100 <= 15
                    ? `<span class="bar-value">${v.perempuan}</span>`
                    : ""}

            </div>
        </div>

    </div>

</div>

`).join("");
}

/* ==========================================================
   RENDER SEMUA
========================================================== */

function renderAll(data){

    renderTopics(data);

    renderStats(data);

    renderChart(data);

}
/* ==========================================================
   TOPIK
========================================================== */

const TOPICS = [

{
    title:"Jumlah Penduduk",
    icon:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="8" r="4"/>
        <path d="M2 21v-1a6 6 0 0 1 12 0v1"/>
        <path d="M17 11a4 4 0 1 0 0-6"/>
        <path d="M22 21a5 5 0 0 0-4-5"/>
    </svg>
    `,
    field:"Jenis Kelamin"
},

{
    title:"Rumah Tangga",
    icon:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="8" cy="8" r="3"/>
        <circle cx="16" cy="8" r="3"/>
        <path d="M3 21v-1a5 5 0 0 1 10 0v1"/>
        <path d="M11 21v-1a5 5 0 0 1 10 0v1"/>
    </svg>
    `,
    field:"Status Keluarga"
},

{
    title:"Pendidikan",
    icon:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 9l10-5 10 5-10 5z"/>
        <path d="M6 11v5c0 2 3 4 6 4s6-2 6-4v-5"/>
    </svg>
    `,
    field:"Pendidikan"
},

{
    title:"Mobilitas",
    icon:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v6"/>
        <path d="M8 11l4-2 4 2"/>
        <path d="M10 22l2-6 2 6"/>
    </svg>
    `,
    field:"Mobilitas"
},

{
    title:"Kelahiran",
    icon:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="7" r="3"/>
        <path d="M12 10v10"/>
        <path d="M7 22c1-4 9-4 10 0"/>
    </svg>
    `,
    field:"Kelahiran"
},

];

/* ==========================================================
   RENDER TOPIK
========================================================== */

function renderTopics(data){

    const grid = document.getElementById("topicsGrid");
   console.log("GRID =", grid);
    console.log("DATA =", data.length);

    if(!grid) return;

    grid.innerHTML = "";

    TOPICS.forEach(function(item){

       const jumlahKategori = new Set(

        data.map(function(p){

            return normalisasiTopik(
                item.field,
                p[item.field]
            );

        })

    ).size;

        const card = document.createElement("div");

        card.className = "topic-card";

        card.innerHTML = `

            <div class="topic-icon">

                ${item.icon}

            </div>

            <div class="topic-title">

                ${item.title}

            </div>

            <div class="topic-count">

                ${jumlahKategori} kategori

            </div>

        `;

        card.onclick = function(){

            openTopic(item, data);

        };

        grid.appendChild(card);

    });

}

/* ==========================================================
   MODAL
========================================================== */

function openTopic(topic, data){

    const modal=document.getElementById("topicModal");

    const title=document.getElementById("topicModalTitle");

    const body=document.getElementById("topicModalBody");

    if(!modal || !title || !body) return;

    title.textContent=topic.title;

    const hasil={};

data.forEach(function(p){

    const key = normalisasiTopik(

        topic.field,

        p[topic.field]

    );

    hasil[key] = (hasil[key] || 0) + 1;

});

    let html=`

    <div class="table-wrap">

    <table class="data-table">

    <thead>

    <tr>

        <th>${topic.title}</th>

        <th>Jumlah</th>

    </tr>

    </thead>

    <tbody>

    `;

    Object.keys(hasil)

    .sort()

    .forEach(function(k){

        html+=`

        <tr>

            <td>${k}</td>

            <td>${hasil[k]}</td>

        </tr>

        `;

    });

    html+=`

    </tbody>

    </table>

    </div>

    `;

body.innerHTML = html;

modal.hidden = false;

// Kunci scroll halaman
document.body.style.overflow = "hidden";

}

/* ==========================================================
   TUTUP MODAL
========================================================== */

document.addEventListener("click",function(e){

    if(e.target.matches("[data-close]")){

        document.getElementById("topicModal").hidden = true;

    }

});
/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded",function(){

    initMenu();

    loadMasterRT();

});

/* ==========================================================
   ESC UNTUK TUTUP MODAL
========================================================== */

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        const modal=document.getElementById("topicModal");

        if(modal){

            modal.hidden=true;

        }

    }

});

/* ==========================================================
   DEBUG
========================================================== */

console.log("===================================");

console.log("Dashboard Penduduk Kututegal");

console.log("KKN Universitas Tidar");

console.log("===================================");