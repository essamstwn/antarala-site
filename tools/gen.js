/* Generator website Antarala — dipakai bersama oleh tools/build.mjs (repo) dan Antarala Editor (artifact).
   build(articles, opts) -> { "index.html": "...", "artikel/x.html": "...", ... }

   Field konten per artikel (semua opsional kecuali slug/judul/ringkas/penulis/kategori):
     kategori  : "Berita" (tampil "Update") | "Opini" | "Feature"   -> rubrik
     topik     : "musik" | "konser" | "film" | "kultur"              -> default "musik"
     tag       : "Hindia, Lafa Pratomo, Rilisan Baru"                 -> halaman /tag/<slug>.html
     judulSeo  : judul pendek (±60 karakter) untuk Google; kosong = pakai judul
     poin      : ["poin penting 1", "poin 2"]                         -> kotak "Intinya" (bagus untuk Google & AI)
   opts: ga, ver, webp (true = pakai assets/img/w/*.webp), assets (URL aset preview), img(a) (URL cover preview). */
(function () {
const SITE = "https://antarala.co.id/";
const IG = "https://www.instagram.com/antarala__/";
const TT = "https://www.tiktok.com/@antarala__";
const EMAIL = "antarala@futurinc.co.id";
const ADSENSE = "ca-pub-3974855070846706"; // Google AdSense; tidak dipasang di pratinjau editor (opts.assets) atau bila opts.adsense === false
const PARENT = { "@type": "Organization", name: "FUTURINC", url: "https://futurinc.co.id/" };
const BIO = "Ngomongin musik, kultur, pikiran, dan kabar yang menarik di antaranya.";
const ABOUT = "Antarala adalah media musik dan kultur pop Indonesia. Kami menulis kabar rilisan dan konser terbaru, feature soal musisi, dan opini personal dari para penulis dan pendengar.";
const YEAR = new Date().getFullYear();

const RUBRIK = {
  Berita: { slug: "update", nama: "Update", h1: "Update musik terbaru", title: "Berita Musik Terbaru Hari Ini",
    desc: "Berita musik Indonesia terbaru: rilisan baru, konser, festival, dan kultur pop, dirangkum tiap hari oleh Redaksi Antarala.",
    lede: "Kabar rilisan baru, konser, dan kultur pop yang lagi ramai, dirangkum tiap pagi oleh Redaksi Antarala." },
  Opini: { slug: "opini", nama: "Opini", h1: "Opini", title: "Opini Musik dan Kultur",
    desc: "Opini personal soal musik, lagu, musisi, dan hidup sehari-hari dari para penulis dan pendengar Antarala.",
    lede: "Tulisan personal dari penulis dan pendengar: soal lagu, musisi, dan hidup di sekitarnya." },
  Feature: { slug: "feature", nama: "Feature", h1: "Feature", title: "Feature Musik: Cerita di Balik Lagu",
    desc: "Feature soal rilisan, musisi, dan cerita di balik lagu Indonesia dari Antarala.",
    lede: "Cerita yang lebih panjang soal rilisan, musisi, dan makna di balik lagu." }
};
const TOPIK = {
  musik: { nama: "Musik", h1: "Musik", title: "Musik Indonesia: Rilisan, Lagu, dan Musisi",
    desc: "Semua tulisan Antarala soal musik: rilisan baru, makna lagu, kabar musisi Indonesia dan dunia." },
  konser: { nama: "Konser & Festival", h1: "Konser & Festival", title: "Konser & Festival Musik di Indonesia",
    desc: "Kabar konser dan festival musik di Indonesia: lineup, jadwal, tiket, dan cerita dari depan panggung." },
  film: { nama: "Film & Series", h1: "Film & Series", title: "Film & Series: Kabar dan Ulasan",
    desc: "Kabar film, series, dan soundtrack yang lagi ramai dibicarakan, dari Antarala." },
  kultur: { nama: "Kultur", h1: "Kultur & Gaya Hidup", title: "Kultur Pop & Gaya Hidup",
    desc: "Tren kultur pop, gaya hidup, dan pikiran-pikiran soal hidup sehari-hari dari Antarala." }
};
// pengantar halaman tag (opsional): slug tag -> teks. Isi hanya dengan fakta yang pasti.
const TAG_INFO = {
  "hindia": "Hindia adalah proyek solo Baskara Putra. Lagunya, “Rumah ke Rumah”, tercatat sebagai lagu Indonesia paling banyak di-stream di Spotify, dan album <i>Menari dengan Bayangan</i> sempat memecahkan rekor streaming album Indonesia. Di sini kamu bisa baca kabar rilisan dan kolaborasi terbarunya, termasuk “Sampaikan ke Kawan” bersama Lafa Pratomo dan Banda Neira.",
  "lafa-pratomo": "Lafa Pratomo merilis EP <i>Garis Tegak</i> yang berisi kolaborasi dengan banyak musisi, di antaranya “terabas” bersama Bilal Indrajaya dan The Jansen, serta “Sampaikan ke Kawan” bersama Hindia dan Banda Neira. Semua tulisan Antarala soal Lafa Pratomo ada di halaman ini.",
  "bilal-indrajaya": "Bilal Indrajaya adalah penyanyi dan penulis lagu. Selain bersolo karier, ia bermain di band Portura bersama Iga Massardi, dan berkolaborasi di “Kau” bersama Maudy Ayunda serta “terabas” bersama Lafa Pratomo dan The Jansen.",
  "rilisan-baru": "Kabar single, EP, dan album baru dari musisi Indonesia, dirangkum Redaksi Antarala setiap hari lengkap dengan cerita di balik lagunya.",
  "konser": "Kabar konser musik di Indonesia: jadwal, lineup, harga tiket, sampai cerita dari depan panggung.",
  "industri-musik": "Tulisan soal perubahan industri musik Indonesia: dari era kaset ke streaming, royalti, sampai musik buatan AI."
};
// bio penulis (opsional). Isi di sini kalau ada.
const REDAKSI = { pemred: "Essam Setiawan", editor: "Syilfa Adistya", penulis: ["Marsya Miranda"] };
const AUTHORS = {
  "Essam Setiawan": { bio: "Pemimpin Redaksi Antarala." },
  "Marsya Miranda": { bio: "Penulis di redaksi Antarala." },
  "Redaksi Antarala": { org: true, bio: "Tim redaksi Antarala. Merangkum kabar musik dan kultur pop terbaru setiap hari, dengan minimal dua sumber kredibel atau satu sumber resmi untuk setiap kabar." }
};

const e = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = s => String(s || "").replace(/<[^>]+>/g, "");
const slugify = s => strip(s).toLowerCase().replace(/r&b/g, "rnb").replace(/['’`]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " dan ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const tgl = (d, short) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); if (!m) return ""; const b = BULAN[+m[2] - 1]; return `${+m[3]} ${short ? b.slice(0, 3) : b} ${m[1]}`; };
const isB = a => a.kategori === "Berita";
const rub = a => RUBRIK[a.kategori] || RUBRIK.Opini;
const topikOf = a => TOPIK[a.topik] ? a.topik : "musik";
const tagsOf = a => (Array.isArray(a.tag) ? a.tag : String(a.tag || "").split(",")).map(s => s.trim()).filter(Boolean);
const iso = (d, t) => d ? `${d}T${(t || "09:00").slice(0, 5)}:00+07:00` : "";
const byDate = (p, q) => ((q.tanggal || "") + (q.jam || "")).localeCompare((p.tanggal || "") + (p.jam || ""));
const mailto = s => `mailto:${EMAIL}?subject=${encodeURIComponent(s)}`;
const penulisSlug = n => slugify(n) || "redaksi";
const peran = n => n === "Redaksi Antarala" ? "Redaksi" : n === REDAKSI.pemred ? "Pemimpin Redaksi" : n === REDAKSI.editor ? "Editor" : REDAKSI.penulis.includes(n) ? "Penulis" : "Kontributor";

const I = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2c-1.5 0-2.8-.4-4-1.2v6.3c0 3.2-2.6 5.8-5.8 5.8S5 18.4 5 15.2s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.1-.9-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.6-1.1 2.6-2.6V3h3.2z"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  rss: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="18" r="2"/><path d="M4 10a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7zm0-6a16 16 0 0 1 16 16h-3A13 13 0 0 0 4 7z"/></svg>'
};

window.AntaralaGen = { build, SITE, slugify, TOPIK, RUBRIK };

function build(ARTICLES, opts) {
  opts = opts || {};
  const VER = opts.ver || String(Date.now()).slice(0, 10);
  const out = {};
  const ALL = ARTICLES.filter(a => a && a.slug).slice().sort(byDate);
  const NEWS = ALL.filter(isB);
  const MAIN = ARTICLES.filter(a => a && a.slug && !isB(a)); // urutan dari editor

  // ---- taksonomi
  const TAGS = new Map(); // slug -> {nama, items}
  for (const a of ALL) for (const t of tagsOf(a)) { const s = slugify(t); if (!s) continue; if (!TAGS.has(s)) TAGS.set(s, { nama: t, slug: s, items: [] }); TAGS.get(s).items.push(a); }
  const tagIndexable = s => (TAGS.get(s)?.items.length || 0) >= 2;
  const AUTH = new Map();
  for (const a of ALL) { const s = penulisSlug(a.penulis); if (!AUTH.has(s)) AUTH.set(s, { nama: a.penulis, slug: s, items: [] }); AUTH.get(s).items.push(a); }

  // ---- helper path & gambar
  const rootOf = path => "../".repeat(path.split("/").length - 1);
  const home = root => root || "./";
  const ast = root => opts.assets ? opts.assets : root + "assets/";
  const art = (a, root) => `${root}artikel/${a.slug}.html`;
  const ver = a => (a.diperbarui || "").replace(/-/g, "") || VER;
  const imgURL = (a, root) => opts.img ? opts.img(a, root) : `${root}assets/img/${a.cover}?v=${ver(a)}`;
  const webp = (a, root, w) => `${root}assets/img/w/${String(a.cover).replace(/\.\w+$/, "")}-${w}.webp?v=${ver(a)}`;
  const srcset = (a, root) => [320, 640, 960, 1200].map(w => `${webp(a, root, w)} ${w}w`).join(", ");
  const G3 = "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px";
  function pic(a, root, { eager = false, sizes = G3 } = {}) {
    const pos = a.fokus ? ` style="object-position:${e(a.fokus)}"` : "";
    const img = `<img src="${imgURL(a, root)}" alt="${e(a.alt || strip(a.judul))}" width="1200" height="900" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}${pos}>`;
    if (!opts.webp || opts.img) return img;
    return `<picture><source type="image/webp" srcset="${srcset(a, root)}" sizes="${sizes}">${img}</picture>`;
  }
  const rubLink = (a, root) => `<a class="rb rb-${rub(a).slug}" href="${root}${rub(a).slug}.html">${rub(a).nama}</a>`;
  const meta = (a, withRead = true) => `<span class="mt">${a.tanggal ? `<time datetime="${iso(a.tanggal, a.jam)}">${tgl(a.tanggal, true)}</time>` : ""}${withRead ? `<span>${a.menit || 2} menit baca</span>` : ""}</span>`;

  // kartu (seluruh kartu bisa diklik lewat link judul, label rubrik tetap bisa diklik)
  const card = (a, root, { cls = "", eager = false, hx = "h3", sizes } = {}) => `<article class="cd ${cls}">
  <a class="cd-ph" href="${art(a, root)}" tabindex="-1" aria-hidden="true">${pic(a, root, { eager, sizes })}</a>
  <div class="cd-tx"><div class="kk">${rubLink(a, root)}${meta(a)}</div>
  <${hx} class="cd-h"><a href="${art(a, root)}">${a.judul}</a></${hx}>
  <p class="cd-p">${a.ringkas}</p>
  <p class="cd-by">${a.kategori === "Opini" ? "Opini" : "Oleh"} <a href="${root}penulis/${penulisSlug(a.penulis)}.html">${e(a.penulis)}</a></p></div>
</article>`;
  const row = (a, root, n) => `<article class="rw">
  ${n ? `<span class="rw-n" aria-hidden="true">${String(n).padStart(2, "0")}</span>` : ""}
  <div class="rw-tx"><div class="kk">${rubLink(a, root)}${meta(a, false)}</div>
  <h3 class="rw-h"><a href="${art(a, root)}">${a.judul}</a></h3></div>
  <a class="rw-ph" href="${art(a, root)}" tabindex="-1" aria-hidden="true">${pic(a, root, { sizes: "(max-width: 520px) 96px, 120px" })}</a>
</article>`;
  const follow = () => `<div class="fl"><a class="bt bt-s" href="${IG}" target="_blank" rel="noopener me">${I.ig} @antarala__</a><a class="bt" href="${TT}" target="_blank" rel="noopener me">${I.tt} TikTok</a></div>`;

  // ---- schema dasar
  const ORG = { "@type": "NewsMediaOrganization", "@id": SITE + "#org", name: "Antarala", alternateName: ["antarala", "Antarala Media"], url: SITE,
    logo: { "@type": "ImageObject", url: SITE + "assets/img/icon-512.png", width: 512, height: 512 }, description: ABOUT, email: EMAIL,
    sameAs: [IG, TT], parentOrganization: PARENT, masthead: SITE + "tentang.html#redaksi",
    employee: [{ "@type": "Person", name: REDAKSI.pemred, jobTitle: "Pemimpin Redaksi", url: SITE + "penulis/" + slugify(REDAKSI.pemred) + ".html" }, { "@type": "Person", name: REDAKSI.editor, jobTitle: "Editor" }].concat(REDAKSI.penulis.map(n => ({ "@type": "Person", name: n, jobTitle: "Penulis", url: SITE + "penulis/" + slugify(n) + ".html" }))), publishingPrinciples: SITE + "pedoman.html", ethicsPolicy: SITE + "pedoman.html", correctionsPolicy: SITE + "pedoman.html#koreksi" };
  const WEBSITE = { "@type": "WebSite", "@id": SITE + "#web", name: "Antarala", url: SITE, inLanguage: "id-ID", description: BIO, publisher: { "@id": SITE + "#org" },
    potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: SITE + "cari.html?q={search_term_string}" }, "query-input": "required name=search_term_string" } };
  const crumbs = list => ({ "@type": "BreadcrumbList", itemListElement: list.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })) });
  const crumbHtml = (list, root) => `<nav class="bc" aria-label="Breadcrumb"><ol>${list.map(([n, h], i) => i === list.length - 1 ? `<li aria-current="page">${e(n)}</li>` : `<li><a href="${h}">${e(n)}</a></li>`).join("")}</ol></nav>`;

  // ---- kerangka halaman
  const SECTIONS = [["update.html", "Update", "update"], ["opini.html", "Opini", "opini"], ["feature.html", "Feature", "feature"],
    ["topik/musik.html", "Musik", "musik"], ["topik/konser.html", "Konser", "konser"], ["topik/film.html", "Film", "film"], ["topik/kultur.html", "Kultur", "kultur"]];
  function page(path, { title, desc, body, active = "", og = "og-antarala.jpg", ld = [], type = "website", robots = "index, follow, max-image-preview:large", head = "", articleMeta = "" }) {
    const root = rootOf(path), A = ast(root);
    const url = SITE + (path === "index.html" ? "" : path);
    const secs = SECTIONS.map(([h, t, k]) => `<a href="${root}${h}"${k === active ? ' aria-current="page"' : ""}>${t}</a>`).join("");
    const graph = ld.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": ld }).replace(/</g, "\\u003c")}</script>` : "";
    const ogImg = /^https?:/.test(og) ? og : SITE + "assets/img/" + og;
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#1e1e1e">
<meta property="og:site_name" content="Antarala">
<meta property="og:locale" content="id_ID">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
${og === "og-antarala.jpg" ? '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n' : ""}<meta property="og:image:alt" content="${e(title)}">
${articleMeta}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="${root}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="48x48" href="${A}img/favicon-48.png">
<link rel="apple-touch-icon" href="${A}img/apple-touch-icon.png">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="Antarala" href="${SITE}feed.xml">
<link rel="preload" href="${A}fonts/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A}fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${A}style.css?v=${VER}">
${head}${graph}
${opts.ga ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${opts.ga}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${opts.ga}');</script>` : ""}
${opts.adsense !== false && !opts.assets ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>` : ""}
</head>
<body>
<a class="skip" href="#isi">Langsung ke isi</a>
<div class="an"><a href="${mailto("Sumbang Tulisan")}">Punya opini soal musik atau kultur? <b>Sumbang tulisanmu</b></a></div>
<header class="hd">
  <div class="wrap hd-in">
    <button class="ic hd-menu" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="drawer">${I.menu}</button>
    <a class="brand" href="${home(root)}" aria-label="Antarala, beranda"><img src="${A}img/logo-dark.png" alt="antarala" width="116" height="26"></a>
    <nav class="hd-nav" aria-label="Rubrik">${secs}</nav>
    <div class="hd-act"><a class="ic" href="${root}cari.html" aria-label="Cari artikel">${I.search}</a><a class="bt bt-s hd-cta" href="${root}brief.html">Kirim rilisan</a></div>
  </div>
  <nav class="strip" aria-label="Rubrik"><div class="wrap">${secs}</div></nav>
</header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-in">
    <div class="drawer-hd"><img src="${A}img/logo-dark.png" alt="antarala" width="116" height="26"><button class="ic hd-close" type="button" aria-label="Tutup menu">${I.close}</button></div>
    <form class="srch" action="${root}cari.html" role="search"><label class="sr" for="dq">Cari</label><input id="dq" name="q" type="search" placeholder="Cari musisi, lagu, konser…"><button class="ic" aria-label="Cari">${I.search}</button></form>
    <p class="drawer-l">Rubrik</p><div class="drawer-g">${SECTIONS.slice(0, 3).map(([h, t]) => `<a href="${root}${h}">${t}</a>`).join("")}</div>
    <p class="drawer-l">Topik</p><div class="drawer-g">${Object.entries(TOPIK).map(([k, t]) => `<a href="${root}topik/${k}.html">${t.nama}</a>`).join("")}</div>
    <p class="drawer-l">Antarala</p><div class="drawer-g"><a href="${root}tentang.html">Tentang</a><a href="${root}pedoman.html">Pedoman redaksi</a><a href="${root}kontak.html">Kontak</a><a href="${root}privasi.html">Kebijakan privasi</a><a href="${root}rilis-pers.html">Kirim rilis pers</a><a href="${root}brief.html">Kirim brief rilisan</a><a href="${mailto("Sumbang Tulisan")}">Sumbang tulisan</a></div>
    ${follow()}
  </div>
</div>
<main id="isi">
${body}
</main>
<footer class="ft"><div class="wrap">
  <div class="ft-top">
    <div class="ft-b"><img src="${A}img/logo-light.png" alt="antarala" width="134" height="30" loading="lazy"><p>${ABOUT}</p>${follow()}</div>
    <div><h2>Rubrik</h2><ul>${SECTIONS.slice(0, 3).map(([h, t]) => `<li><a href="${root}${h}">${t}</a></li>`).join("")}<li><a href="${root}cari.html">Cari</a></li></ul></div>
    <div><h2>Topik</h2><ul>${Object.entries(TOPIK).map(([k, t]) => `<li><a href="${root}topik/${k}.html">${t.nama}</a></li>`).join("")}</ul></div>
    <div><h2>Antarala</h2><ul><li><a href="${root}tentang.html">Tentang</a></li><li><a href="${root}pedoman.html">Pedoman redaksi</a></li><li><a href="${root}kontak.html">Kontak</a></li><li><a href="${root}privasi.html">Kebijakan privasi</a></li><li><a href="${root}rilis-pers.html">Kirim rilis pers</a></li><li><a href="${root}brief.html">Kirim brief rilisan</a></li><li><a href="${SITE}feed.xml">${I.rss} RSS</a></li></ul></div>
  </div>
  <p class="ft-c">© ${YEAR} Antarala. Bagian dari <a href="https://futurinc.co.id/" rel="noopener">FUTURINC</a>. · <a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></footer>
<script>{const d=document.getElementById('drawer'),b=document.querySelector('.hd-menu');
const o=v=>{d.hidden=!v;b.setAttribute('aria-expanded',v);document.body.classList.toggle('lock',v);if(v)d.querySelector('input').focus();else b.focus();};
b.onclick=()=>o(true);d.querySelector('.hd-close').onclick=()=>o(false);d.onclick=x=>{if(x.target===d)o(false)};
addEventListener('keydown',x=>{if(x.key==='Escape'&&!d.hidden)o(false)});
const s=document.querySelector('.strip [aria-current]');if(s)s.scrollIntoView({inline:'center',block:'nearest'});}</script>
</body>
</html>
`;
  }

  // ---- daftar + halaman bernomor
  const PER = 12, sitemapUrls = [];
  const pname = (base, n) => n === 1 ? `${base}.html` : `${base}-${n}.html`;
  function pager(base, n, total, root) {
    if (total < 2) return "";
    const b = base.split("/").pop(), nums = [];
    for (let k = 1; k <= total; k++) { if (k === 1 || k === total || Math.abs(k - n) <= 1) nums.push(k); else if (nums[nums.length - 1] !== "…") nums.push("…"); }
    const L = k => pname(b, k);
    return `<nav class="pg" aria-label="Halaman">${n > 1 ? `<a rel="prev" href="${L(n - 1)}">← Sebelumnya</a>` : `<span class="off">← Sebelumnya</span>`}<span class="pg-n">${nums.map(k => k === "…" ? `<span>…</span>` : k === n ? `<span aria-current="page">${k}</span>` : `<a href="${L(k)}">${k}</a>`).join("")}</span>${n < total ? `<a rel="next" href="${L(n + 1)}">Berikutnya →</a>` : `<span class="off">Berikutnya →</span>`}</nav>`;
  }
  function listPages(base, items, { title, desc, h1, lede = "", kicker = "", active = "", empty = "Belum ada tulisan.", crumb, noindex = false, extraTop = "", ldType = "CollectionPage" }) {
    const total = Math.max(1, Math.ceil(items.length / PER));
    for (let n = 1; n <= total; n++) {
      const path = pname(base, n), root = rootOf(path), url = SITE + path;
      const chunk = items.slice((n - 1) * PER, n * PER);
      const ttl = (n === 1 ? title : `${title} (Halaman ${n})`) + " — Antarala";
      const cr = [["Beranda", SITE]].concat(crumb || []).concat([[h1, url]]);
      const body = `<section class="ls"><div class="wrap">
  ${crumbHtml(cr.map(([t, u]) => [t, u.replace(SITE, root) || home(root)]), root)}
  <header class="ls-hd">${kicker ? `<p class="ls-k">${kicker}</p>` : ""}<h1>${e(h1)}${n > 1 ? ` <span>· halaman ${n}</span>` : ""}</h1>${lede ? `<p class="ls-l">${lede}</p>` : ""}${n === 1 ? extraTop : ""}</header>
  ${chunk.length ? `<div class="g3">${chunk.map((a, i) => card(a, root, { eager: n === 1 && i < 3 })).join("")}</div>` : `<p class="ls-l">${empty}</p>`}
  ${pager(base, n, total, root)}
</div></section>`;
      const ld = [crumbs(cr), { "@type": ldType, "@id": url, url, name: strip(ttl), description: desc, inLanguage: "id-ID", isPartOf: { "@id": SITE + "#web" },
        mainEntity: { "@type": "ItemList", itemListElement: chunk.map((a, i) => ({ "@type": "ListItem", position: (n - 1) * PER + i + 1, url: SITE + `artikel/${a.slug}.html`, name: strip(a.judul) })) } }];
      out[path] = page(path, { title: ttl, desc: n === 1 ? desc : `${desc} Halaman ${n}.`, body, active, ld, robots: noindex ? "noindex, follow" : undefined });
      if (!noindex) sitemapUrls.push([path, items[0] ? (items[0].diperbarui || items[0].tanggal) : ""]);
    }
  }

  // ================= BERANDA =================
  {
    const top = MAIN.slice(0, 3), lead = top[0], side = top.slice(1);
    const used = new Set(top);
    const latest = NEWS.filter(a => !used.has(a)).slice(0, 6);
    const op = ALL.filter(a => a.kategori === "Opini" && !used.has(a)).slice(0, 3);
    const ft = ALL.filter(a => a.kategori === "Feature" && !used.has(a)).slice(0, 3);
    const hot = [...TAGS.values()].filter(t => t.items.length >= 2).sort((p, q) => q.items.length - p.items.length || p.nama.localeCompare(q.nama)).slice(0, 14);
    const topikCount = k => ALL.filter(a => topikOf(a) === k).length;
    const sec = (h, href, more, inner) => `<section class="sc"><div class="wrap"><div class="sc-hd"><h2>${h}</h2><a href="${href}">${more} ${I.arrow}</a></div>${inner}</div></section>`;
    const body = `<h1 class="sr">Antarala — media musik dan kultur pop Indonesia</h1>
${lead ? `<section class="hero"><div class="wrap hero-g">
  ${card(lead, "", { cls: "cd-lead", eager: true, hx: "h2", sizes: "(max-width: 760px) 100vw, 760px" })}
  <div class="hero-s">${side.map(a => card(a, "", { cls: "cd-side", hx: "h2", sizes: "(max-width: 760px) 120px, 400px" })).join("")}</div>
</div></section>` : ""}
<section class="sc sc-up"><div class="wrap up-g">
  <div><div class="sc-hd"><h2>Update terbaru</h2><a href="update.html">Semua update ${I.arrow}</a></div>
  <div class="rws">${latest.map((a, i) => row(a, "", i + 1)).join("") || `<p class="ls-l">Update harian tayang tiap pagi.</p>`}</div></div>
  <aside class="up-a">
    ${hot.length ? `<div class="bx"><h2>Topik hangat</h2><div class="chips">${hot.map(t => `<a href="tag/${t.slug}.html">${e(t.nama)}</a>`).join("")}</div></div>` : ""}
    <div class="bx bx-d"><h2>Musisi atau label?</h2><p>Kirim brief rilisan barumu. Tim Antarala bantu susun campaign: KOL, creator, ads, sampai clippers.</p><a class="bt bt-l" href="brief.html">Kirim brief rilisan ${I.arrow}</a></div>
  </aside>
</div></section>
${op.length ? sec("Opini", "opini.html", "Semua opini", `<div class="g3">${op.map(a => card(a, "")).join("")}</div>`) : ""}
${ft.length ? sec("Feature", "feature.html", "Semua feature", `<div class="g3">${ft.map(a => card(a, "")).join("")}</div>`) : ""}
<section class="sc"><div class="wrap"><div class="sc-hd"><h2>Jelajahi topik</h2></div>
  <div class="tp">${Object.entries(TOPIK).map(([k, t]) => `<a class="tp-i" href="topik/${k}.html"><b>${t.nama}</b><span>${topikCount(k)} tulisan</span>${I.arrow}</a>`).join("")}</div>
</div></section>
<section class="cta"><div class="wrap cta-g">
  <div><h2>Punya opini yang pengin dibaca banyak orang?</h2><p>Kirim tulisanmu soal musik, kultur, atau hal-hal yang bikin kamu mikir. Tim Antarala membaca setiap kiriman.</p></div>
  <a class="bt bt-l" href="${mailto("Sumbang Tulisan")}">Sumbang tulisan ${I.arrow}</a>
</div></section>`;
    const preload = lead && opts.webp && !opts.img ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset(lead, "")}" imagesizes="(max-width: 760px) 100vw, 760px" fetchpriority="high">\n` : "";
    out["index.html"] = page("index.html", { head: preload, title: "Antarala — Berita Musik, Opini, dan Kultur Pop Indonesia", desc: "Antarala ngomongin musik, kultur, dan pikiran di antaranya: berita musik Indonesia terbaru, rilisan baru, konser, feature, dan opini.", body, active: "home",
      ld: [ORG, WEBSITE, { "@type": "ItemList", name: "Sorotan Antarala", itemListElement: top.concat(latest).map((a, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + `artikel/${a.slug}.html` })) }] });
    sitemapUrls.push(["", ALL[0] ? (ALL[0].diperbarui || ALL[0].tanggal) : ""]);
  }

  // ================= RUBRIK, TOPIK, TAG, PENULIS =================
  for (const [k, r] of Object.entries(RUBRIK)) listPages(r.slug, ALL.filter(a => a.kategori === k), { title: r.title, desc: r.desc, h1: r.h1, lede: r.lede, kicker: "Rubrik", active: r.slug, empty: k === "Berita" ? "Update harian tayang tiap pagi." : "Belum ada tulisan." });
  for (const [k, t] of Object.entries(TOPIK)) listPages(`topik/${k}`, ALL.filter(a => topikOf(a) === k), { title: t.title, desc: t.desc, h1: t.h1, lede: t.desc, kicker: "Topik", active: k, crumb: [["Topik", SITE + "topik/musik.html"]] });
  for (const t of TAGS.values()) {
    const ok = tagIndexable(t.slug);
    const related = [...new Set(t.items.flatMap(a => tagsOf(a).map(slugify)))].filter(s => s !== t.slug && tagIndexable(s)).slice(0, 10);
    listPages(`tag/${t.slug}`, t.items, { title: `${t.nama}: Berita, Lagu, dan Opini Terbaru`, h1: t.nama, kicker: "Tag",
      desc: TAG_INFO[t.slug] ? strip(TAG_INFO[t.slug]).slice(0, 155).replace(/\s+\S*$/, "") + "…" : `Kumpulan tulisan Antarala soal ${t.nama}: kabar terbaru, rilisan, dan opini. ${t.items.length} tulisan.`,
      lede: TAG_INFO[t.slug] ? `${TAG_INFO[t.slug]} <span class="ls-n">${t.items.length} tulisan, dari yang terbaru.</span>` : `${t.items.length} tulisan soal ${e(t.nama)} di Antarala, dari yang terbaru.`, noindex: !ok, crumb: [["Tag", SITE + "cari.html"]],
      extraTop: related.length ? `<div class="chips chips-s">${related.map(s => `<a href="${s}.html">${e(TAGS.get(s).nama)}</a>`).join("")}</div>` : "" });
  }
  for (const au of AUTH.values()) {
    const info = AUTHORS[au.nama] || {}, path = `penulis/${au.slug}.html`;
    const bio = info.bio || (au.nama === "Redaksi Antarala" ? "" : `${e(au.nama)} adalah kontributor Antarala. Punya tulisan juga? <a href="${mailto("Sumbang Tulisan")}">Sumbang tulisanmu</a>.`);
    listPages(`penulis/${au.slug}`, au.items, { title: `Tulisan ${au.nama} (${peran(au.nama)})`, h1: au.nama, kicker: peran(au.nama),
      desc: `Semua tulisan ${au.nama} di Antarala. ${au.items.length} tulisan soal musik dan kultur.`, lede: bio, crumb: [["Penulis", SITE + "tentang.html#penulis"]], ldType: "ProfilePage" });
    // tambahkan Person/Organization sebagai mainEntity profil
    out[path] = out[path].replace('"@type":"ProfilePage"', `"@type":"ProfilePage","about":${JSON.stringify(info.org ? { "@id": SITE + "#org" } : { "@type": "Person", "@id": SITE + path + "#person", name: au.nama, url: SITE + path, jobTitle: peran(au.nama), [peran(au.nama) === "Kontributor" ? "affiliation" : "worksFor"]: { "@id": SITE + "#org" } })}`);
  }

  // ================= ARTIKEL =================
  const linkable = [...TAGS.values()].filter(t => t.items.length >= 2 && t.nama.length > 3).sort((p, q) => q.nama.length - p.nama.length);
  function autolink(html, self, root, budget) {
    // tautkan penyebutan pertama tag (yang punya ≥2 tulisan) ke halaman tag-nya; hanya di teks, tidak di dalam tag/anchor
    let n = 0; const done = new Set();
    return html.replace(/<p>([\s\S]*?)<\/p>/g, (m, inner) => {
      if (n >= budget) return m;
      const parts = inner.split(/(<a\b[\s\S]*?<\/a>|<[^>]+>)/);
      for (let i = 0; i < parts.length && n < budget; i += 2) {
        for (const t of linkable) {
          if (done.has(t.slug) || !t.items.some(x => x !== self) || !tagsOf(self).map(slugify).includes(t.slug)) continue;
          const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${t.nama.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![\\p{L}\\p{N}])`, "iu");
          if (re.test(parts[i])) { parts[i] = parts[i].replace(re, `$1<a class="tl" href="${root}tag/${t.slug}.html">$2</a>`); done.add(t.slug); n++; break; }
        }
      }
      return `<p>${parts.join("")}</p>`;
    });
  }
  const score = (a, b) => { const ta = new Set(tagsOf(a).map(slugify)); let s = tagsOf(b).map(slugify).filter(x => ta.has(x)).length * 3; if (topikOf(a) === topikOf(b)) s += 1; if (a.kategori === b.kategori) s += 1; if (a.penulis === b.penulis && a.penulis !== "Redaksi Antarala") s += 1; return s; };
  for (const a of ALL) {
    const path = `artikel/${a.slug}.html`, root = "../", url = SITE + path, r = rub(a), tk = topikOf(a), T = TOPIK[tk];
    const tags = tagsOf(a).map(t => ({ nama: t, slug: slugify(t) })).filter(t => t.slug);
    const rel = ALL.filter(x => x !== a).map(x => [x, score(a, x)]).sort((p, q) => q[1] - p[1] || byDate(p[0], q[0])).map(x => x[0]);
    const inline = rel[0];
    const blocks = (a.isi || []).map(b => b[0] === "p" ? `<p>${b[1]}</p>` : b[0] === "h" ? `<h2>${b[1]}</h2>` : `<blockquote><p>${b[1]}</p>${b[2] ? `<cite>${b[2]}</cite>` : ""}</blockquote>`);
    const pIdx = []; blocks.forEach((h, i) => { if (h.startsWith("<p>")) pIdx.push(i); });
    if (inline && pIdx.length >= 5) blocks.splice(pIdx[2] + 1, 0, `<aside class="rj"><span>Baca juga</span><a href="${art(inline, root)}">${inline.judul}</a></aside>`);
    const bodyHtml = autolink(blocks.join("\n"), a, root, 3);
    const refs = (a.referensi || []).length ? `<section class="refs"><h2>Referensi</h2><ol>${a.referensi.map(x => `<li>${x[0]}${x[1] ? ` — <a href="${e(x[1])}" target="_blank" rel="noopener nofollow">${e(String(x[1]).replace(/^https?:\/\/(www\.)?/, "").split("/")[0])}</a>` : ""}</li>`).join("")}</ol></section>` : "";
    const ytId = (String(a.yt || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
    const yt = ytId ? `<figure class="yt"><div class="yt-f" data-id="${ytId}"><button type="button" aria-label="Putar video YouTube"><img src="https://i.ytimg.com/vi/${ytId}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="yt-p" aria-hidden="true"></span></button></div><figcaption>Video resmi via YouTube</figcaption></figure>` : "";
    const ig = a.ig ? `<p class="igl"><a href="${e(a.ig)}" target="_blank" rel="noopener">Lihat postingan aslinya di Instagram →</a></p>` : "";
    const poin = (a.poin || []).filter(Boolean);
    const faq = (a.faq || []).filter(f => f && f[0] && f[1]);
    const intinya = poin.length ? `<section class="tl-dr" aria-label="Intinya"><h2>Intinya</h2><ul>${poin.map(p => `<li>${p}</li>`).join("")}</ul></section>` : "";
    const auSlug = penulisSlug(a.penulis), auInfo = AUTHORS[a.penulis] || {};
    const pub = iso(a.tanggal, a.jam), mod = a.diperbarui && a.diperbarui > (a.tanggal || "") ? iso(a.diperbarui, "12:00") : pub;
    const cr = [["Beranda", SITE], [r.nama, SITE + r.slug + ".html"], [strip(a.judulSeo || a.judul), url]];
    const st = strip(a.judulSeo || a.judul), title = st.length <= 52 ? `${st} — Antarala` : st;
    const type = isB(a) ? "NewsArticle" : a.kategori === "Opini" ? "OpinionNewsArticle" : "NewsArticle";
    const words = strip((a.isi || []).map(b => b[1]).join(" ")).split(/\s+/).filter(Boolean).length;
    const author = auInfo.org ? { "@type": "Organization", name: a.penulis, url: SITE + `penulis/${auSlug}.html` } : { "@type": "Person", "@id": SITE + `penulis/${auSlug}.html#person`, name: a.penulis, url: SITE + `penulis/${auSlug}.html` };
    const ld = [ORG, crumbs(cr), { "@type": type, "@id": url + "#artikel", headline: strip(a.judul).slice(0, 110), alternativeHeadline: a.judulSeo ? strip(a.judulSeo) : undefined, description: strip(a.ringkas), url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url }, image: { "@type": "ImageObject", url: SITE + "assets/img/" + a.cover, width: 1200, height: 900, caption: strip(a.alt) },
      datePublished: pub || undefined, dateModified: mod || undefined, author, editor: { "@type": "Person", name: REDAKSI.editor }, publisher: { "@id": SITE + "#org" }, inLanguage: "id-ID", articleSection: r.nama,
      keywords: tags.map(t => t.nama).concat([T.nama]).join(", ") || undefined, about: tags.slice(0, 5).map(t => ({ "@type": "Thing", name: t.nama })), wordCount: words, isAccessibleForFree: true,
      citation: (a.referensi || []).filter(x => x[1]).map(x => x[1]) }];
    if (faq.length) ld.push({ "@type": "FAQPage", "@id": url + "#faq", mainEntity: faq.map(f => ({ "@type": "Question", name: strip(f[0]), acceptedAnswer: { "@type": "Answer", text: strip(f[1]) } })) });
    const artMeta = `<meta property="article:published_time" content="${pub}">\n<meta property="article:modified_time" content="${mod}">\n<meta property="article:section" content="${e(r.nama)}">\n${tags.map(t => `<meta property="article:tag" content="${e(t.nama)}">\n`).join("")}<meta name="author" content="${e(a.penulis)}">\n`;
    const body = `<article class="ar">
<div class="wrap">
  ${crumbHtml([["Beranda", "../"], [r.nama, `../${r.slug}.html`], [strip(a.judulSeo || a.judul), ""]], root)}
  <header class="ar-hd">
    <div class="kk">${rubLink(a, root)}<a class="tk" href="../topik/${tk}.html">${T.nama}</a></div>
    <h1>${a.judul}</h1>
    <p class="ar-dek">${a.ringkas}</p>
    <div class="ar-by"><span>${a.kategori === "Opini" ? "Opini" : "Oleh"} <a rel="author" href="../penulis/${auSlug}.html">${e(a.penulis)}</a></span>
      ${a.tanggal ? `<span><time datetime="${pub}">${tgl(a.tanggal)}${a.jam ? `, ${a.jam} WIB` : ""}</time></span>` : ""}
      ${mod !== pub ? `<span>Diperbarui <time datetime="${mod}">${tgl(a.diperbarui)}</time></span>` : ""}
      <span>${a.menit || 2} menit baca</span></div>
  </header>
  <figure class="ar-fig">${pic(a, root, { eager: true, sizes: "(max-width: 900px) 100vw, 900px" })}<figcaption>${/^(ilustrasi|foto)/i.test(a.foto || "") ? e(a.foto) : "Foto: " + e(a.foto || "istimewa")}</figcaption></figure>
  <div class="ar-g">
    <div class="ar-body">
${intinya}
${bodyHtml}
${yt}
${ig}
${faq.length ? `<section class="faq"><h2>Pertanyaan yang sering ditanyakan</h2>${faq.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}</section>` : ""}
${tags.length ? `<div class="ar-tags"><span>Tag</span>${tags.map(t => `<a href="../tag/${t.slug}.html">${e(t.nama)}</a>`).join("")}</div>` : ""}
${refs}
<div class="sh"><span>Bagikan</span><a class="bt" data-sh="wa" href="https://wa.me/?text=${encodeURIComponent(strip(a.judul) + " " + url)}" target="_blank" rel="noopener">WhatsApp</a><a class="bt" data-sh="x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(strip(a.judul))}&amp;url=${encodeURIComponent(url)}" target="_blank" rel="noopener">X</a><button class="bt" type="button" data-sh="cp">Salin tautan</button><span class="sh-t" role="status"></span></div>
<aside class="au"><p class="au-k">${["Redaksi", "Penulis"].includes(peran(a.penulis)) ? "Ditulis oleh" : peran(a.penulis)}</p><p class="au-n"><a href="../penulis/${auSlug}.html">${e(a.penulis)}</a></p>${auInfo.bio ? `<p class="au-b">${e(auInfo.bio)}</p>` : ""}${a.kategori === "Opini" ? `<p class="au-b">${peran(a.penulis) === "Kontributor" ? `${e(a.penulis)} adalah kontributor Antarala. ` : ""}Tulisan opini adalah pandangan pribadi penulis. <a href="../pedoman.html">Pedoman redaksi</a> · <a href="${mailto("Sumbang Tulisan")}">Sumbang tulisan</a></p>` : ""}</aside>
    </div>
  </div>
</div>
</article>
<section class="sc"><div class="wrap"><div class="sc-hd"><h2>Baca juga</h2><a href="../${r.slug}.html">Semua ${r.nama.toLowerCase()} ${I.arrow}</a></div>
<div class="g3">${rel.slice(1, 4).map(o => card(o, root)).join("")}</div></div></section>
<script>{document.querySelectorAll('[data-sh=cp]').forEach(b=>b.onclick=()=>{const t=document.querySelector('.sh-t');navigator.clipboard.writeText(location.href).then(()=>t.textContent='Tautan disalin',()=>t.textContent=location.href)});
document.querySelectorAll('.yt-f').forEach(f=>f.querySelector('button').onclick=()=>{f.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+f.dataset.id+'?autoplay=1" title="Video YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'});}</script>`;
    const heroPre = opts.webp && !opts.img ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset(a, root)}" imagesizes="(max-width: 900px) 100vw, 900px" fetchpriority="high">\n` : "";
    out[path] = page(path, { head: heroPre, title, desc: strip(a.ringkas), body, active: r.slug, og: a.cover, ld, type: "article", articleMeta: artMeta });
    sitemapUrls.push([path, a.diperbarui || a.tanggal, a]);
  }

  // ================= HALAMAN STATIS =================
  const staticPage = (path, title, desc, h1, inner, active = "", extraLd = []) => {
    const cr = [["Beranda", SITE], [h1, SITE + path]];
    out[path] = page(path, { title, desc, active, ld: [ORG, crumbs(cr)].concat(extraLd), body: `<section class="st"><div class="wrap st-w">${crumbHtml([["Beranda", "./"], [h1, ""]], "")}<h1>${h1}</h1>${inner}</div></section>` });
    sitemapUrls.push([path, ""]);
  };
  const writers = [...AUTH.values()].filter(w => peran(w.nama) === "Kontributor").sort((p, q) => q.items.length - p.items.length || p.nama.localeCompare(q.nama));
  staticPage("tentang.html", "Tentang Antarala — Media Musik dan Kultur Pop", ABOUT, "Tentang Antarala", `
<p class="st-l">${ABOUT}</p>
<div class="pl">
  <div><b>Update</b><span>Kabar rilisan, konser, dan kultur pop yang dirangkum tiap pagi.</span></div>
  <div><b>Feature</b><span>Cerita yang lebih panjang soal musisi dan makna di balik lagu.</span></div>
  <div><b>Opini</b><span>Pandangan personal yang jujur dari penulis dan pendengar.</span></div>
</div>
<h2>Siapa di balik Antarala</h2>
<p>Antarala adalah bagian dari <a href="https://futurinc.co.id/" rel="noopener">FUTURINC</a>, agensi digital di Indonesia. Update harian disusun oleh Redaksi Antarala, sementara feature dan opini ditulis oleh tim dan para kontributor.</p>
<h2 id="redaksi">Susunan redaksi</h2>
<ul class="wr"><li><a href="penulis/${slugify(REDAKSI.pemred)}.html">${REDAKSI.pemred}</a><span>Pemimpin Redaksi</span></li><li><b>${REDAKSI.editor}</b><span>Editor</span></li>${REDAKSI.penulis.map(n => `<li><a href="penulis/${slugify(n)}.html">${n}</a><span>Penulis</span></li>`).join("")}<li><b>Kontributor</b><span>Penulis tamu lewat Sumbang Tulisan</span></li></ul>
<h2 id="penulis">Kontributor</h2>
<p>Feature dan opini di Antarala banyak ditulis oleh kontributor: penulis dan pendengar yang mengirim tulisan lewat program <a href="${mailto("Sumbang Tulisan")}">Sumbang Tulisan</a>. Nama penulis selalu tercantum di setiap tulisan.</p>
<ul class="wr">${writers.map(w => `<li><a href="penulis/${w.slug}.html">${e(w.nama)}</a><span>${w.items.length} tulisan</span></li>`).join("")}</ul>
<h2>Cara kami bekerja</h2>
<p>Setiap kabar dicek ke minimal dua sumber kredibel atau satu sumber resmi, dan sumbernya kami cantumkan di bagian Referensi. Selengkapnya ada di <a href="pedoman.html">pedoman redaksi</a>.</p>
<h2>Hubungi kami</h2>
<p>Kerja sama, rilis pers, atau koreksi: <a href="mailto:${EMAIL}">${EMAIL}</a>. Musisi dan label bisa <a href="brief.html">mengirim brief rilisan</a>.</p>
${follow()}`, "", [{ "@type": "AboutPage", "@id": SITE + "tentang.html", url: SITE + "tentang.html", name: "Tentang Antarala", about: { "@id": SITE + "#org" }, inLanguage: "id-ID" }]);

  staticPage("pedoman.html", "Pedoman Redaksi Antarala", "Pedoman redaksi Antarala: cara kami memilih kabar, memverifikasi sumber, menulis opini, dan menangani koreksi.", "Pedoman redaksi", `
<p class="st-l">Pedoman ini menjelaskan cara Antarala memilih, menulis, dan memperbaiki tulisan.</p>
<h2>Memilih kabar</h2>
<p>Kami fokus pada musik Indonesia, musik internasional yang relevan buat pembaca Indonesia, konser dan festival, serta film, series, dan kultur pop. Kami menghindari gosip, rumor, dan kabar duka yang belum diumumkan resmi.</p>
<h2>Verifikasi dan sumber</h2>
<p>Setiap update dikonfirmasi ke minimal dua sumber kredibel atau satu sumber resmi (musisi, label, promotor, atau rilis pers). Sumber dicantumkan di bagian Referensi di akhir tulisan. Kutipan langsung hanya kami pakai kalau memang ada di sumbernya.</p>
<h2>Opini</h2>
<p>Tulisan di rubrik Opini adalah pandangan pribadi penulisnya dan ditandai jelas sebagai opini. Data dan fakta di dalamnya tetap kami cek.</p>
<h2>Foto dan ilustrasi</h2>
<p>Sumber foto dicantumkan di bawah setiap gambar. Gambar bertanda "Ilustrasi: Antarala" dibuat oleh tim kami.</p>
<h2 id="koreksi">Koreksi</h2>
<p>Kalau kamu menemukan kesalahan, kirim email ke <a href="${mailto("Koreksi")}">${EMAIL}</a> dengan subjek "Koreksi". Tulisan yang diperbaiki akan diperbarui tanggalnya.</p>
<h2>Kerja sama</h2>
<p>Konten kerja sama atau berbayar akan kami tandai dengan jelas.</p>`);

  staticPage("privasi.html", "Kebijakan Privasi Antarala", "Kebijakan privasi Antarala: data apa yang dikumpulkan saat kamu membaca situs ini, penggunaan cookie, iklan Google AdSense, Google Analytics, dan cara menolaknya.", "Kebijakan privasi", `
<p class="st-l">Halaman ini menjelaskan data apa yang dikumpulkan saat kamu membuka antarala.co.id dan bagaimana data itu dipakai. Terakhir diperbarui 28 November 2026.</p>
<h2>Data yang kami kumpulkan</h2>
<p>Kamu bisa membaca semua tulisan di Antarala tanpa membuat akun. Kami tidak meminta nama, email, atau data pribadi lain kecuali kamu sendiri yang mengirimkannya, misalnya lewat email ke <a href="mailto:${EMAIL}">${EMAIL}</a> atau formulir brief rilisan. Data yang kamu kirim itu hanya dipakai untuk membalas atau menindaklanjuti kirimanmu.</p>
<h2>Cookie dan statistik pengunjung</h2>
<p>Kami memakai Google Analytics untuk mengetahui jumlah pengunjung, halaman yang dibaca, dan asal kunjungan secara umum. Google Analytics menyimpan cookie di browser kamu dan mengumpulkan data seperti jenis perangkat, browser, perkiraan lokasi, dan halaman yang dibuka. Kami tidak memakai data ini untuk mengenali kamu secara pribadi.</p>
<h2>Iklan Google AdSense</h2>
<p>Antarala menampilkan iklan dari Google AdSense untuk membiayai operasional redaksi. Vendor pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan kamu sebelumnya ke situs ini atau situs lain.</p>
<p>Kamu bisa menonaktifkan iklan yang dipersonalisasi lewat <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Setelan Iklan Google</a>, atau menonaktifkan cookie vendor pihak ketiga untuk iklan yang dipersonalisasi lewat <a href="https://www.aboutads.info/choices" rel="nofollow noopener" target="_blank">aboutads.info</a>. Penjelasan lengkap dari Google ada di halaman <a href="https://policies.google.com/technologies/ads" rel="nofollow noopener" target="_blank">cara Google menggunakan cookie dalam iklan</a>.</p>
<p>Iklan tidak memengaruhi isi tulisan. Konten kerja sama atau berbayar akan kami tandai dengan jelas sesuai <a href="pedoman.html">pedoman redaksi</a>.</p>
<h2>Video YouTube</h2>
<p>Video di artikel kami ditampilkan lewat mode privasi YouTube (youtube-nocookie.com) dan baru dimuat setelah kamu menekan tombol putar. Setelah diputar, kebijakan privasi Google dan YouTube yang berlaku.</p>
<h2>Mengatur atau menghapus cookie</h2>
<p>Kamu bisa menolak atau menghapus cookie kapan saja lewat pengaturan browser. Situs tetap bisa dibaca, tapi iklan yang tampil mungkin jadi kurang relevan.</p>
<h2>Tautan ke situs lain</h2>
<p>Tulisan kami sering menautkan sumber dari media atau situs lain. Kebijakan privasi situs-situs itu di luar tanggung jawab kami.</p>
<h2>Perubahan dan kontak</h2>
<p>Kebijakan ini bisa kami perbarui sewaktu-waktu, dan tanggal pembaruannya akan tercantum di atas. Pertanyaan soal privasi bisa dikirim ke <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`);

  const opt = [["Kerja sama & iklan", "Kolaborasi konten, promosi rilisan, atau kampanye brand bersama Antarala.", "Inquiry Kerja Sama"],
    ["Kirim rilis pers", "Musisi, label, atau penyelenggara acara yang ingin kabarnya diliput. Panduannya ada di halaman Kirim rilis pers.", "Rilis Pers"],
    ["Sumbang tulisan", "Kirim opini atau tulisanmu. Lampirkan naskah, foto, dan sumber fotonya.", "Sumbang Tulisan"],
    ["Koreksi & pertanyaan", "Menemukan kesalahan atau punya masukan? Kabari kami.", "Koreksi"]];
  staticPage("kontak.html", "Kontak Antarala — Kerja Sama, Rilis Pers, Sumbang Tulisan", "Hubungi Antarala untuk kerja sama, rilis pers, sumbang tulisan, atau koreksi.", "Kontak", `
<p class="st-l">Semua pertanyaan dan kerja sama bisa dikirim ke <a href="mailto:${EMAIL}"><b>${EMAIL}</b></a>. Pilih topiknya supaya subjek email terisi otomatis.</p>
<div class="kg">${opt.map(([t, d, s]) => `<a class="kc" href="${mailto(s)}"><h2>${t}</h2><p>${d}</p><span>Kirim email ${I.arrow}</span></a>`).join("")}<a class="kc kc-d" href="brief.html"><h2>Brief campaign rilisan</h2><p>Musisi dan label: isi brief sekali, tim kami kirim rekomendasi campaign.</p><span>Isi brief ${I.arrow}</span></a></div>
${follow()}`, "", [{ "@type": "ContactPage", url: SITE + "kontak.html", name: "Kontak Antarala" }]);

  staticPage("rilis-pers.html", "Kirim Rilis Pers ke Antarala — Panduan untuk Musisi, Label, dan Promotor", "Cara mengirim rilis pers rilisan, konser, atau festival ke Redaksi Antarala: isi yang dibutuhkan, format foto, dan kontak.", "Kirim rilis pers", `
<p class="st-l">Punya rilisan baru, konser, atau festival yang ingin diliput? Kirim rilis persnya ke Redaksi Antarala. Setiap kiriman kami baca, dan kabar yang relevan buat pembaca kami tulis di rubrik Update.</p>
<h2>Kirim ke mana</h2>
<p>Email ke <a href="${mailto("Rilis Pers")}"><b>${EMAIL}</b></a> dengan subjek <b>Rilis Pers: [nama musisi/acara] – [judul rilisan/acara]</b>. Kirim paling lambat di hari rilis. Kabar yang dikirim beberapa hari sebelumnya bisa kami siapkan lebih rapi.</p>
<h2>Yang perlu ada di rilis pers</h2>
<ul class="ls-ul">
<li>Nama musisi/band, judul rilisan atau acara, dan tanggal rilis atau tanggal acara.</li>
<li>Label, manajemen, atau promotor, plus kontak yang bisa dihubungi untuk konfirmasi.</li>
<li>Cerita di balik lagu atau acara: siapa yang terlibat, proses pembuatan, makna, atau hal unik lainnya.</li>
<li>Kutipan resmi dari musisi atau penyelenggara, kalau ada.</li>
<li>Link resmi: Spotify/YouTube/Apple Music, video klip, halaman tiket, dan akun media sosial.</li>
<li>Untuk konser dan festival: venue, kota, jadwal, kategori dan harga tiket, serta tempat pembelian resmi.</li>
</ul>
<h2>Foto dan aset</h2>
<ul class="ls-ul">
<li>Foto press atau artwork resmi, orientasi horizontal, minimal 1600 piksel di sisi terpanjang (JPG/PNG).</li>
<li>Cantumkan kredit foto yang harus kami tulis.</li>
<li>Kirim lewat lampiran atau link Google Drive/Dropbox yang bisa dibuka tanpa minta akses.</li>
</ul>
<h2>Yang perlu kamu tahu</h2>
<p>Kami memilih kabar berdasarkan relevansinya buat pembaca, jadi tidak semua rilis pers bisa kami muat. Tulisan dibuat ulang dengan gaya Antarala dan sumbernya kami cantumkan di bagian Referensi. Liputan editorial tidak berbayar. Untuk promosi atau campaign berbayar, gunakan <a href="brief.html">brief campaign rilisan</a>, dan konten kerja sama akan kami tandai dengan jelas sesuai <a href="pedoman.html">pedoman redaksi</a>.</p>`);

  // pencarian (data dari search.json)
  out["cari.html"] = page("cari.html", { title: "Cari di Antarala", desc: "Cari berita musik, opini, dan feature di Antarala.", robots: "noindex, follow", active: "",
    body: `<section class="ls"><div class="wrap"><header class="ls-hd"><p class="ls-k">Pencarian</p><h1>Cari di Antarala</h1></header>
<form class="srch srch-l" role="search" action="cari.html"><label class="sr" for="q">Kata kunci</label><input id="q" name="q" type="search" placeholder="Nama musisi, lagu, konser…" autocomplete="off"><button class="ic" aria-label="Cari">${I.search}</button></form>
<p class="ls-l" id="sm" role="status"></p><div class="g3" id="sr"></div>
<div class="bx" id="tg"><h2>Semua tag</h2><div class="chips">${[...TAGS.values()].sort((p, q) => p.nama.localeCompare(q.nama, "id")).map(t => `<a href="tag/${t.slug}.html">${e(t.nama)}</a>`).join("")}</div></div>
</div></section>
<script>{const q=document.getElementById('q'),sr=document.getElementById('sr'),sm=document.getElementById('sm');let D=null;
const n=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');const x=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function run(){const v=q.value.trim();history.replaceState(null,'',v?'?q='+encodeURIComponent(v):'cari.html');if(!v){sr.innerHTML='';sm.textContent='';return}
if(!D){try{D=await (await fetch('search.json')).json()}catch(e){sm.textContent='Pencarian belum bisa dimuat.';return}}
const w=n(v).split(/\\s+/).filter(Boolean),r=D.filter(a=>{const h=n(a.t+' '+a.d+' '+a.g+' '+a.p+' '+a.r);return w.every(k=>h.includes(k))});
sm.textContent=r.length?r.length+' hasil untuk “'+v+'”':'Tidak ada hasil untuk “'+v+'”. Coba kata kunci lain.';
sr.innerHTML=r.slice(0,30).map(a=>'<article class="cd"><a class="cd-ph" href="'+a.u+'" tabindex="-1" aria-hidden="true"><img src="'+a.i+'" alt="" loading="lazy"></a><div class="cd-tx"><div class="kk"><span class="rb">'+x(a.r)+'</span><span class="mt">'+x(a.dt)+'</span></div><h2 class="cd-h"><a href="'+a.u+'">'+x(a.t)+'</a></h2><p class="cd-p">'+x(a.d)+'</p></div></article>').join('')}
q.value=new URLSearchParams(location.search).get('q')||'';let tm;q.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(run,200)});document.querySelector('.srch-l').onsubmit=ev=>{ev.preventDefault();run()};run();}</script>` });
  out["search.json"] = JSON.stringify(ALL.map(a => ({ u: `artikel/${a.slug}.html`, t: strip(a.judul), d: strip(a.ringkas), g: tagsOf(a).join(" "), p: a.penulis, r: rub(a).nama, dt: tgl(a.tanggal, true), i: opts.img ? opts.img(a, "") : `assets/img/${a.cover}?v=${ver(a)}` })));

  out["404.html"] = page("404.html", { title: "Halaman tidak ditemukan — Antarala", desc: "Halaman yang kamu cari tidak ada.", robots: "noindex, follow",
    body: `<section class="st"><div class="wrap st-w"><p class="ls-k">404</p><h1>Halamannya nggak ketemu</h1><p class="st-l">Mungkin alamatnya berubah atau tulisannya sudah dipindah. Coba cari, atau mulai dari yang terbaru.</p>
<form class="srch srch-l" role="search" action="/cari.html"><label class="sr" for="q4">Cari</label><input id="q4" name="q" type="search" placeholder="Cari musisi, lagu, konser…"><button class="ic" aria-label="Cari">${I.search}</button></form>
<div class="g3" style="margin-top:32px">${ALL.slice(0, 3).map(a => card(a, "/")).join("")}</div></div></section>` }).replace(/href="\.\/"/g, 'href="/"').replace(/(href|src|srcset)="(?!https?:|\/|#|mailto:|data:)/g, '$1="/');

  // pengalihan halaman lama (cadangan kalau .htaccess tidak jalan; ditimpa kalau halaman aslinya ada)
  const legacy = { "berita.html": "update.html", "artikel-opini.html": "opini.html", "artikel-feature.html": "feature.html", "artikel-opini-2.html": "opini.html", "opini-2.html": "opini.html", "opini-3.html": "opini.html", "artikel/kepala-4-mcr-masih-bikin-merinding.html": "artikel/konser-my-chemical-romance-jis-kepala-4.html" };
  for (const [from, to] of Object.entries(legacy)) if (!out[from]) out[from] = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Antarala</title><link rel="canonical" href="${SITE}${to}"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url=${SITE}${to}"></head><body><a href="${SITE}${to}">Lanjut ke halaman baru</a></body></html>`;

  // ================= SITEMAP, FEED, ROBOTS, LLMS =================
  const last = ALL.map(a => a.diperbarui || a.tanggal || "").sort().pop() || new Date().toISOString().slice(0, 10);
  out["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls.map(([u, d, a]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d || last}</lastmod>${a ? `<image:image><image:loc>${SITE}assets/img/${e(a.cover)}</image:loc></image:image>` : ""}</url>`).join("\n")}
</urlset>
`;
  const newest = NEWS[0] ? new Date(iso(NEWS[0].tanggal, NEWS[0].jam)).getTime() : 0;
  const fresh = ALL.filter(a => a.tanggal && newest - new Date(iso(a.tanggal, a.jam)).getTime() < 2 * 864e5).slice(0, 1000);
  out["news-sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${fresh.map(a => `  <url><loc>${SITE}artikel/${a.slug}.html</loc><news:news><news:publication><news:name>Antarala</news:name><news:language>id</news:language></news:publication><news:publication_date>${iso(a.tanggal, a.jam)}</news:publication_date><news:title>${e(strip(a.judul))}</news:title></news:news></url>`).join("\n")}
</urlset>
`;
  const rfc = a => new Date(iso(a.tanggal || last, a.jam)).toUTCString();
  out["feed.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>Antarala</title><link>${SITE}</link><description>${e(BIO)}</description><language>id</language>
  <atom:link href="${SITE}feed.xml" rel="self" type="application/rss+xml"/>
  <image><url>${SITE}assets/img/icon-192.png</url><title>Antarala</title><link>${SITE}</link></image>
${ALL.slice(0, 50).map(a => `  <item><title>${e(strip(a.judul))}</title><link>${SITE}artikel/${a.slug}.html</link><guid isPermaLink="true">${SITE}artikel/${a.slug}.html</guid>
    <description>${e(strip(a.ringkas))}</description><dc:creator>${e(a.penulis)}</dc:creator><category>${e(rub(a).nama)}</category>${tagsOf(a).map(t => `<category>${e(t)}</category>`).join("")}<pubDate>${rfc(a)}</pubDate>
    <media:content url="${SITE}assets/img/${e(a.cover)}" medium="image"/></item>`).join("\n")}
</channel>
</rss>
`;
  const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "meta-externalagent"];
  out["robots.txt"] = `# Antarala — semua mesin pencari dan asisten AI boleh membaca dan mengutip konten publik.
User-agent: *
Allow: /
Disallow: /cari.html?
Disallow: /kol.html

${AI_BOTS.map(b => `User-agent: ${b}`).join("\n")}
Allow: /

Sitemap: ${SITE}sitemap.xml
Sitemap: ${SITE}news-sitemap.xml
`;
  const md = s => strip(s).replace(/\s+/g, " ").trim();
  out["llms.txt"] = `# Antarala

> ${ABOUT} Bahasa: Indonesia. Bagian dari FUTURINC (https://futurinc.co.id/).

Antarala terbit setiap hari. Rubrik: Update (berita musik dan kultur pop, dicek ke minimal dua sumber kredibel atau satu sumber resmi), Feature (cerita di balik lagu dan musisi), dan Opini (pandangan pribadi penulis). Setiap tulisan mencantumkan penulis, tanggal terbit, dan referensi. Saat mengutip, sebutkan "Antarala" dan tautkan ke URL artikelnya.

## Halaman utama
- [Beranda](${SITE}): sorotan dan update terbaru
- [Update](${SITE}update.html): ${RUBRIK.Berita.desc}
- [Opini](${SITE}opini.html): ${RUBRIK.Opini.desc}
- [Feature](${SITE}feature.html): ${RUBRIK.Feature.desc}
- [Tentang](${SITE}tentang.html): siapa di balik Antarala
- [Pedoman redaksi](${SITE}pedoman.html): verifikasi, opini, dan koreksi

## Topik
${Object.entries(TOPIK).map(([k, t]) => `- [${t.nama}](${SITE}topik/${k}.html): ${t.desc}`).join("\n")}

## Tulisan terbaru
${ALL.slice(0, 60).map(a => `- [${md(a.judul)}](${SITE}artikel/${a.slug}.html): ${md(a.ringkas)} (${rub(a).nama}, ${a.penulis}, ${a.tanggal || ""})`).join("\n")}

## Lainnya
- [RSS](${SITE}feed.xml)
- [Sitemap](${SITE}sitemap.xml)
- Kontak: ${EMAIL}
`;
  out["site.webmanifest"] = JSON.stringify({ name: "Antarala", short_name: "Antarala", description: BIO, lang: "id", start_url: "/", display: "standalone", background_color: "#f4f1ea", theme_color: "#1e1e1e",
    icons: [{ src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" }] }, null, 1);
  return out;
}
})();
