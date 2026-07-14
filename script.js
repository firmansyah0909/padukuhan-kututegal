const KEGIATAN_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=1965206403&single=true&output=csv";
"use strict";
const PROFIL_CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Artizks0Ze1NlaZatB_LSsDOdlHXLHlSaAb8ZtFyUR4X6P_fPBkTKeRxgLAT9ozzidjNEh9huPd5/pub?gid=1021807245&single=true&output=csv";

/* ====== Inline SVG icons (stroke uses currentColor) ====== */
var ICONS = {
  users:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  clipboard:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>',
  tractor:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 4h9l1 5"/><circle cx="7" cy="17" r="3"/><circle cx="18" cy="17" r="2"/><path d="M10 17H4V6"/><path d="M13 9h6l2 5"/></svg>',
  briefcase:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  wheat:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22V8"/><path d="M12 8c-2 0-3-2-3-4 2 0 3 2 3 4Z"/><path d="M12 8c2 0 3-2 3-4-2 0-3 2-3 4Z"/><path d="M12 14c-2 0-3-2-3-4 2 0 3 2 3 4Z"/><path d="M12 14c2 0 3-2 3-4-2 0-3 2-3 4Z"/></svg>',
  building:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="16" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/></svg>',
  user:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg>',
  arrow:
    '<svg class="icon icon-sm service-arrow" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  chart:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7"/><rect x="12" y="6" width="3" height="11"/><rect x="17" y="13" width="3" height="4"/></svg>',
  family:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="8" cy="6" r="3"/><circle cx="16" cy="6" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M14 21v-2a4 4 0 0 1 3-3.9"/><circle cx="12" cy="17" r="2"/></svg>',
  mobility:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M5 21l3-7 4 1 3 4"/><path d="M8 14l-1-4 5-1 3 3 3-1"/></svg>',
  disability:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"/><path d="M9 6v6h5l3 6"/><path d="M9 12a6 6 0 1 0 5 9"/></svg>',
  education:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><line x1="22" y1="9" x2="22" y2="14"/></svg>',
  birth:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M9 7c0 1 .8 2 1.5 2"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
  death:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M8 22V9a4 4 0 0 1 8 0v13"/><line x1="12" y1="4" x2="12" y2="9"/><line x1="9.5" y1="6" x2="14.5" y2="6"/><line x1="6" y1="22" x2="18" y2="22"/></svg>',
  housing:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6"/></svg>',
  calendar:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  megaphone:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 11v2l11 4V7L3 11Z"/><path d="M14 8c2 1 4 2 7 2v4c-3 0-5 1-7 2"/><path d="M6 15l1.5 4h2L8 14"/></svg>',
};

function fmt(n) {
  return n.toLocaleString("id-ID");
}

/* ====== Mobile menu toggle (shared) ====== */
function initMenu() {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("navMobile");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ====== Home page ====== */
var HOME_STATS = [
  { label: "Total Penduduk", value: "2.418", icon: "users", hint: "Jiwa terdata" },
  { label: "Kepala Keluarga", value: "742", icon: "clipboard", hint: "KK" },
  { label: "Petani", value: "318", icon: "tractor", hint: "Jiwa" },
  { label: "UMKM", value: "64", icon: "briefcase", hint: "Unit usaha" },
];

var SERVICES = [

  {
    title: "Sensus Penduduk",
    desc: "Data jumlah, distribusi, dan struktur penduduk berdasarkan RT, generasi, dan jenis kelamin.",
    icon: "users",
    href: "sensus-penduduk.html"
  },

  {
    title: "Jadwal Kegiatan",
    desc: "Informasi agenda dan kegiatan yang sedang maupun akan dilaksanakan di Padukuhan Kututegal.",
    icon: "calendar",
    href: "kegiatan.html"
  },

  {
    title: "Pengumuman",
    desc: "Informasi terbaru, pemberitahuan, dan agenda penting bagi masyarakat Padukuhan Kututegal.",
    icon: "megaphone",
    href: "pengumuman.html"
  }

];

function statCard(s) {
  return (
    '<div class="stat-card">' +
    '<span class="stat-icon">' +
    ICONS[s.icon] +
    "</span>" +
    '<div style="min-width:0">' +
    '<p class="stat-label">' +
    s.label +
    "</p>" +
    '<p class="stat-value">' +
    s.value +
    "</p>" +
    (s.hint ? '<p class="stat-hint">' + s.hint + "</p>" : "") +
    "</div>" +
    "</div>"
  );
}

function initHome() {
  var servicesEl = document.getElementById("services");
  if (!servicesEl) return;

  servicesEl.innerHTML = SERVICES.map(function (srv) {
    return `
      <a class="service-card" href="${srv.href}">
        <span class="service-icon">
          ${ICONS[srv.icon]}
        </span>

        <div class="service-content">
          <div class="service-head">
            <h3 class="service-title">${srv.title}</h3>
            ${ICONS.arrow}
          </div>

          <p class="service-desc">${srv.desc}</p>
        </div>
      </a>
    `;
  }).join("");
}
function loadProfil(){

    Papa.parse(PROFIL_CSV,{

        download:true,

        header:true,

        skipEmptyLines:true,

        complete:function(result){

            renderProfil(result.data);

        }

    });

}
function renderProfil(data){

    const card=document.getElementById("activityCard");

    if(!card) return;

    const profil=data[0];

    card.innerHTML=`

        <div class="activity-inner">

            <div class="activity-media">

                <img

                    src="${convertDriveImage(profil["Foto"])}"

                    alt="${profil["Nama Padukuhan"]}">

            </div>

            <div class="activity-body">

                <span class="badge">

                    Profil Padukuhan

                </span>

                <h3 class="activity-title">

                    ${profil["Nama Padukuhan"]}

                </h3>

                <p class="activity-text">

                    ${profil["Deskripsi"]}

                </p>

                <a

                    class="link-accent"

                    href="profil.html">

                    Informasi Selengkapnya

                </a>

            </div>

        </div>

    `;

}
function convertDriveImage(url){

    if(!url) return "";

    const match=url.match(/[-\w]{25,}/);

    if(!match) return url;

    return "https://drive.google.com/thumbnail?id="+match[0]+"&sz=w1000";

}
document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHome();
    loadProfil();
});