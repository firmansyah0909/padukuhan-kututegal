"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const KEGIATAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1965206403&single=true&output=csv&t=" + Date.now();

/* ==========================================
   GLOBAL
========================================== */

let KEGIATAN = [];

/* ==========================================
   MENU MOBILE
========================================== */

function initMenu() {

    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navMobile");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {

        const open = nav.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            String(open)
        );

    });

}

/* ==========================================
   LOAD DATA DARI SPREADSHEET
========================================== */

function loadKegiatan() {

    Papa.parse(KEGIATAN_CSV, {

        download: true,

        header: true,

        skipEmptyLines: true,

        complete: function (result) {

            KEGIATAN = result.data.filter(function(item){

                return (item["Aktif"] || "").trim().toLowerCase() === "ya";

            });

            renderKegiatan();

        },

        error: function (err) {

            console.error(err);

        }

    });

}
function parseTanggal(str){

    if(!str) return null;

    str = str.trim();

    if(str.includes("/")){

        const p = str.split("/");

        return new Date(
            Number(p[2]),
            Number(p[1]) - 1,
            Number(p[0])
        );

    }

    return new Date(str);

}
/* ==========================================
   NAMA BULAN
========================================== */

const BULAN = [

    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"

];

/* ==========================================
   STATUS KEGIATAN
========================================== */

function getStatus(item){

    const hariIni = new Date();

    hariIni.setHours(0,0,0,0);

    const mulai = parseTanggal(item["Tanggal Mulai"]);

    const selesai = parseTanggal(item["Tanggal Selesai"]);

    selesai.setHours(23,59,59,999);

    if(hariIni < mulai){

        return{
            text:"Akan Datang",
            badge:"badge-upcoming",
            order:2
        };

    }

    if(hariIni <= selesai){

        return{
            text:"Sedang Berlangsung",
            badge:"badge-ongoing",
            order:1
        };

    }

    return{

        text:"Selesai",
        badge:"badge-finished",
        order:3

    };

}

/* ==========================================
   GROUP KEGIATAN PER BULAN
========================================== */

function kelompokkanBulan(){

    const data={};

    BULAN.forEach(function(nama){

        data[nama]=[];

    });

    KEGIATAN.forEach(function(item){

        const tanggal=parseTanggal(item["Tanggal Mulai"]);

        const bulan=BULAN[tanggal.getMonth()];

        item.status=getStatus(item);

        data[bulan].push(item);

    });

    BULAN.forEach(function(bulan){

        data[bulan].sort(function(a,b){

            if(a.status.order!==b.status.order){

                return a.status.order-b.status.order;

            }

            return parseTanggal(a["Tanggal Mulai"])-parseTanggal(b["Tanggal Mulai"]);

        });

    });

    return data;

}
/* ==========================================
   TAMPILKAN KEGIATAN
========================================== */

function renderKegiatan(){

    const container = document.getElementById("kegiatanContainer");

    if(!container) return;

    if(KEGIATAN.length===0){

        container.innerHTML=`
            <div class="empty">
                Belum ada kegiatan.
            </div>
        `;

        return;

    }

    const dataBulan = kelompokkanBulan();

    container.innerHTML="";

    BULAN.forEach(function(bulan,index){

        const daftar = dataBulan[bulan];

        let isi="";

        daftar.forEach(function(item){

            isi+=`

            <article class="activity-card">

                <img
                    src="${convertDriveImage(item["Foto"])}"
                    alt="${item["Judul"]}"
                    class="activity-image"
                >

                <div class="activity-body">

                    <span class="badge ${item.status.badge}">
                        ${item.status.text}
                    </span>

                    <h2 class="activity-title">
                        ${item["Judul"]}
                    </h2>

                    <p class="activity-desc">
                        ${item["Deskripsi"]}
                    </p>

                    <div class="activity-date">
                        📅 ${item["Tanggal Mulai"]} - ${item["Tanggal Selesai"]}
                    </div>

                    <a
                        href="detail-kegiatan.html?id=${item["No"]}"
                        class="activity-link"
                        target="_blank"
                    >
                        Informasi Selengkapnya →
                    </a>

                </div>

            </article>

            `;

        });

        container.innerHTML += `

        <div class="bulan-item">

            <button
                class="bulan-header ${index==0?'active':''}"
            >

                <span>${bulan}</span>

                <span class="bulan-icon">
                    ${index==0?'−':'+'}
                </span>

            </button>

            <div
                class="bulan-content"
                style="display:${index==0?'block':'none'}"
            >

                ${
                    daftar.length
                    ?
                    isi
                    :
                    `<div class="empty-bulan">
                        Belum ada kegiatan.
                    </div>`
                }

            </div>

        </div>

        `;

    });

    initAccordion();

}
function initAccordion(){

    const headers = document.querySelectorAll(".bulan-header");

    headers.forEach(function(header){

        header.addEventListener("click", function(){

            const content = header.nextElementSibling;
            const icon = header.querySelector(".bulan-icon");
            const isOpen = header.classList.contains("active");

            // Tutup semua bulan
            headers.forEach(function(item){

                item.classList.remove("active");
                item.querySelector(".bulan-icon").textContent = "+";
                item.nextElementSibling.style.display = "none";

            });

            // Kalau tadi belum terbuka, buka
            if(!isOpen){

                header.classList.add("active");
                icon.textContent = "−";
                content.style.display = "block";

            }

        });

    });

}
/* ==========================================
   BADGE STATUS
========================================== */

function getBadgeClass(status){

    status = (status || "").toLowerCase();

    if(status.includes("sedang")){

        return "badge-success";

    }

    if(status.includes("akan")){

        return "badge-warning";

    }

    if(status.includes("selesai")){

        return "badge-secondary";

    }

    return "badge-primary";

}
/* ==========================================
   GOOGLE DRIVE IMAGE
========================================== */

function convertDriveImage(url){

    if(!url) return "";

    const match = url.match(/\/d\/([^\/]+)/);

    if(match){

        return "https://drive.google.com/thumbnail?id=" + match[1] + "&sz=w1200";

    }

    return url;

}

/* ==========================================
   FORMAT TANGGAL
========================================== */

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    return tanggal;

}

/* ==========================================
   INIT
========================================== */

document.addEventListener("DOMContentLoaded",function(){

    initMenu();

    loadKegiatan();

});