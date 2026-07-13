"use strict";

/* ==========================================
   GOOGLE SHEETS
========================================== */

const KEGIATAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1965206403&single=true&output=csv";

/* ==========================================
   AMBIL ID DARI URL
========================================== */

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

/* ==========================================
   GOOGLE DRIVE IMAGE
========================================== */

function convertDriveImage(url){

    if(!url) return "";

    const match = url.match(/\/d\/([^\/]+)/);

    if(match){

        return "https://drive.google.com/thumbnail?id="+match[1]+"&sz=w1200";

    }

    return url;

}

/* ==========================================
   PARSE TANGGAL
========================================== */

function parseTanggal(str){

    if(!str) return null;

    const p = str.split("/");

    return new Date(

        Number(p[2]),

        Number(p[1])-1,

        Number(p[0])

    );

}

/* ==========================================
   STATUS
========================================== */

function getStatus(mulai,selesai){

    const today = new Date();

    today.setHours(0,0,0,0);

    mulai=parseTanggal(mulai);

    selesai=parseTanggal(selesai);

    selesai.setHours(23,59,59,999);

    if(today < mulai){

        return{

            text:"Akan Datang",

            class:"badge-upcoming"

        };

    }

    if(today <= selesai){

        return{

            text:"Sedang Berlangsung",

            class:"badge-ongoing"

        };

    }

    return{

        text:"Selesai",

        class:"badge-finished"

    };

}

/* ==========================================
   LOAD DETAIL
========================================== */

Papa.parse(KEGIATAN_CSV,{

    download:true,

    header:true,

    skipEmptyLines:true,

    complete:function(result){

        const data=result.data.find(function(item){

            return item["No"]==id;

        });

        if(!data){

            document.querySelector(".detail-body").innerHTML=`

                <h2>

                    Data tidak ditemukan.

                </h2>

            `;

            return;

        }

        const status=getStatus(

            data["Tanggal Mulai"],

            data["Tanggal Selesai"]

        );

        document.getElementById("detailFoto").src=

            convertDriveImage(data["Foto"]);

        document.getElementById("detailJudul").textContent=

            data["Judul"];

        document.getElementById("detailTanggal").textContent=

            data["Tanggal Mulai"]+

            " - "+

            data["Tanggal Selesai"];

        document.getElementById("detailJam").textContent=

            data["Jam"];

        document.getElementById("detailLokasi").textContent=

            data["Lokasi"];

        document.getElementById("detailPJ").textContent=

            data["Penanggung Jawab"];

        document.getElementById("detailKontak").textContent=

            data["Kontak"];

        document.getElementById("detailDeskripsi").textContent=

            data["Deskripsi"];

        const badge=document.getElementById("detailStatus");

        badge.textContent=status.text;

        badge.classList.add(status.class);

    }

});