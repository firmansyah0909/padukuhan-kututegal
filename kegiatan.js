"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const KEGIATAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1965206403&single=true&output=csv";

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
/* ==========================================
   TAMPILKAN KEGIATAN
========================================== */

function renderKegiatan() {

    const container = document.getElementById("kegiatanContainer");

    if (!container) return;

    if (KEGIATAN.length === 0) {

        container.innerHTML = `

            <div class="empty">

                Belum ada kegiatan.

            </div>

        `;

        return;

    }

    container.innerHTML = "";

    KEGIATAN.forEach(function(item){

        container.innerHTML += `

        <article class="kegiatan-card">

            <img
                class="kegiatan-img"
                src="${convertDriveImage(item["Foto"])}"
                alt="${item["Judul"]}">

            <div class="kegiatan-body">

                <span class="badge ${getBadgeClass(item["Status"])}">

                    ${item["Status"]}

                </span>

                <h2 class="kegiatan-title">

                    ${item["Judul"]}

                </h2>

                <p class="kegiatan-desc">

                    ${item["Deskripsi"]}

                </p>

                <div class="kegiatan-date">

                    📅
                    ${formatTanggal(item["Tanggal Mulai"])}
                    -
                    ${formatTanggal(item["Tanggal Selesai"])}

                </div>

                ${
                    item["Link"]

                    ?

                    `<a
                        class="kegiatan-link"
                        href="${item["Link"]}"
                        target="_blank">

                        Informasi Selengkapnya →

                    </a>`

                    :

                    ""

                }

            </div>

        </article>

        `;

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

    if(!url) return "images/no-image.png";

    if(url.includes("drive.google.com")){

        const match = url.match(/[-\w]{25,}/);

        if(match){

            return "https://drive.google.com/thumbnail?id="+match[0]+"&sz=w1000";

        }

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