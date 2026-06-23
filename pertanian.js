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
var TOPICS = [
  {
    label: "Jumlah Petani",
    icon: "users",
    detail: {
      title: "Jumlah Petani menurut RT dan Jenis Kelamin",
      rowHeader: "RT",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "RT 01", values: [62, 28, 90] },
        { label: "RT 02", values: [74, 31, 105] },
        { label: "RT 03", values: [58, 24, 82] },
        { label: "RT 04", values: [49, 19, 68] },
      ],
    },
  },
  {
    label: "Luas Lahan",
    icon: "land",
    detail: {
      title: "Luas Lahan Pertanian menurut Jenis Penggunaan (Ha)",
      rowHeader: "Jenis Lahan",
      cols: ["Luas (Ha)", "Persentase (%)"],
      rows: [
        { label: "Sawah Irigasi", values: ["38,5", "44,2"] },
        { label: "Tegalan/Ladang", values: ["24,0", "27,6"] },
        { label: "Kebun Campur", values: ["16,2", "18,6"] },
        { label: "Pekarangan", values: ["8,4", "9,6"] },
      ],
    },
  },
  {
    label: "Alat dan Mesin Pertanian",
    icon: "tractor",
    detail: {
      title: "Jumlah Alat dan Mesin Pertanian (Alsintan)",
      rowHeader: "Jenis Alsintan",
      cols: ["Jumlah", "Kondisi Baik"],
      rows: [
        { label: "Traktor Roda Dua", values: [12, 10] },
        { label: "Pompa Air", values: [21, 18] },
        { label: "Mesin Perontok (Power Thresher)", values: [7, 6] },
        { label: "Hand Sprayer", values: [86, 74] },
      ],
    },
  },
  {
    label: "Sistem Irigasi",
    icon: "water",
    detail: {
      title: "Luas Lahan menurut Sistem Irigasi (Ha)",
      rowHeader: "Sistem Irigasi",
      cols: ["Luas (Ha)", "Jumlah Petani"],
      rows: [
        { label: "Irigasi Teknis", values: ["22,4", 118] },
        { label: "Irigasi Setengah Teknis", values: ["10,1", 64] },
        { label: "Irigasi Sederhana", values: ["6,0", 41] },
        { label: "Tadah Hujan", values: ["48,6", 122] },
      ],
    },
  },
  {
    label: "Komoditas Pertanian",
    icon: "corn",
    detail: {
      title: "Jumlah Petani menurut Komoditas yang Diusahakan",
      rowHeader: "Komoditas",
      cols: ["Jumlah Petani", "Luas Tanam (Ha)"],
      rows: [
        { label: "Padi", values: [142, "38,5"] },
        { label: "Jagung", values: [78, "21,0"] },
        { label: "Cabai", values: [54, "9,2"] },
        { label: "Sayuran", values: [63, "11,4"] },
        { label: "Buah", values: [37, "7,8"] },
        { label: "Ternak", values: [29, "-"] },
      ],
    },
  },
  {
    label: "Kepemilikan Lahan",
    icon: "home",
    detail: {
      title: "Jumlah Petani menurut Status Kepemilikan Lahan",
      rowHeader: "Status Kepemilikan",
      cols: ["Jumlah Petani", "Persentase (%)"],
      rows: [
        { label: "Milik Sendiri", values: [196, "58,3"] },
        { label: "Sewa", values: [88, "26,2"] },
        { label: "Bagi Hasil", values: [52, "15,5"] },
      ],
    },
  },
  {
    label: "Produksi Pertanian",
    icon: "trend",
    detail: {
      title: "Estimasi Produksi Pertanian per Tahun (Ton)",
      rowHeader: "Komoditas",
      cols: ["Produksi (Ton)", "Produktivitas (Ton/Ha)"],
      rows: [
        { label: "Padi", values: ["231,0", "6,0"] },
        { label: "Jagung", values: ["115,5", "5,5"] },
        { label: "Cabai", values: ["73,6", "8,0"] },
        { label: "Sayuran", values: ["91,2", "8,0"] },
        { label: "Buah", values: ["62,4", "8,0"] },
      ],
    },
  },
];

function topicTableHtml(d) {
  var head = "<tr><th>" + d.rowHeader + "</th>";
  d.cols.forEach(function (c) {
    head += "<th>" + c + "</th>";
  });
  head += "</tr>";

  var body = d.rows
    .map(function (row) {
      return (
        "<tr><th>" +
        row.label +
        "</th>" +
        row.values
          .map(function (v) {
            return "<td>" + fmt(v) + "</td>";
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");

  return (
    '<p class="modal-note">Data dummy untuk pratinjau tampilan. Angka belum mencerminkan kondisi sebenarnya.</p>' +
    '<div class="table-wrap"><table class="data-table"><thead>' +
    head +
    "</thead><tbody>" +
    body +
    "</tbody></table></div>"
  );
}

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

var PETANI = [
  { nama: "Sukirman", rt: "RT 01", komoditas: "Padi", luas: 0.42, milik: "Milik Sendiri" },
  { nama: "Wagiyem", rt: "RT 01", komoditas: "Sayuran", luas: 0.18, milik: "Sewa" },
  { nama: "Parjono", rt: "RT 02", komoditas: "Jagung", luas: 0.55, milik: "Milik Sendiri" },
  { nama: "Sumarni", rt: "RT 02", komoditas: "Cabai", luas: 0.21, milik: "Bagi Hasil" },
  { nama: "Hadi Susanto", rt: "RT 03", komoditas: "Padi", luas: 0.6, milik: "Milik Sendiri" },
  { nama: "Tukiyem", rt: "RT 03", komoditas: "Buah", luas: 0.33, milik: "Sewa" },
  { nama: "Slamet Riyadi", rt: "RT 04", komoditas: "Ternak", luas: 0.15, milik: "Milik Sendiri" },
  { nama: "Ngatinah", rt: "RT 01", komoditas: "Jagung", luas: 0.47, milik: "Bagi Hasil" },
  { nama: "Darmaji", rt: "RT 04", komoditas: "Padi", luas: 0.5, milik: "Milik Sendiri" },
  { nama: "Yatini", rt: "RT 02", komoditas: "Sayuran", luas: 0.24, milik: "Sewa" },
];

var RT_OPTIONS = ["Semua RT", "RT 01", "RT 02", "RT 03", "RT 04"];
var KOMODITAS_OPTIONS = ["Semua Komoditas"].concat(KOMODITAS_ORDER);
var KEPEMILIKAN_OPTIONS = ["Semua", "Milik Sendiri", "Sewa", "Bagi Hasil"];

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
  initPertanian();
});
