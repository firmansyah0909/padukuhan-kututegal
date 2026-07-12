"use strict";

/* ==========================================================
   GOOGLE SHEETS
========================================================== */

const PENDUDUK_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1343644530&single=true&output=csv";

const STRUKTUR_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1068409205&single=true&output=csv";

/* ==========================================================
   GLOBAL
========================================================== */

let penduduk=[];

let struktur=[];

const PARAMS=new URLSearchParams(window.location.search);

const RT=PARAMS.get("rt") || "RT 01";

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

        penduduk=await loadCSV(PENDUDUK_CSV);

        struktur=await loadCSV(STRUKTUR_CSV);

        document.getElementById("rtTitle").textContent=
        "Dashboard "+RT;

        document.getElementById("rtDesc").textContent=
        "Informasi lengkap "+RT;

        const dataRT=penduduk.filter(function(item){

            return item["RT"]===RT;

        });

        const strukturRT=struktur.filter(function(item){

            return item["RT"]===RT;

        });

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

    const laki=data.filter(
        d=>d["Jenis Kelamin"]==="Laki-laki"
    ).length;

    const perempuan=data.filter(
        d=>d["Jenis Kelamin"]==="Perempuan"
    ).length;

    const kk=data.filter(
        d=>d["Status Keluarga"]==="Kepala Keluarga"
    ).length;

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

    if(!chart) return;

    const hasil={};

    data.forEach(function(item){

        const gen=item["Generasi"];

        if(!hasil[gen]){

            hasil[gen]={

                laki:0,

                perempuan:0

            };

        }

        if(item["Jenis Kelamin"]==="Laki-laki"){

            hasil[gen].laki++;

        }else{

            hasil[gen].perempuan++;

        }

    });

    const max=Math.max(

        ...Object.values(hasil).flatMap(v=>[

            v.laki,

            v.perempuan

        ])

    );

    chart.innerHTML=Object.entries(hasil).map(([gen,val])=>`

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

    `).join("");

}