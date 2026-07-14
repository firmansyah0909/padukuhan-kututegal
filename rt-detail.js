"use strict";

/* ==========================================================
   GOOGLE SHEETS
========================================================== */

/* ==========================================================
   MASTER RT
========================================================== */

const MASTER_RT_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=1522488510&single=true&output=csv";

/* ==========================================================
   BASE URL SEMUA SHEET RT
========================================================== */

const BASE_RT_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=";

const BASE_RT_END =
"&single=true&output=csv";
const STRUKTUR_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=95666213&single=true&output=csv";

/* ==========================================================
   GLOBAL
========================================================== */
let penduduk=[];

let struktur=[];

let masterRT=[];

const PARAMS = new URLSearchParams(window.location.search);

const RT =
PARAMS.get("rt") || "RT 01";

const GEN =
PARAMS.get("gen") || "Semua Generasi";

const JK =
PARAMS.get("jk") || "Semua";

/* ==========================================================
   LOAD CSV
========================================================== */

function loadCSV(url){

    return new Promise(function(resolve,reject){

        Papa.parse(url,{

            download:true,

            header:false,

            skipEmptyLines:true,

            complete:function(result){

                const rows = result.data;

                // Header ada di baris ke-4 (index 3)
                const header = rows[3];

                // Data mulai dari baris ke-5 (index 4)
                const data = rows.slice(4);

                const hasil = data.map(function(row){

                    const obj = {};

                    header.forEach(function(col,i){

                        obj[String(col).trim()] =
                            row[i] !== undefined
                            ? String(row[i]).trim()
                            : "";

                    });

                    return obj;

                });

                resolve(hasil);

            },

            error:function(err){

                reject(err);

            }

        });

    });

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
   NORMALIZE TEXT
========================================================== */

function normalize(value){

    return String(value || "")
        .trim()
        .toLowerCase();

}

async function loadMasterRT(){

    masterRT = await loadCSV(MASTER_RT_CSV);

}
async function loadMasterRT(){

    masterRT = await loadCSV(MASTER_RT_CSV);

}
function getGID(rt){

    const nomor = String(rt)
        .replace("RT","")
        .trim();

    const hasil = masterRT.find(function(item){

        return String(item["RT"]).trim() === nomor;

    });

    if(!hasil){

        throw new Error(
            "RT " + nomor + " tidak ditemukan di MASTER_RT"
        );

    }

    return hasil["GID"];

}
async function loadDataRT(rt){

    const gid = getGID(rt);

    console.log("RT :", rt);
    console.log("GID :", gid);

    const url =
        BASE_RT_URL +
        gid +
        BASE_RT_END;

    console.log("URL :", url);

    const data = await loadCSV(url);
    console.log("HEADER :", Object.keys(data[0]));
    console.log("DATA PERTAMA :", data[0]);

    return data.map(function(row){

        const obj={};

        Object.keys(row).forEach(function(key){

            obj[key.trim()] =
            typeof row[key]==="string"
                ? row[key].trim()
                : row[key];

        });

        return obj;

    });

}
/* ==========================================================
   MENU MOBILE
========================================================== */

function initMenu(){

    const menuToggle = document.getElementById("menuToggle");

    const navMobile = document.getElementById("navMobile");

    if(!menuToggle || !navMobile) return;

    menuToggle.addEventListener("click",function(){

        navMobile.classList.toggle("open");

        menuToggle.setAttribute(

            "aria-expanded",

            navMobile.classList.contains("open")

        );

    });

}

/* ==========================================================
   INIT
========================================================== */

async function init(){
    initMenu();

    try{

        await loadMasterRT();
                const info = masterRT.find(function(item){

            return String(item["RT"]).trim()===

            RT.replace("RT","").trim();

        });

        if(!info){

            alert("RT tidak ditemukan.");

            return;

        }
        penduduk = await loadDataRT(RT);

        console.log("RT :",RT);

        console.log("Jumlah :",penduduk.length);

        console.log(penduduk[0]);

        struktur = await loadCSV(STRUKTUR_CSV);
        console.log("STRUKTUR");
        console.log(struktur);

        console.log("STRUKTUR PERTAMA");
        console.log(struktur[0]);

        let judul =
        `Dashboard RT ${info["RT"]} / RW ${info["RW"]}`;

        if(GEN !== "Semua Generasi"){

            judul += ` • ${GEN}`;

        }

        if(JK !== "Semua"){

            judul += ` • ${JK}`;

        }

        document.getElementById("rtTitle").textContent = judul;


        let desc =
        `Data kependudukan RT ${info["RT"]} RW ${info["RW"]} Padukuhan Kututegal`;

        if(GEN !== "Semua Generasi"){

            desc += ` | ${GEN}`;

        }

        if(JK !== "Semua"){

            desc += ` | ${JK}`;

        }

        document.getElementById("rtDesc").textContent = desc;
        const rtNumber = RT
            .replace("RT","")
            .trim();

        let dataRT = [...penduduk];

        if(GEN !== "Semua Generasi"){

            dataRT = dataRT.filter(function(item){

                return normalize(item["Generasi"]) ===
                    normalize(GEN);

            });

        }

        if(JK !== "Semua"){

            dataRT = dataRT.filter(function(item){

                return normalize(item["Jenis Kelamin"]) ===
                    normalize(JK);

            });

        }

        const strukturRT = struktur.filter(function(item){

            return String(item["RT"]).trim() === rtNumber;

        });

        console.log("RT URL =", RT);
        console.log("RT Number =", rtNumber);
        console.log("Jumlah Struktur =", strukturRT.length);
        console.log("Struktur RT =", strukturRT);
        if(dataRT.length===0){

        renderStruktur(strukturRT);

        document.getElementById("rtStats").innerHTML=
        "<p style='text-align:center'>Tidak ada data sesuai filter.</p>";

        document.getElementById("chart").innerHTML=
        "<p style='text-align:center'>Tidak ada data grafik.</p>";

        return;

    }
        renderStruktur(strukturRT);

        renderStats(dataRT);

        renderChart(dataRT);

    }

    catch(err){

        console.error(err);

    }

}

document.addEventListener(

    "DOMContentLoaded",

    init

);
/* ==========================================================
   STRUKTUR ORGANISASI
========================================================== */

function renderStruktur(data){

    const container=document.getElementById("strukturRT");

    if(!container) return;

    if(data.length===0){

        container.innerHTML=`

            <p style="text-align:center">

                Data struktur organisasi belum tersedia.

            </p>

        `;

        return;

    }

    // Kelompokkan berdasarkan level

    const levels={};

    data.forEach(item=>{

        const level=item["Level"];

        if(!levels[level]){

            levels[level]=[];

        }

        levels[level].push(item);

    });

    // Urutkan level

    const urut=Object.keys(levels)

    .sort((a,b)=>a-b);

    container.innerHTML=urut.map(level=>`

        <div class="org-level">

            ${levels[level].map(item=>`

                <div class="org-box">

                    <div class="org-title">

                        ${item["Jabatan"]}

                    </div>

                    <div class="org-name">

                        ${item["Nama"]}

                    </div>

                </div>

            `).join("")}

        </div>

    `).join("");

}
/* ==========================================================
   STATISTIK
========================================================== */

function renderStats(data){

    const stats=document.getElementById("rtStats");

    if(!stats) return;

    const total=data.length;

    const laki=data.filter(function(d){

        return normalize(d["Jenis Kelamin"])==="laki-laki";

    }).length;

    const perempuan=data.filter(function(d){

        return normalize(d["Jenis Kelamin"])==="perempuan";

    }).length;

    const kk=data.filter(function(d){

        return normalize(d["Status Keluarga"])==="kepala keluarga";

    }).length;

    stats.innerHTML=`

        <div class="stat-card">

            <div class="stat-icon">👥</div>

            <div>

                <div class="stat-label">

                    Total Penduduk

                </div>

                <div class="stat-value">

                    ${total}

                </div>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">👨</div>

            <div>

                <div class="stat-label">

                    Laki-laki

                </div>

                <div class="stat-value">

                    ${laki}

                </div>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">👩</div>

            <div>

                <div class="stat-label">

                    Perempuan

                </div>

                <div class="stat-value">

                    ${perempuan}

                </div>

            </div>

        </div>

        <div class="stat-card">

            <div class="stat-icon">🏠</div>

            <div>

                <div class="stat-label">

                    Kepala Keluarga

                </div>

                <div class="stat-value">

                    ${kk}

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   GRAFIK
========================================================== */

function renderChart(data){

    const chart=document.getElementById("chart");
    if(!data.length){

    chart.innerHTML=`

        <p style="text-align:center">

            Tidak ada data penduduk.

        </p>

    `;

    return;

}

    if(!chart) return;

    const hasil={};

    data.forEach(function(item){

        const gen=(item["Generasi"] || "-").trim();

        if(!hasil[gen]){

            hasil[gen]={

                laki:0,

                perempuan:0

            };

        }

           const jk = normalize(item["Jenis Kelamin"]);

        if(jk==="laki-laki"){

            hasil[gen].laki++;

        }
        else if(jk==="perempuan"){

            hasil[gen].perempuan++;

        }

    });

const values = Object.values(hasil).flatMap(function(v){

    return [

        v.laki,

        v.perempuan

    ];

});

const max = values.length > 0

    ? Math.max(...values)

    : 1;

chart.innerHTML = Object.entries(hasil).map(function([gen,val]){

    return `

        <div class="chart-group">

            <div class="gen">

                ${gen}

            </div>

            <div class="bars">

                <div class="bar-track">

                    <div

                        class="bar-fill male"

                        style="width:${(val.laki/max)*100}%">

                        ${val.laki}

                    </div>

                </div>

                <div class="bar-track">

                    <div

                        class="bar-fill female"

                        style="width:${(val.perempuan/max)*100}%">

                        ${val.perempuan}

                    </div>

                </div>

            </div>

        </div>

    `;

}).join("");
}
