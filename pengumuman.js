"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const PENGUMUMAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=1032221951&single=true&output=csv";

/* ==========================================
   GLOBAL
========================================== */

let PENGUMUMAN = [];

/* ==========================================
   MENU MOBILE
========================================== */

function initMenu(){

    const toggle=document.getElementById("menuToggle");
    const nav=document.getElementById("navMobile");

    if(!toggle || !nav) return;

    toggle.addEventListener("click",function(){

        const open=nav.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            String(open)
        );

    });

}

/* ==========================================
   LOAD CSV
========================================== */

function loadPengumuman(){

    Papa.parse(PENGUMUMAN_CSV,{

        download:true,

        header:true,

        skipEmptyLines:true,

        complete:function(result){

            PENGUMUMAN=result.data.filter(function(item){

                return (item["Aktif"] || "")
                .trim()
                .toLowerCase()=="ya";

            });

            renderPengumuman();

        },

        error:function(err){

            console.error(err);

        }

    });

}
/* ==========================================
   TAMPILKAN PENGUMUMAN
========================================== */

function parseTanggal(str){

    if(!str) return null;

    const p = str.trim().split("/");

    return new Date(
        Number(p[2]),
        Number(p[1])-1,
        Number(p[0])
    );

}

function renderPengumuman(){

    const container=document.getElementById("pengumumanContainer");

    if(!container) return;

    if(PENGUMUMAN.length===0){

        container.innerHTML=`
            <div class="empty">
                Belum ada pengumuman.
            </div>
        `;

        return;

    }

    container.innerHTML="";

    const hariIni=new Date();

    hariIni.setHours(0,0,0,0);

    PENGUMUMAN.forEach(function(item){

        const tanggalMulai=parseTanggal(item["Tanggal Mulai"]);
        const tanggalSelesai=parseTanggal(item["Tanggal Selesai"]);

        tanggalMulai.setHours(0,0,0,0);
        tanggalSelesai.setHours(23,59,59,999);

        let status="";
        let badgeClass="";

        if(hariIni < tanggalMulai){

            status="Akan Datang";
            badgeClass="badge-upcoming";

        }
        else if(hariIni <= tanggalSelesai){

            status="Sedang Berlangsung";
            badgeClass="badge-ongoing";

        }
        else{

            status="Selesai";
            badgeClass="badge-finished";

        }

        container.innerHTML += `

        <article class="pengumuman-card">

            <div class="pengumuman-body">

                <span class="badge ${badgeClass}">
                    ${status}
                </span>

                <h2 class="pengumuman-title">
                    ${item["Judul"]}
                </h2>

                <p class="pengumuman-desc">
                    ${item["Isi"]}
                </p>

                <div class="pengumuman-date">
                    📅 ${item["Tanggal Mulai"]} - ${item["Tanggal Selesai"]}
                </div>

            </div>

        </article>

        `;

    });

}
/* ==========================================
   BADGE PRIORITAS
========================================== */

function getBadgeClass(prioritas){

    if(!prioritas) return "badge-normal";

    prioritas=prioritas.toLowerCase();

    if(prioritas==="penting"){

        return "badge-danger";

    }

    if(prioritas==="sedang"){

        return "badge-warning";

    }

    return "badge-normal";

}

/* ==========================================
   INIT
========================================== */

function init(){

    initMenu();

    loadPengumuman();

}

/* ==========================================
   START
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    init

);