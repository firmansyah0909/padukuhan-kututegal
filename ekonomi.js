"use strict";

/* ====== Inline SVG icons (stroke uses currentColor) ====== */
var ICONS = {
  store:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-6h6v6"/></svg>',
  briefcase:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  money:
    '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>',
  cart:
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 7H6"/></svg>',
  food:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M4 3v7a3 3 0 0 0 6 0V3"/><path d="M7 13v8"/><path d="M17 3c-2 0-3 2-3 5s1 4 3 4v9"/></svg>',
  industry:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 21V10l6 4V10l6 4V7l6 3v11Z"/><path d="M3 21h18"/></svg>',
  trend:
    '<svg class="icon" viewBox="0 0 24 24"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>',
  users:
    '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
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
    label: "UMKM",
    icon: "store",
    detail: {
      title: "Perkembangan Jumlah UMKM menurut Tahun",
      rowHeader: "Tahun",
      cols: ["Jumlah UMKM"],
      rows: [
        { label: "2022", values: [18] },
        { label: "2023", values: [22] },
        { label: "2024", values: [25] },
        { label: "2025", values: [27] },
      ],
    },
  },
  {
    label: "Jenis Pekerjaan",
    icon: "briefcase",
    detail: {
      title: "Penduduk menurut Jenis Pekerjaan Utama",
      rowHeader: "Jenis Pekerjaan",
      cols: ["Jumlah", "Persentase (%)"],
      rows: [
        { label: "Petani/Buruh Tani", values: [318, "27,7"] },
        { label: "Wiraswasta/Pedagang", values: [241, "21,0"] },
        { label: "Karyawan Swasta", values: [196, "17,1"] },
        { label: "PNS/TNI/Polri", values: [84, "7,3"] },
        { label: "Buruh Harian", values: [152, "13,2"] },
        { label: "Lainnya", values: [157, "13,7"] },
      ],
    },
  },
  {
    label: "Pendapatan Rumah Tangga",
    icon: "money",
    detail: {
      title: "Rumah Tangga menurut Tingkat Pendapatan per Bulan",
      rowHeader: "Pendapatan",
      cols: ["Jumlah KK"],
      rows: [
        { label: "< Rp2 Juta", values: [15] },
        { label: "Rp2-4 Juta", values: [38] },
        { label: "Rp4-6 Juta", values: [24] },
        { label: "> Rp6 Juta", values: [8] },
      ],
    },
  },
  {
    label: "Usaha Perdagangan",
    icon: "cart",
    detail: {
      title: "Jumlah Usaha Perdagangan menurut Jenis",
      rowHeader: "Jenis Usaha",
      cols: ["Jumlah Unit"],
      rows: [
        { label: "Warung/Toko Kelontong", values: [14] },
        { label: "Pedagang Pasar", values: [9] },
        { label: "Pedagang Keliling", values: [7] },
        { label: "Toko Online", values: [5] },
      ],
    },
  },
  {
    label: "Usaha Kuliner",
    icon: "food",
    detail: {
      title: "Jumlah Usaha Kuliner menurut Jenis",
      rowHeader: "Jenis Kuliner",
      cols: ["Jumlah Unit"],
      rows: [
        { label: "Warung Makan", values: [3] },
        { label: "Angkringan", values: [2] },
        { label: "Katering Rumahan", values: [2] },
        { label: "Jajanan/Snack", values: [1] },
      ],
    },
  },
  {
    label: "Industri Rumah Tangga",
    icon: "industry",
    detail: {
      title: "Industri Rumah Tangga menurut Produk",
      rowHeader: "Produk",
      cols: ["Jumlah Unit", "Tenaga Kerja"],
      rows: [
        { label: "Kerajinan Anyaman", values: [4, 11] },
        { label: "Konveksi/Jahit", values: [3, 9] },
        { label: "Olahan Makanan", values: [5, 14] },
        { label: "Mebel/Kayu", values: [2, 6] },
      ],
    },
  },
  {
    label: "Kondisi Ekonomi",
    icon: "trend",
    detail: {
      title: "Rumah Tangga menurut Kondisi Ekonomi",
      rowHeader: "Klasifikasi",
      cols: ["Jumlah KK", "Persentase (%)"],
      rows: [
        { label: "Sejahtera", values: [486, "65,5"] },
        { label: "Menengah", values: [184, "24,8"] },
        { label: "Pra-Sejahtera", values: [72, "9,7"] },
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

/* ====== Stats + chart + filter ====== */
var USAHA = [
  { label: "Kuliner", value: 8 },
  { label: "Perdagangan", value: 6 },
  { label: "Jasa", value: 5 },
  { label: "Kerajinan", value: 4 },
  { label: "Peternakan", value: 2 },
  { label: "Lainnya", value: 2 },
];

var RT_OPTIONS = ["Semua RT", "RT 01", "RT 02", "RT 03", "RT 04"];
var USAHA_OPTIONS = ["Semua Usaha", "Kuliner", "Perdagangan", "Jasa", "Kerajinan", "Peternakan", "Lainnya"];
var PENDAPATAN_OPTIONS = ["Semua", "< Rp2 Juta", "Rp2-4 Juta", "Rp4-6 Juta", "> Rp6 Juta"];

var STATS = [
  { label: "Total UMKM", value: "27", icon: "store", hint: "Unit usaha" },
  { label: "Pekerja Aktif", value: "115", icon: "users", hint: "Orang" },
  { label: "Usaha Kuliner", value: "8", icon: "food", hint: "Unit" },
  { label: "Rata-rata Pendapatan", value: "Rp3,5 Jt", icon: "money", hint: "Per bulan" },
];

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

function renderStats() {
  var el = document.getElementById("ekonomiStats");
  if (el) el.innerHTML = STATS.map(statCard).join("");
}

function renderChart() {
  var chartEl = document.getElementById("chart");
  if (!chartEl) return;
  var max = 1;
  USAHA.forEach(function (c) {
    max = Math.max(max, c.value);
  });
  chartEl.innerHTML = USAHA.map(function (c) {
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
  }).join("");
}

function initEkonomi() {
  var rtEl = document.getElementById("filterRt");
  var usahaEl = document.getElementById("filterUsaha");
  var pendEl = document.getElementById("filterPendapatan");
  var applyBtn = document.getElementById("applyBtn");
  if (!rtEl || !usahaEl || !pendEl || !applyBtn) return;

  fillSelect(rtEl, RT_OPTIONS);
  fillSelect(usahaEl, USAHA_OPTIONS);
  fillSelect(pendEl, PENDAPATAN_OPTIONS);

  renderStats();
  renderChart();

  applyBtn.addEventListener("click", function () {
    renderStats();
    renderChart();
  });
}

/* ====== Boot ====== */
document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initTopics();
  initEkonomi();
});
