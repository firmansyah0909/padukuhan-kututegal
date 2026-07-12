"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const PENGUMUMAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1290842795&single=true&output=csv";

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

    PENGUMUMAN.forEach(function(item){

        container.innerHTML+=`

        <article class="pengumuman-card">

            <div class="pengumuman-body">

                <span class="badge ${getBadgeClass(item["Prioritas"])}">

                    ${item["Prioritas"]}

                </span>

                <h2 class="pengumuman-title">

                    ${item["Judul"]}

                </h2>

                <p class="pengumuman-desc">

                    ${item["Isi"]}

                </p>

                <div class="pengumuman-date">

                    📅 ${item["Tanggal"]}

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