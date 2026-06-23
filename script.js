"use strict";

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
    href: "sensus-penduduk.html",
  },
  {
    title: "Sensus Pertanian",
    desc: "Informasi luas lahan, komoditas, dan jumlah rumah tangga petani di wilayah padukuhan.",
    icon: "wheat",
    href: "pertanian.html",
  },
  {
    title: "Sensus Ekonomi",
    desc: "Pendataan unit usaha, UMKM, dan aktivitas ekonomi warga Padukuhan Kututegal.",
    icon: "building",
    href: "ekonomi.html",
  },
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
  var statsEl = document.getElementById("homeStats");
  var servicesEl = document.getElementById("services");
  if (statsEl) {
    statsEl.innerHTML = HOME_STATS.map(statCard).join("");
  }
  if (servicesEl) {
    servicesEl.innerHTML = SERVICES.map(function (srv) {
      return (
        '<a class="service-card" href="' +
        srv.href +
        '">' +
        '<span class="service-icon">' +
        ICONS[srv.icon] +
        "</span>" +
        '<div class="service-content">' +
        '<div class="service-head">' +
        '<h3 class="service-title">' +
        srv.title +
        "</h3>" +
        ICONS.arrow +
        "</div>" +
        '<p class="service-desc">' +
        srv.desc +
        "</p>" +
        "</div>" +
        "</a>"
      );
    }).join("");
  }
}

/* ====== Census page: topics grid ====== */
var TOPICS = [
  {
    label: "Jumlah dan Distribusi Penduduk",
    icon: "chart",
    detail: {
      title: "Jumlah Penduduk menurut Kelompok Umur, Daerah, dan Jenis Kelamin",
      rowHeader: "Kelompok Umur",
      groups: [
        { label: "Laki-laki", subs: ["Perkotaan", "Perdesaan", "Total"] },
        { label: "Perempuan", subs: ["Perkotaan", "Perdesaan", "Total"] },
      ],
      rows: [
        { label: "0-14", values: [142, 96, 238, 138, 91, 229] },
        { label: "15-29", values: [168, 110, 278, 161, 103, 264] },
        { label: "30-44", values: [151, 99, 250, 158, 101, 259] },
        { label: "45-59", values: [121, 84, 205, 129, 88, 217] },
        { label: "60+", values: [74, 61, 135, 88, 73, 161] },
      ],
    },
  },
  {
    label: "Keluarga dan Struktur Rumah Tangga",
    icon: "family",
    detail: {
      title: "Penduduk menurut Status dalam Rumah Tangga dan Jenis Kelamin",
      rowHeader: "Status dalam Rumah Tangga",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "Kepala Rumah Tangga", values: [612, 130, 742] },
        { label: "Istri/Suami", values: [118, 564, 682] },
        { label: "Anak", values: [428, 401, 829] },
        { label: "Famili Lain", values: [86, 79, 165] },
      ],
    },
  },
  {
    label: "Mobilitas",
    icon: "mobility",
    detail: {
      title: "Penduduk menurut Jenis Mobilitas dan Jenis Kelamin",
      rowHeader: "Jenis Mobilitas",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "Migrasi Masuk", values: [54, 61, 115] },
        { label: "Migrasi Keluar", values: [47, 39, 86] },
        { label: "Komuter (Ulang-alik)", values: [188, 142, 330] },
        { label: "Tidak Bermigrasi", values: [967, 920, 1887] },
      ],
    },
  },
  {
    label: "Disabilitas",
    icon: "disability",
    detail: {
      title: "Penduduk menurut Tingkat Kesulitan dan Jenis Kelamin",
      rowHeader: "Kelompok Umur",
      groups: [
        {
          label: "Laki-laki",
          subs: ["Tidak kesulitan", "Sedikit kesulitan", "Banyak kesulitan", "Tidak bisa sama sekali"],
        },
        {
          label: "Perempuan",
          subs: ["Tidak kesulitan", "Sedikit kesulitan", "Banyak kesulitan", "Tidak bisa sama sekali"],
        },
      ],
      rows: [
        { label: "0-17", values: [298, 9, 4, 1, 286, 11, 3, 2] },
        { label: "18-39", values: [331, 14, 6, 2, 322, 16, 5, 3] },
        { label: "40-59", values: [201, 22, 11, 4, 214, 25, 13, 5] },
        { label: "60+", values: [88, 31, 18, 9, 104, 36, 21, 12] },
      ],
    },
  },
  {
    label: "Pendidikan",
    icon: "education",
    detail: {
      title: "Penduduk menurut Jenjang Pendidikan Tertinggi dan Jenis Kelamin",
      rowHeader: "Jenjang Pendidikan",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "Tidak/Belum Sekolah", values: [88, 96, 184] },
        { label: "SD/Sederajat", values: [214, 231, 445] },
        { label: "SMP/Sederajat", values: [201, 196, 397] },
        { label: "SMA/Sederajat", values: [318, 302, 620] },
        { label: "Perguruan Tinggi", values: [135, 144, 279] },
      ],
    },
  },
  {
    label: "Kelahiran",
    icon: "birth",
    detail: {
      title: "Jumlah Kelahiran menurut Tahun dan Jenis Kelamin",
      rowHeader: "Tahun",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "2022", values: [14, 12, 26] },
        { label: "2023", values: [11, 16, 27] },
        { label: "2024", values: [18, 13, 31] },
        { label: "2025", values: [15, 17, 32] },
      ],
    },
  },
  {
    label: "Kematian",
    icon: "death",
    detail: {
      title: "Jumlah Kematian menurut Tahun dan Jenis Kelamin",
      rowHeader: "Tahun",
      cols: ["Laki-laki", "Perempuan", "Total"],
      rows: [
        { label: "2022", values: [9, 7, 16] },
        { label: "2023", values: [8, 10, 18] },
        { label: "2024", values: [11, 6, 17] },
        { label: "2025", values: [7, 9, 16] },
      ],
    },
  },
  {
    label: "Perumahan",
    icon: "housing",
    detail: {
      title: "Rumah Tangga menurut Jenis dan Status Kepemilikan Bangunan",
      rowHeader: "Klasifikasi",
      cols: ["Jumlah Rumah Tangga", "Persentase (%)"],
      rows: [
        { label: "Milik Sendiri", values: [566, "76,3"] },
        { label: "Kontrak/Sewa", values: [98, "13,2"] },
        { label: "Bebas Sewa", values: [54, "7,3"] },
        { label: "Dinas/Lainnya", values: [24, "3,2"] },
      ],
    },
  },
];

function topicTableHtml(d) {
  var thead;
  if (d.groups) {
    var top = '<tr><th rowspan="2">' + d.rowHeader + "</th>";
    var sub = "<tr>";
    d.groups.forEach(function (g) {
      top += '<th colspan="' + g.subs.length + '">' + g.label + "</th>";
      g.subs.forEach(function (s) {
        sub += "<th>" + s + "</th>";
      });
    });
    thead = top + "</tr>" + sub + "</tr>";
  } else {
    var r = "<tr><th>" + d.rowHeader + "</th>";
    d.cols.forEach(function (c) {
      r += "<th>" + c + "</th>";
    });
    thead = r + "</tr>";
  }
  var tbody = d.rows
    .map(function (row) {
      return (
        "<tr><th>" +
        row.label +
        "</th>" +
        row.values
          .map(function (v) {
            return "<td>" + (typeof v === "number" ? fmt(v) : v) + "</td>";
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");
  return (
    '<p class="modal-note">Data dummy untuk pratinjau tampilan. Angka belum mencerminkan kondisi sebenarnya.</p>' +
    '<div class="table-wrap"><table class="data-table"><thead>' +
    thead +
    "</thead><tbody>" +
    tbody +
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

/* ====== Census page ====== */
var DATA = [
  { rt: "RT 01", generasi: "Gen Z", laki: 62, perempuan: 58 },
  { rt: "RT 01", generasi: "Milenial", laki: 71, perempuan: 69 },
  { rt: "RT 01", generasi: "Gen X", laki: 48, perempuan: 52 },
  { rt: "RT 01", generasi: "Baby Boomer", laki: 24, perempuan: 30 },
  { rt: "RT 02", generasi: "Gen Z", laki: 70, perempuan: 66 },
  { rt: "RT 02", generasi: "Milenial", laki: 80, perempuan: 78 },
  { rt: "RT 02", generasi: "Gen X", laki: 55, perempuan: 50 },
  { rt: "RT 02", generasi: "Baby Boomer", laki: 28, perempuan: 33 },
  { rt: "RT 03", generasi: "Gen Z", laki: 58, perempuan: 61 },
  { rt: "RT 03", generasi: "Milenial", laki: 66, perempuan: 72 },
  { rt: "RT 03", generasi: "Gen X", laki: 44, perempuan: 47 },
  { rt: "RT 03", generasi: "Baby Boomer", laki: 21, perempuan: 26 },
];

var GENERASI_ORDER = ["Gen Z", "Milenial", "Gen X", "Baby Boomer"];
var RT_OPTIONS = ["Semua RT", "RT 01", "RT 02", "RT 03"];
var GEN_OPTIONS = ["Semua Generasi"].concat(GENERASI_ORDER);
var JK_OPTIONS = ["Semua", "Laki-laki", "Perempuan"];

function fillSelect(el, options) {
  el.innerHTML = options
    .map(function (o) {
      return '<option value="' + o + '">' + o + "</option>";
    })
    .join("");
}

function computeChart(applied) {
  var rows = DATA.filter(function (r) {
    return (
      (applied.rt === "Semua RT" || r.rt === applied.rt) &&
      (applied.generasi === "Semua Generasi" || r.generasi === applied.generasi)
    );
  });
  var byGen = GENERASI_ORDER.map(function (g) {
    var gr = rows.filter(function (r) {
      return r.generasi === g;
    });
    var laki =
      applied.jk === "Perempuan"
        ? 0
        : gr.reduce(function (a, r) {
            return a + r.laki;
          }, 0);
    var perempuan =
      applied.jk === "Laki-laki"
        ? 0
        : gr.reduce(function (a, r) {
            return a + r.perempuan;
          }, 0);
    return { generasi: g, laki: laki, perempuan: perempuan, total: laki + perempuan };
  }).filter(function (d) {
    return d.total > 0;
  });
  var max = 1;
  byGen.forEach(function (d) {
    max = Math.max(max, d.laki, d.perempuan);
  });
  return { byGen: byGen, max: max };
}

function barFill(value, max, cls) {
  var pct = value > 0 ? Math.max((value / max) * 100, 8) : 0;
  return (
    '<div class="bar-track">' +
    '<div class="bar-fill ' +
    cls +
    '" style="width:' +
    pct +
    '%">' +
    (value > 0 ? fmt(value) : "") +
    "</div>" +
    "</div>"
  );
}

function renderCensus(applied) {
  var chart = computeChart(applied);
  var chartEl = document.getElementById("chart");
  var statsEl = document.getElementById("censusStats");

  if (chartEl) {
    if (chart.byGen.length === 0) {
      chartEl.innerHTML =
        '<p class="chart-empty">Tidak ada data untuk filter ini.</p>';
    } else {
      chartEl.innerHTML = chart.byGen
        .map(function (d) {
          var bars = "";
          if (applied.jk !== "Perempuan") bars += barFill(d.laki, chart.max, "bar-laki");
          if (applied.jk !== "Laki-laki")
            bars += barFill(d.perempuan, chart.max, "bar-perempuan");
          return (
            '<div class="chart-group">' +
            '<div class="chart-group-head">' +
            '<span class="gen">' +
            d.generasi +
            "</span>" +
            '<span class="total">' +
            fmt(d.total) +
            " jiwa</span>" +
            "</div>" +
            bars +
            "</div>"
          );
        })
        .join("");
    }
  }

  if (statsEl) {
    var laki = chart.byGen.reduce(function (a, d) {
      return a + d.laki;
    }, 0);
    var perempuan = chart.byGen.reduce(function (a, d) {
      return a + d.perempuan;
    }, 0);
    var total = laki + perempuan;
    var kk = Math.round(total / 3.26);
    var cards = [
      { label: "Total Penduduk", value: fmt(total), icon: "users", hint: "Jiwa" },
      { label: "Laki-laki", value: fmt(laki), icon: "user", hint: "Jiwa" },
      { label: "Perempuan", value: fmt(perempuan), icon: "user", hint: "Jiwa" },
      { label: "Kepala Keluarga", value: fmt(kk), icon: "clipboard", hint: "KK (estimasi)" },
    ];
    statsEl.innerHTML = cards.map(statCard).join("");
  }
}

function initCensus() {
  var rtEl = document.getElementById("filterRt");
  var genEl = document.getElementById("filterGen");
  var jkEl = document.getElementById("filterJk");
  var applyBtn = document.getElementById("applyBtn");
  if (!rtEl || !genEl || !jkEl || !applyBtn) return;

  fillSelect(rtEl, RT_OPTIONS);
  fillSelect(genEl, GEN_OPTIONS);
  fillSelect(jkEl, JK_OPTIONS);

  renderCensus({ rt: "Semua RT", generasi: "Semua Generasi", jk: "Semua" });

  applyBtn.addEventListener("click", function () {
    renderCensus({ rt: rtEl.value, generasi: genEl.value, jk: jkEl.value });
  });
}

/* ====== Boot ====== */
document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initHome();
  initTopics();
  initCensus();
});
