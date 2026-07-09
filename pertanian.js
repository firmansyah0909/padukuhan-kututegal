"use strict";

/* ====== Inline SVG icons (stroke uses currentColor) ====== */
var ICONS = {
  wheat:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22V8"/><path d="M12 8c-2.5 0-4-2.2-4-4.5 2.5 0 4 2.2 4 4.5Z"/><path d="M12 8c2.5 0 4-2.2 4-4.5-2.5 0-4 2.2-4 4.5Z"/><path d="M12 14c-2.5 0-4-2.2-4-4.5 2.5 0 4 2.2 4 4.5Z"/><path d="M12 14c2.5 0 4-2.2 4-4.5-2.5 0-4 2.2-4 4.5Z"/></svg>',
  land:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M2 20h20"/><path d="M4 20l4-9 4 4 4-7 4 12"/><circle cx="7" cy="6" r="2"/></svg>',
  tractor:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 4h9l1 5"/><circle cx="7" cy="17" r="3"/><circle cx="18" cy="17" r="2"/><path d="M10 17H4V6"/><path d="M13 9h6l2 5"/></svg>',
  water:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z"/></svg>',
  corn:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22c4-1 6-5 6-11 0-3-1-5-1-5s-2 1-3 3"/><path d="M12 22c-4-1-6-5-6-11 0-3 1-5 1-5s2 1 3 3"/><path d="M12 22V8"/></svg>',
  home:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6"/></svg>',
  trend:
    '<svg class="icon" viewBox="0 0 24 24"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>',
  users:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  group:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2"/><path d="M2 21v-2a5 5 0 0 1 10 0v2"/><path d="M14 21v-1a4 4 0 0 1 7-2.6"/></svg>',
};

function fmt(n) {
  return typeof n === "number" ? n.toLocaleString("id-ID") : n;
}

/* ====== Mobile menu toggle ====== */
function initMenu() {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("navMobile");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ====== Categories (topic cards + modal data) ====== */

function topicTableHtml(d) {

  let head = "<tr><th>" + d.rowHeader + "</th>";

  d.cols.forEach(function(c){
      head += "<th>" + c + "</th>";
  });

  head += "</tr>";

  let body = d.rows.map(function(row){

      return "<tr><th>" + row.label + "</th>" +

      row.values.map(function(v){

          return "<td>" + v + "</td>";

      }).join("")

      + "</tr>";

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
let TOPICS = [];
function initTopics() {
  var el = document.getElementById("topicsGrid");
  var modal = document.getElementById("topicModal");
  if (!el || !modal) return;

  var titleEl = document.getElementById("topicModalTitle");
  var bodyEl = document.getElementById("topicModalBody");

  el.innerHTML = TOPICS.map(function (t, i) {
    return (
      '<button class="topic-card" type="button" data-topic="' +
      i +
      '" title="' +
      t.label +
      '">' +
      '<span class="topic-icon">' +
      ICONS[t.icon] +
      "</span>" +
      '<p class="topic-label">' +
      t.label +
      "</p>" +
      "</button>"
    );
  }).join("");

  function openModal(i) {
    var t = TOPICS[i];
    if (!t) return;
    titleEl.textContent = t.detail.title;
    bodyEl.innerHTML = topicTableHtml(t.detail);
    bodyEl.scrollTop = 0;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  el.addEventListener("click", function (e) {
    var card = e.target.closest("[data-topic]");
    if (card) openModal(Number(card.getAttribute("data-topic")));
  });

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

/* ====== Farmer data (table + filter + chart) ====== */
var KOMODITAS_ORDER = ["Padi", "Jagung", "Cabai", "Sayuran", "Buah", "Ternak"];

var PETANI = [];
let RT_OPTIONS = [];
let KOMODITAS_OPTIONS = [];
let KEPEMILIKAN_OPTIONS = [];

Papa.parse(
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShayysmkyOCfvsNT57xbQw_ofl_mEnXXHcr6V4jxSTSFA0FeAopKuV-mTBeXa9jxwGcWMfCCZdZ8Us/pub?gid=0&single=true&output=csv",
{
    download: true,
    header: true,
    complete: function(result){

        PETANI = result.data
        
        .filter(r => r["Nama Petani"])
        .map(function(r){

            return{
                nama: r["Nama Petani"],
                rt: r["RT"],
                komoditas: r["Komoditas"],
                luas: parseFloat(r["Luas Lahan (Ha)"]),
                milik: r["Status Kepemilikan"]
            };
        });
RT_OPTIONS = [
    "Semua RT",
    ...new Set(PETANI.map(p => p.rt))
];

KOMODITAS_OPTIONS = [
    "Semua Komoditas",
    ...new Set(PETANI.map(p => p.komoditas))
];

KEPEMILIKAN_OPTIONS = [
    "Semua",
    ...new Set(PETANI.map(p => p.milik))
];
        // ================================
// Membuat Topic dari Spreadsheet
// ================================

const rtMap = {};

PETANI.forEach(function(p){

    if(!rtMap[p.rt]){

        rtMap[p.rt] = {
            petani:0,
            luas:0
        };

    }

    rtMap[p.rt].petani++;
    rtMap[p.rt].luas += p.luas;

});

// =====================
// Hitung Status Kepemilikan
// =====================

const kepemilikanMap = {};

PETANI.forEach(function(p){

    kepemilikanMap[p.milik] =
        (kepemilikanMap[p.milik] || 0) + 1;

});

// =====================
// Hitung Komoditas
// =====================

const komoditasMap = {};

PETANI.forEach(function(p){

    komoditasMap[p.komoditas] =
        (komoditasMap[p.komoditas] || 0) + 1;

});

// =====================
// TOPICS
// =====================

TOPICS = [

{
    icon:"users",
    label:"Jumlah Petani",
    detail:{
        title:"Jumlah Petani per RT",
        rowHeader:"RT",
        cols:["Jumlah Petani"],
        rows:Object.keys(rtMap).map(function(rt){
            return{
                label:rt,
                values:[rtMap[rt].petani]
            };
        })
    }
},

{
    icon:"land",
    label:"Luas Lahan",
    detail:{
        title:"Luas Lahan per RT",
        rowHeader:"RT",
        cols:["Luas (Ha)"],
        rows:Object.keys(rtMap).map(function(rt){
            return{
                label:rt,
                values:[rtMap[rt].luas.toFixed(2)]
            };
        })
    }
},

{
    icon:"home",
    label:"Status Kepemilikan",
    detail:{
        title:"Status Kepemilikan Lahan",
        rowHeader:"Status",
        cols:["Jumlah"],
        rows:Object.keys(kepemilikanMap).map(function(status){
            return{
                label:status,
                values:[kepemilikanMap[status]]
            };
        })
    }
},

{
    icon:"wheat",
    label:"Komoditas",
    detail:{
        title:"Komoditas Pertanian",
        rowHeader:"Komoditas",
        cols:["Jumlah Petani"],
        rows:Object.keys(komoditasMap).map(function(k){
            return{
                label:k,
                values:[komoditasMap[k]]
            };
        })
    }
}

];

initTopics();

initTopics();
        initPertanian();

    }
});


function fillSelect(el, options) {
  el.innerHTML = options
    .map(function (o) {
      return '<option value="' + o + '">' + o + "</option>";
    })
    .join("");
}

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

function statusBadge(milik) {
  var cls =
    milik === "Milik Sendiri"
      ? "badge-milik"
      : milik === "Sewa"
      ? "badge-sewa"
      : "badge-bagi";
  return '<span class="badge-status ' + cls + '">' + milik + "</span>";
}

function render(applied) {
  var rows = PETANI.filter(function (p) {
    return (
      (applied.rt === "Semua RT" || p.rt === applied.rt) &&
      (applied.komoditas === "Semua Komoditas" || p.komoditas === applied.komoditas) &&
      (applied.milik === "Semua" || p.milik === applied.milik)
    );
  });

  /* Stats */
  var statsEl = document.getElementById("pertanianStats");
  if (statsEl) {
    var totalPetani = rows.length;
    var totalLahan = rows.reduce(function (a, p) {
      return a + p.luas;
    }, 0);
    var komoditasCount = {};
    rows.forEach(function (p) {
      komoditasCount[p.komoditas] = (komoditasCount[p.komoditas] || 0) + 1;
    });
    var utama = "-";
    var maxC = 0;
    Object.keys(komoditasCount).forEach(function (k) {
      if (komoditasCount[k] > maxC) {
        maxC = komoditasCount[k];
        utama = k;
      }
    });
    var cards = [
      { label: "Total Petani", value: fmt(totalPetani), icon: "users", hint: "Orang terdata" },
      { label: "Luas Lahan", value: totalLahan.toFixed(2).replace(".", ",") + " Ha", icon: "land", hint: "Total tergarap" },
      { label: "Kelompok Tani", value: "5", icon: "group", hint: "Aktif" },
      { label: "Komoditas Utama", value: utama, icon: "wheat", hint: "Terbanyak" },
    ];
    statsEl.innerHTML = cards.map(statCard).join("");
  }

  /* Chart: distribution of farmers by commodity (from full dataset, not filtered) */
  var chartEl = document.getElementById("chart");
  if (chartEl) {
    var counts = KOMODITAS_ORDER.map(function (k) {
      return {
        label: k,
        value: PETANI.filter(function (p) {
          return p.komoditas === k;
        }).length,
      };
    });
    var max = 1;
    counts.forEach(function (c) {
      max = Math.max(max, c.value);
    });
    chartEl.innerHTML = counts
      .map(function (c) {
        var pct = c.value > 0 ? Math.max((c.value / max) * 100, 10) : 0;
        return (
          '<div class="chart-group">' +
          '<span class="gen">' +
          c.label +
          "</span>" +
          '<div class="bar-track"><div class="bar-fill" style="width:' +
          pct +
          '%">' +
          c.value +
          "</div></div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* Table */
  var tbody = document.getElementById("petaniTableBody");
  if (tbody) {
    if (rows.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;color:var(--muted-foreground)">Tidak ada data untuk filter ini.</td></tr>';
    } else {
      tbody.innerHTML = rows
        .map(function (p) {
          return (
            "<tr><td>" +
            p.nama +
            "</td><td>" +
            p.rt +
            "</td><td>" +
            p.komoditas +
            "</td><td>" +
            p.luas.toFixed(2).replace(".", ",") +
            " Ha</td><td>" +
            statusBadge(p.milik) +
            "</td></tr>"
          );
        })
        .join("");
    }
  }
}

function initPertanian() {
  var rtEl = document.getElementById("filterRt");
  var komEl = document.getElementById("filterKomoditas");
  var kepEl = document.getElementById("filterKepemilikan");
  var applyBtn = document.getElementById("applyBtn");
  if (!rtEl || !komEl || !kepEl || !applyBtn) return;

  fillSelect(rtEl, RT_OPTIONS);
  fillSelect(komEl, KOMODITAS_OPTIONS);
  fillSelect(kepEl, KEPEMILIKAN_OPTIONS);

  render({ rt: "Semua RT", komoditas: "Semua Komoditas", milik: "Semua" });

  applyBtn.addEventListener("click", function () {
    render({ rt: rtEl.value, komoditas: komEl.value, milik: kepEl.value });
  });
}

/* ====== Boot ====== */
document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initTopics();
});
