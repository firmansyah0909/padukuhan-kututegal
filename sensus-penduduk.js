"use strict";

/* ======================================================
   ICON SVG
====================================================== */

var ICONS = {

users:
'<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',

family:
'<svg class="icon" viewBox="0 0 24 24"><circle cx="8" cy="6" r="3"/><circle cx="16" cy="6" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M14 21v-2a4 4 0 0 1 3-3.9"/></svg>',

education:
'<svg class="icon" viewBox="0 0 24 24"><path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>',

mobility:
'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M5 21l3-7 4 1 3 4"/><path d="M8 14l-1-4 5-1 3 3"/></svg>',

disability:
'<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"/><path d="M9 6v6h5l3 6"/><path d="M9 12a6 6 0 1 0 5 9"/></svg>',

housing:
'<svg class="icon" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6"/></svg>',

birth:
'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',

death:
'<svg class="icon" viewBox="0 0 24 24"><path d="M8 22V9a4 4 0 0 1 8 0v13"/><line x1="12" y1="4" x2="12" y2="9"/><line x1="9.5" y1="6" x2="14.5" y2="6"/></svg>',

user:
'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg>',

clipboard:
'<svg class="icon" viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>'

};

/* ======================================================
   FORMAT ANGKA
====================================================== */

function fmt(n){

return typeof n==="number"

? n.toLocaleString("id-ID")

: n;

}

/* ======================================================
   MENU MOBILE
====================================================== */

function initMenu(){

var toggle=document.getElementById("menuToggle");

var nav=document.getElementById("navMobile");

if(!toggle||!nav)return;

toggle.addEventListener("click",function(){

var open=nav.classList.toggle("open");

toggle.setAttribute("aria-expanded",String(open));

});

}

/* ======================================================
   GLOBAL VARIABLE
====================================================== */

let PENDUDUK=[];

let TOPICS=[];

let RT_OPTIONS=[];

let GEN_OPTIONS=[];

let JK_OPTIONS=[];

/* ======================================================
   MEMBUAT HTML TABEL MODAL
====================================================== */

function topicTableHtml(d){

let head="<tr><th>"+d.rowHeader+"</th>";

d.cols.forEach(function(c){

head+="<th>"+c+"</th>";

});

head+="</tr>";

let body=d.rows.map(function(r){

return "<tr><th>"+r.label+"</th>"+

r.values.map(function(v){

return "<td>"+v+"</td>";

}).join("")+

"</tr>";

}).join("");

return `
<div class="table-wrap">

<table class="data-table">

<thead>${head}</thead>

<tbody>${body}</tbody>

</table>

</div>
`;

}
/* ======================================================
   MEMBACA GOOGLE SHEET
====================================================== */
/* ======================================================
   FILL SELECT
====================================================== */

function fillSelect(el, options){

    if(!el) return;

    el.innerHTML = options.map(function(o){

        return `<option value="${o}">${o}</option>`;

    }).join("");

}


/* ======================================================
   FILTER DATA
====================================================== */

function filterPenduduk(rt, gen, jk){

    return PENDUDUK.filter(function(p){

        return (

            (rt==="Semua RT" || p.rt===rt)

            &&

            (gen==="Semua Generasi" || p.generasi===gen)

            &&

            (jk==="Semua" || p.jk===jk)

        );

    });

}


/* ======================================================
   STAT CARD
====================================================== */

function statCard(label,value,icon,hint){

return `

<div class="stat-card">

<span class="stat-icon">

${ICONS[icon]}

</span>

<div>

<p class="stat-label">${label}</p>

<p class="stat-value">${value}</p>

<p class="stat-hint">${hint}</p>

</div>

</div>

`;

}
Papa.parse(
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1343644530&single=true&output=csv",
{

download:true,

header:true,

complete:function(result){

PENDUDUK=result.data

.filter(function(r){

return r["Nama"];

})

.map(function(r){

return{

nama:r["Nama"],
nik:r["NIK"],
rt:r["RT"],
jk:r["Jenis Kelamin"],
generasi:r["Generasi"],
keluarga:r["Status Keluarga"],
pendidikan:r["Pendidikan"],
mobilitas:r["Mobilitas"],
disabilitas:r["Disabilitas"],
rumah:r["Status Rumah"],
kelahiran:r["Kelahiran"],
kematian:r["Kematian"]

};

});

/* =====================================
   FILTER
===================================== */

RT_OPTIONS=[

"Semua RT",

...new Set(PENDUDUK.map(function(p){

return p.rt;

}))

];

GEN_OPTIONS=[

"Semua Generasi",

...new Set(PENDUDUK.map(function(p){

return p.generasi;

}))

];

JK_OPTIONS=[

"Semua",

...new Set(PENDUDUK.map(function(p){

return p.jk;

}))

];

/* =====================================
   HITUNG DATA
===================================== */

const rtMap={};

const keluargaMap={};

const pendidikanMap={};

const mobilitasMap={};

const disabilitasMap={};

const rumahMap={};

const kelahiranMap={};

const kematianMap={};

PENDUDUK.forEach(function(p){

rtMap[p.rt]=(rtMap[p.rt]||0)+1;

keluargaMap[p.keluarga]=(keluargaMap[p.keluarga]||0)+1;

pendidikanMap[p.pendidikan]=(pendidikanMap[p.pendidikan]||0)+1;

mobilitasMap[p.mobilitas]=(mobilitasMap[p.mobilitas]||0)+1;

disabilitasMap[p.disabilitas]=(disabilitasMap[p.disabilitas]||0)+1;

rumahMap[p.rumah]=(rumahMap[p.rumah]||0)+1;

kelahiranMap[p.kelahiran]=(kelahiranMap[p.kelahiran]||0)+1;

kematianMap[p.kematian]=(kematianMap[p.kematian]||0)+1;

});

console.log(PENDUDUK);
console.log(rtMap);
console.log(keluargaMap);
/* =====================================
   TOPICS
===================================== */

TOPICS = [

{
icon:"users",
label:"Jumlah Penduduk",
detail:{
title:"Jumlah Penduduk per RT",
rowHeader:"RT",
cols:["Jumlah Penduduk"],
rows:Object.keys(rtMap).map(function(k){
return{
label:k,
values:[rtMap[k]]
};
})
}
},

{
icon:"family",
label:"Keluarga",
detail:{
title:"Status Keluarga",
rowHeader:"Status",
cols:["Jumlah"],
rows:Object.keys(keluargaMap).map(function(k){
return{
label:k,
values:[keluargaMap[k]]
};
})
}
},

{
icon:"education",
label:"Pendidikan",
detail:{
title:"Pendidikan Penduduk",
rowHeader:"Pendidikan",
cols:["Jumlah"],
rows:Object.keys(pendidikanMap).map(function(k){
return{
label:k,
values:[pendidikanMap[k]]
};
})
}
},

{
icon:"mobility",
label:"Mobilitas",
detail:{
title:"Mobilitas Penduduk",
rowHeader:"Mobilitas",
cols:["Jumlah"],
rows:Object.keys(mobilitasMap).map(function(k){
return{
label:k,
values:[mobilitasMap[k]]
};
})
}
},

{
icon:"disability",
label:"Disabilitas",
detail:{
title:"Data Disabilitas",
rowHeader:"Status",
cols:["Jumlah"],
rows:Object.keys(disabilitasMap).map(function(k){
return{
label:k,
values:[disabilitasMap[k]]
};
})
}
},

{
icon:"housing",
label:"Perumahan",
detail:{
title:"Status Rumah",
rowHeader:"Status Rumah",
cols:["Jumlah"],
rows:Object.keys(rumahMap).map(function(k){
return{
label:k,
values:[rumahMap[k]]
};
})
}
},

{
icon:"birth",
label:"Kelahiran",
detail:{
title:"Data Kelahiran",
rowHeader:"Status",
cols:["Jumlah"],
rows:Object.keys(kelahiranMap).map(function(k){
return{
label:k,
values:[kelahiranMap[k]]
};
})
}
},

{
icon:"death",
label:"Kematian",
detail:{
title:"Data Kematian",
rowHeader:"Status",
cols:["Jumlah"],
rows:Object.keys(kematianMap).map(function(k){
return{
label:k,
values:[kematianMap[k]]
};
})
}
}

];

/* =====================================
   JALANKAN
===================================== */

console.log(TOPICS);

initTopics();
/* ======================================================
   FILL SELECT
====================================================== */

function fillSelect(el, options){

    if(!el) return;

    el.innerHTML = options.map(function(o){

        return `<option value="${o}">${o}</option>`;

    }).join("");

}


/* ======================================================
   FILTER DATA
====================================================== */

function filterPenduduk(rt, gen, jk){

    return PENDUDUK.filter(function(p){

        return (

            (rt==="Semua RT" || p.rt===rt)

            &&

            (gen==="Semua Generasi" || p.generasi===gen)

            &&

            (jk==="Semua" || p.jk===jk)

        );

    });

}


/* ======================================================
   STAT CARD
====================================================== */

function statCard(label,value,icon,hint){

return `

<div class="stat-card">

<span class="stat-icon">

${ICONS[icon]}

</span>

<div>

<p class="stat-label">${label}</p>

<p class="stat-value">${value}</p>

<p class="stat-hint">${hint}</p>

</div>

</div>

`;

}

initCensus();

}   // <-- penutup complete

}); // <-- penutup Papa.parse
/* ======================================================
   TAMPILKAN TOPIK
====================================================== */

function initTopics(){

var el=document.getElementById("topicsGrid");

var modal=document.getElementById("topicModal");

if(!el||!modal)return;

var titleEl=document.getElementById("topicModalTitle");

var bodyEl=document.getElementById("topicModalBody");

/* =======================
   CARD TOPIK
======================= */

el.innerHTML=TOPICS.map(function(t,i){

return(

'<button class="topic-card" type="button" data-topic="'+i+'">'+

'<span class="topic-icon">'+
(ICONS[t.icon]||"")+
'</span>'+

'<p class="topic-label">'+
t.label+
'</p>'+

'</button>'

);

}).join("");

/* =======================
   MODAL
======================= */

function openModal(i){

var t=TOPICS[i];

if(!t)return;

titleEl.textContent=t.detail.title;

bodyEl.innerHTML=topicTableHtml(t.detail);

modal.hidden=false;

document.body.style.overflow="hidden";

}

function closeModal(){

modal.hidden=true;

document.body.style.overflow="";

}

/* =======================
   EVENT
======================= */

el.addEventListener("click",function(e){

var card=e.target.closest("[data-topic]");

if(card){

openModal(Number(card.dataset.topic));

}

});

modal.addEventListener("click",function(e){

if(e.target.hasAttribute("data-close")){

closeModal();

}

});

document.addEventListener("keydown",function(e){

if(e.key==="Escape"&&!modal.hidden){

closeModal();

}

});

}
/* ======================================================
   INIT FILTER
====================================================== */

function initCensus(){

const rt=document.getElementById("filterRt");

const gen=document.getElementById("filterGen");

const jk=document.getElementById("filterJk");

const btn=document.getElementById("applyBtn");

fillSelect(rt,RT_OPTIONS);

fillSelect(gen,GEN_OPTIONS);

fillSelect(jk,JK_OPTIONS);

renderCensus(

"Semua RT",

"Semua Generasi",

"Semua"

);

btn.addEventListener("click",function(){

renderCensus(

rt.value,

gen.value,

jk.value

);

});

}
function renderCensus(rt, gen, jk){

    const data = PENDUDUK.filter(function(p){

        return (
            (rt==="Semua RT" || p.rt===rt) &&
            (gen==="Semua Generasi" || p.generasi===gen) &&
            (jk==="Semua" || p.jk===jk)
        );

    });

    /* ======================
       HITUNG STATISTIK
    ====================== */

    const total = data.length;

    const laki = data.filter(function(p){
        return p.jk==="Laki-laki";
    }).length;

    const perempuan = data.filter(function(p){
        return p.jk==="Perempuan";
    }).length;

    const kk = data.filter(function(p){
        return p.keluarga==="Kepala Keluarga";
    }).length;

    /* ======================
       STAT CARD
    ====================== */

    const stats=document.getElementById("censusStats");

    stats.innerHTML=`

    <div class="stat-card">
        <span class="stat-icon">${ICONS.users}</span>
        <div>
            <p class="stat-label">Total Penduduk</p>
            <p class="stat-value">${total}</p>
        </div>
    </div>

    <div class="stat-card">
        <span class="stat-icon">${ICONS.user}</span>
        <div>
            <p class="stat-label">Laki-laki</p>
            <p class="stat-value">${laki}</p>
        </div>
    </div>

    <div class="stat-card">
        <span class="stat-icon">${ICONS.user}</span>
        <div>
            <p class="stat-label">Perempuan</p>
            <p class="stat-value">${perempuan}</p>
        </div>
    </div>

    <div class="stat-card">
        <span class="stat-icon">${ICONS.family}</span>
        <div>
            <p class="stat-label">Kepala Keluarga</p>
            <p class="stat-value">${kk}</p>
        </div>
    </div>

    `;

    /* ======================
       GRAFIK
    ====================== */

    const chart=document.getElementById("chart");

    const genMap={};

    data.forEach(function(p){

        if(!genMap[p.generasi]){

            genMap[p.generasi]={

                laki:0,
                perempuan:0

            };

        }

        if(p.jk==="Laki-laki"){

            genMap[p.generasi].laki++;

        }else{

            genMap[p.generasi].perempuan++;

        }

    });

    chart.innerHTML="";

    Object.keys(genMap).forEach(function(g){

        chart.innerHTML+=`

        <div class="chart-group">

            <div class="chart-group-head">

                <span>${g}</span>

            </div>

            <div class="bar-track">

                <div class="bar-fill bar-laki"
                style="width:${genMap[g].laki*25}px">

                ${genMap[g].laki}

                </div>

            </div>

            <div class="bar-track">

                <div class="bar-fill bar-perempuan"
                style="width:${genMap[g].perempuan*25}px">

                ${genMap[g].perempuan}

                </div>

            </div>

        </div>

        `;

    });

}