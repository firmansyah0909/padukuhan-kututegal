"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const PROFIL_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1435619274&single=true&output=csv";

/* ==========================================
   GLOBAL
========================================== */

let profil = {};

/* ==========================================
   LOAD CSV
========================================== */

function loadCSV(url){

    return new Promise((resolve,reject)=>{

        Papa.parse(url,{

            download:true,

            header:true,

            skipEmptyLines:true,

            complete:(result)=>{

                resolve(result.data);

            },

            error:(err)=>{

                reject(err);

            }

        });

    });

}

/* ==========================================
   GOOGLE DRIVE IMAGE
========================================== */

function driveImage(url){

    if(!url) return "";

    const match=url.match(/\/d\/(.*?)\//);

    if(match){

        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;

    }

    return url;

}

/* ==========================================
   INIT
========================================== */

async function init(){

    try{

        const data=await loadCSV(PROFIL_CSV);

        if(data.length===0) return;

        profil=data[0];

        renderProfil();

    }

    catch(err){

        console.error(err);

    }

}

document.addEventListener(

    "DOMContentLoaded",

    init

);
/* ==========================================
   RENDER PROFIL
========================================== */

function renderProfil(){

    /* ===============================
       NAMA PADUKUHAN
    =============================== */

    document.getElementById("profilNama").textContent =
        profil["Nama Padukuhan"] || "-";


    /* ===============================
       DESKRIPSI
    =============================== */

    document.getElementById("profilDeskripsi").textContent =
        profil["Deskripsi"] || "-";


    /* ===============================
       FOTO BALAI
    =============================== */

    const foto=document.getElementById("profilFoto");

    foto.src=driveImage(profil["Foto"]);

    foto.alt=profil["Nama Padukuhan"];


    /* ===============================
       SEJARAH
    =============================== */

    document.getElementById("profilSejarah").innerHTML=`

        <p>

            ${profil["Sejarah"] || "-"}

        </p>

    `;


    /* ===============================
       VISI
    =============================== */

    document.getElementById("profilVisi").innerHTML=`

        <p>

            ${profil["Visi"] || "-"}

        </p>

    `;


    /* ===============================
       MISI
    =============================== */

    let daftarMisi="";

    if(profil["Misi"]){

        const items=profil["Misi"]
            .split(/\n|;/)
            .map(item=>item.trim())
            .filter(item=>item!="");

        daftarMisi=items
            .map(item=>`<li>${item}</li>`)
            .join("");

    }

    document.getElementById("profilMisi").innerHTML=`

        <ul>

            ${daftarMisi}

        </ul>

    `;


    /* ===============================
       POTENSI
    =============================== */

    let daftarPotensi="";

    if(profil["Potensi"]){

        const items=profil["Potensi"]
            .split(",")
            .map(item=>item.trim());

        daftarPotensi=items
            .map(item=>`<li>${item}</li>`)
            .join("");

    }

    document.getElementById("profilPotensi").innerHTML=`

        <p>

            <strong>Alamat</strong><br>

            ${profil["Alamat"]}

        </p>

        <br>

        <p>

            <strong>RW :</strong>

            ${profil["RW"]}

        </p>

        <p>

            <strong>RT :</strong>

            ${profil["RT"]}

        </p>

        <br>

        <strong>Potensi Padukuhan</strong>

        <ul>

            ${daftarPotensi}

        </ul>

    `;

}
/* ==========================================
   GOOGLE MAPS
========================================== */

const maps=document.getElementById("profilMaps");

if(maps){

    if(profil["Maps"]){

        let mapLink=profil["Maps"].trim();

        // Jika yang dimasukkan link Google Maps biasa
        if(
            mapLink.includes("maps.app.goo.gl") ||
            mapLink.includes("google.com/maps")
        ){

            maps.innerHTML=`

                <a
                    href="${mapLink}"
                    target="_blank"
                    class="map-button">

                    📍 Buka Lokasi di Google Maps

                </a>

            `;

        }

        // Jika menggunakan link embed
        else{

            maps.innerHTML=`

                <iframe

                    src="${mapLink}"

                    width="100%"

                    height="350"

                    style="border:0;border-radius:16px"

                    loading="lazy"

                    allowfullscreen>

                </iframe>

            `;

        }

    }

    else{

        maps.innerHTML=`

            <p>Lokasi belum tersedia.</p>

        `;

    }

}


/* ==========================================
   MENU MOBILE
========================================== */

const menuToggle=document.getElementById("menuToggle");

const navMobile=document.getElementById("navMobile");

if(menuToggle && navMobile){

    menuToggle.addEventListener("click",()=>{

        navMobile.classList.toggle("show");

        menuToggle.setAttribute(

            "aria-expanded",

            navMobile.classList.contains("show")

        );

    });

}


/* ==========================================
   ICON SVG
========================================== */

document.querySelectorAll("svg").forEach(svg=>{

    svg.setAttribute("stroke","currentColor");

    svg.setAttribute("fill","none");

    svg.setAttribute("stroke-width","2");

});


/* ==========================================
   END
========================================== */

console.log(

    "Profil Padukuhan berhasil dimuat."

);