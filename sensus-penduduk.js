"use strict";

/* ==========================================================
   GOOGLE SHEET
========================================================== */

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1343644530&single=true&output=csv";

/* ==========================================================
   GLOBAL
========================================================== */

let PENDUDUK = [];

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

            console.log("DATA :",PENDUDUK);

            initFilter();

            renderTopics();

            renderAll(PENDUDUK);

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
    .sort()
    .forEach(function(item){

        const option = document.createElement("option");

        option.value = item;

        option.textContent = item;

        select.appendChild(option);

    });

}

function initFilter(){

    fillSelect(
        "filterRt",
        PENDUDUK.map(p=>p["RT"]),
        "Semua RT"
    );

    fillSelect(
        "filterGen",
        PENDUDUK.map(p=>p["Generasi"]),
        "Semua Generasi"
    );

    fillSelect(
        "filterJk",
        PENDUDUK.map(p=>p["Jenis Kelamin"]),
        "Semua"
    );

}

/* ==========================================================
   AMBIL DATA FILTER
========================================================== */

function getFilteredData(){

    const rt =
    document.getElementById("filterRt").value;

    const gen =
    document.getElementById("filterGen").value;

    const jk =
    document.getElementById("filterJk").value;

    return PENDUDUK.filter(function(p){

        return(

            (rt==="Semua RT" ||
            p["RT"]===rt)

            &&

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

document.addEventListener(

    "click",

    function(e){

    if(e.target.id==="applyBtn"){

        const rt=document.getElementById("filterRt").value;

        if(rt==="Semua RT"){

            renderAll(

                getFilteredData()

            );

        }else{

            window.location.href=
            `rt-detail.html?rt=${encodeURIComponent(rt)}`;

        }

    }

}

);

/* ==========================================================
   STATISTIK
========================================================== */

function renderStats(data){

    const total = data.length;

    const laki = data.filter(function(p){

        return p["Jenis Kelamin"]==="Laki-laki";

    }).length;

    const perempuan = data.filter(function(p){

        return p["Jenis Kelamin"]==="Perempuan";

    }).length;

    const kk = data.filter(function(p){

        return p["Status Keluarga"]==="Kepala Keluarga";

    }).length;

    const stats =
    document.getElementById("censusStats");

    if(!stats) return;

    stats.innerHTML=`

<div class="stat-card">

<div class="stat-icon">

${ICONS.users}

</div>

<div>

<div class="stat-label">

Total Penduduk

</div>

<div class="stat-value">

${fmt(total)}

</div>

</div>

</div>

<div class="stat-card">

<div class="stat-icon">

${ICONS.male}

</div>

<div>

<div class="stat-label">

Laki-laki

</div>

<div class="stat-value">

${fmt(laki)}

</div>

</div>

</div>

<div class="stat-card">

<div class="stat-icon">

${ICONS.female}

</div>

<div>

<div class="stat-label">

Perempuan

</div>

<div class="stat-value">

${fmt(perempuan)}

</div>

</div>

</div>

<div class="stat-card">

<div class="stat-icon">

${ICONS.family}

</div>

<div>

<div class="stat-label">

Kepala Keluarga

</div>

<div class="stat-value">

${fmt(kk)}

</div>

</div>

</div>

`;

}
/* ==========================================================
   GRAFIK
========================================================== */

function renderChart(data){

    const chart = document.getElementById("chart");

    if(!chart) return;

    const genMap = {};

    data.forEach(item=>{

        const gen=item["Generasi"];
        const jk=item["Jenis Kelamin"];

        if(!gen || !jk) return;

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

    const entries=Object.entries(genMap);

    if(entries.length===0){

        chart.innerHTML="<p>Tidak ada data.</p>";

        return;

    }

    let max=0;

    entries.forEach(([_,v])=>{

        if(v.laki>max) max=v.laki;

        if(v.perempuan>max) max=v.perempuan;

    });

    chart.innerHTML=entries.map(([nama,v])=>`

        <div class="chart-group">

            <div class="gen">

                ${nama}

            </div>

            <div class="bars">

                <div class="bar-track">

                    <div
                        class="bar-fill male"
                        style="width:${(v.laki/max)*100}%">

                        ${v.laki}

                    </div>

                </div>

                <div class="bar-track">

                    <div
                        class="bar-fill female"
                        style="width:${(v.perempuan/max)*100}%">

                        ${v.perempuan}

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

    renderTopics();

    renderStats(data);

    renderChart(data);

}
/* ==========================================================
   TOPIK
========================================================== */

const TOPICS = [

    {
        title:"Jenis Kelamin",
        icon:"👥",
        field:"Jenis Kelamin"
    },

    {
        title:"Generasi",
        icon:"🧑",
        field:"Generasi"
    },

    {
        title:"Pendidikan",
        icon:"🎓",
        field:"Pendidikan"
    },

    {
        title:"Mobilitas",
        icon:"🚶",
        field:"Mobilitas"
    },

    {
        title:"Disabilitas",
        icon:"♿",
        field:"Disabilitas"
    },

    {
        title:"Kelahiran",
        icon:"👶",
        field:"Kelahiran"
    },

    {
        title:"Kematian",
        icon:"🕊️",
        field:"Kematian"
    }

];

/* ==========================================================
   RENDER TOPIK
========================================================== */

function renderTopics(){

    const grid = document.getElementById("topicsGrid");

    if(!grid) return;

    grid.innerHTML = "";

    TOPICS.forEach(function(item){

        const jumlahKategori = new Set(
            PENDUDUK
            .map(p=>p[item.field])
            .filter(v=>v && v!=="")
        ).size;

        const card=document.createElement("div");

        card.className="topic-card";

        card.innerHTML=`

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

        card.onclick=function(){

            openTopic(item);

        };

        grid.appendChild(card);

    });

}

/* ==========================================================
   MODAL
========================================================== */

function openTopic(topic){

    const modal=document.getElementById("topicModal");

    const title=document.getElementById("topicModalTitle");

    const body=document.getElementById("topicModalBody");

    if(!modal || !title || !body) return;

    title.textContent=topic.title;

    const hasil={};

    PENDUDUK.forEach(function(p){

        const key=p[topic.field] || "-";

        hasil[key]=(hasil[key]||0)+1;

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

    body.innerHTML=html;

    modal.hidden=false;

}

/* ==========================================================
   TUTUP MODAL
========================================================== */

document.addEventListener("click",function(e){

    if(e.target.hasAttribute("data-close")){

        document.getElementById("topicModal").hidden=true;

    }

});
/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded",function(){

    initMenu();

    loadData();

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
   KLIK DI LUAR MODAL
========================================================== */

window.addEventListener("click",function(e){

    const modal=document.getElementById("topicModal");

    if(!modal) return;

    if(e.target===modal){

        modal.hidden=true;

    }

});

/* ==========================================================
   RESIZE CHART
========================================================== */

window.addEventListener("resize",function(){

    if(!PENDUDUK.length) return;

    if(pendudukChart){

        pendudukChart.resize();

    }

});

/* ==========================================================
   DEBUG
========================================================== */

console.log("===================================");

console.log("Dashboard Penduduk Kututegal");

console.log("KKN Universitas Tidar");

console.log("===================================");