/* Generator website Antarala (port dari build_antarala.py).
   build(articles, opts) -> { "index.html": "...", "artikel/x.html": "...", ... }
   opts.img(a) -> URL gambar cover untuk dipakai di HTML; opts.root(depth) -> prefix aset. */
(function () {
const SITE = "https://antarala.futurinc.co.id/";
const IG = "https://www.instagram.com/antarala__/";
const TT = "https://www.tiktok.com/@antarala__";
const EMAIL = "antarala@futurinc.co.id";
const BIO = "Ngomongin musik, kultur, pikiran, dan kabar yang menarik di antaranya.";
const e = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ICON_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
const ICON_TT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2c-1.5 0-2.8-.4-4-1.2v6.3c0 3.2-2.6 5.8-5.8 5.8S5 18.4 5 15.2s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.1-.9-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.6-1.1 2.6-2.6V3h3.2z"/></svg>';
const mailto = s => `mailto:${EMAIL}?subject=${s.replace(/ /g, "%20")}`;
const bylab = a => a.kategori === "Opini" ? "Opini" : "Oleh";
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const tgl = d => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); return m ? `${+m[3]} ${BULAN[+m[2] - 1]} ${m[1]}` : ""; };
const isB = a => a.kategori === "Berita";
const lab = a => isB(a) ? "Update" : a.kategori;
const kicker = a => `<div class="kicker"><span class="tag">${e(lab(a))}</span><span>${isB(a) && a.tanggal ? tgl(a.tanggal) + " · " : ""}${a.menit || 2} menit baca</span></div>`;
const byDate = (p, q) => ((q.tanggal || "") + (q.jam || "")).localeCompare((p.tanggal || "") + (p.jam || ""));

window.AntaralaGen = { build, SITE };

function build(ARTICLES, opts) {
  const VER = opts.ver || String(Date.now()).slice(0, 10);
  const ast = root => opts.assets ? opts.assets : root + "assets/";
  const imgURL = (a, root) => opts.img ? opts.img(a, root) : `${root}assets/img/${a.cover}?v=${(a.diperbarui || "").replace(/-/g, "") || VER}`;
  const media = (a, root, cls = "", eager = false) => {
    const pos = a.fokus ? ` style="object-position:${a.fokus}"` : "";
    return `<img class="${cls}" src="${imgURL(a, root)}" alt="${e(a.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}${pos}>`;
  };
  const card = (a, root = "") => `<a class="card" href="${root}artikel/${a.slug}.html">
  <div class="ph">${media(a, root)}</div>
  ${kicker(a)}
  <h3 class="h-m">${a.judul}</h3>
  <p>${a.ringkas}</p>
  <div class="by">Oleh <b>${e(a.penulis)}</b></div>
</a>`;
  const follow = (dark) => { const c = dark ? " light" : ""; return `<div class="follow"><a class="btn solid${c}" href="${IG}" target="_blank" rel="noopener">${ICON_IG} @antarala__ di Instagram</a><a class="btn${c}" href="${TT}" target="_blank" rel="noopener">${ICON_TT} TikTok</a></div>`; };
  const ORG = { "@type": "Organization", name: "Antarala", url: SITE, logo: { "@type": "ImageObject", url: SITE + "assets/img/icon-512.png", width: 512, height: 512 }, sameAs: [IG, TT] };

  function page(title, desc, body, root, path, active, ogImg = "og-antarala.jpg", ld = null, ogType = "website") {
    const nav = [["index.html", "Beranda", "home"], ["update.html", "Update", "berita"], ["opini.html", "Artikel", "opini"], ["tentang.html", "Tentang", "tentang"], ["kontak.html", "Kontak", "kontak"]];
    const links = nav.map(([h, t, k]) => `<a href="${root}${h}"${k === active ? " aria-current=page" : ""}>${t}</a>`).join("");
    const url = SITE + (path === "index.html" ? "" : path);
    const msg = "Punya opini soal musik, kultur, atau hidup sehari-hari? Sumbang tulisanmu ke Antarala";
    const track = Array(6).fill(`<span>${msg}</span><span aria-hidden="true">✦</span>`).join("");
    const A = ast(root);
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#1e1e1e">
<meta property="og:site_name" content="Antarala">
<meta property="og:locale" content="id_ID">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}assets/img/${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${SITE}assets/img/${ogImg}">
<link rel="icon" href="${root}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="48x48" href="${A}img/favicon-48.png">
<link rel="apple-touch-icon" href="${A}img/apple-touch-icon.png">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="Antarala" href="${SITE}feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${A}style.css?v=${VER}">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ""}
${opts.ga ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${opts.ga}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${opts.ga}');</script>` : ""}
</head>
<body>
<a class="ticker" href="${mailto("Sumbang Tulisan")}" aria-label="Sumbang tulisan: kirim email ke ${EMAIL}"><div class="track">${track}${track}</div></a>
<header class="top"><div class="wrap">
  <a class="brand" href="${root}index.html" aria-label="Antarala, beranda"><img src="${A}img/logo-dark.png" alt="antarala" width="116" height="26"></a>
  <button class="burger" aria-label="Menu" aria-expanded="false" onclick="var n=document.querySelector('.nav');n.classList.toggle('open');this.setAttribute('aria-expanded',n.classList.contains('open'))"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <nav class="nav" aria-label="Menu utama">${links}<a class="pill" href="${mailto("Sumbang Tulisan")}">Sumbang tulisan</a></nav>
</div></header>
<main>
${body}
</main>
<footer class="foot"><div class="wrap">
  <div><img src="${A}img/logo-light.png" alt="antarala" width="134" height="30"><p>${BIO}</p></div>
  <div><h4>Jelajahi</h4><ul><li><a href="${root}index.html">Beranda</a></li><li><a href="${root}update.html">Update</a></li><li><a href="${root}opini.html">Artikel</a></li><li><a href="${root}tentang.html">Tentang</a></li><li><a href="${root}kontak.html">Kontak</a></li></ul></div>
  <div><h4>Ikuti</h4><ul><li><a href="${IG}" target="_blank" rel="noopener">Instagram</a></li><li><a href="${TT}" target="_blank" rel="noopener">TikTok</a></li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul></div>
  <div class="copy">© 2026 Antarala. Bagian dari FUTURINC.</div>
</div></footer>
</body>
</html>
`;
  }

  const out = {};
  const NEWS = ARTICLES.filter(isB).sort(byDate), MAIN = ARTICLES.filter(a => !isB(a));
  // beranda
  const top3 = MAIN.slice(0, 3);
  const slides = top3.map((a, i) => `<a class="slide feat" href="artikel/${a.slug}.html" aria-roledescription="slide" aria-label="${i + 1} dari ${top3.length}">
    <div class="ph">${media(a, "", "", i === 0)}</div>
    <div>${kicker(a)}<h${i ? 2 : 1} class="h-xl">${a.judul}</h${i ? 2 : 1}><p class="lede">${a.ringkas}</p>
    <div class="by">${bylab(a)} <b>${e(a.penulis)}</b></div><span class="more">Baca artikel</span></div>
  </a>`).join("");
  const dots = top3.map((_, i) => `<button type="button" aria-label="Slide ${i + 1}"></button>`).join("");
  const byCat = k => ARTICLES.filter(x => x.kategori === k).slice(0, 3).map(a => card(a)).join("");
  let home = `
<section class="band"><div class="wrap">
  <div class="slider" aria-roledescription="carousel" aria-label="Artikel terbaru">
    <div class="sl-track">${slides}</div>
    <div class="sl-nav">
      <button type="button" class="sl-btn prev" aria-label="Sebelumnya"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="sl-dots">${dots}</div>
      <button type="button" class="sl-btn next" aria-label="Berikutnya"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
  </div>
</div></section>
<section class="bio band"><div class="wrap">
  <p class="big">${BIO}</p>
  ${follow(true)}
</div></section>
${NEWS.length ? `<section class="band"><div class="wrap">
  <div class="sec-head"><h2 class="h-l">Update terbaru</h2><a href="update.html">Semua update →</a></div>
  <div class="grid3">${NEWS.slice(0, 6).map(a => card(a)).join("")}</div>
</div></section>` : ""}
<section class="band"><div class="wrap">
  <div class="sec-head"><h2 class="h-l">Opini</h2><a href="opini.html#opini">Semua opini →</a></div>
  <div class="grid3">${byCat("Opini")}</div>
</div></section>
<section class="band" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><h2 class="h-l">Feature</h2><a href="opini.html#feature">Semua feature →</a></div>
  <div class="grid3">${byCat("Feature")}</div>
</div></section>
<section class="band cta"><div class="wrap">
  <div><h2 class="h-l">Punya opini yang pengin dibaca banyak orang?</h2>
  <p class="lede">Kirim tulisanmu soal musik, kultur, atau hal-hal yang bikin kamu mikir. Tim Antarala akan membaca setiap kiriman.</p></div>
  <a class="btn solid" href="${mailto("Sumbang Tulisan")}">Sumbang tulisan</a>
</div></section>`;
  home += `<script>{
const sl=document.querySelector('.slider'),tr=sl.querySelector('.sl-track'),n=tr.children.length,ds=[...sl.querySelectorAll('.sl-dots button')];
let i=0,t=null,x0=null,dx=0,moved=false;const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function go(k){i=(k+n)%n;tr.style.transform='translateX('+(-100*i)+'%)';ds.forEach((d,j)=>d.setAttribute('aria-current',j==i));}
function play(){stop();if(!still)t=setInterval(()=>go(i+1),6000);}function stop(){clearInterval(t);}
sl.querySelector('.prev').onclick=()=>{go(i-1);play();};sl.querySelector('.next').onclick=()=>{go(i+1);play();};
ds.forEach((d,j)=>d.onclick=()=>{go(j);play();});
sl.addEventListener('mouseenter',stop);sl.addEventListener('mouseleave',play);
tr.addEventListener('pointerdown',e=>{x0=e.clientX;dx=0;moved=false;tr.classList.add('drag');stop();});
window.addEventListener('pointermove',e=>{if(x0===null)return;dx=e.clientX-x0;if(Math.abs(dx)>6)moved=true;tr.style.transform='translateX(calc('+(-100*i)+'% + '+dx+'px))';});
window.addEventListener('pointerup',()=>{if(x0===null)return;tr.classList.remove('drag');x0=null;if(dx<-50)go(i+1);else if(dx>50)go(i-1);else go(i);play();});
tr.addEventListener('click',e=>{if(moved){e.preventDefault();moved=false;}},true);
tr.addEventListener('dragstart',e=>e.preventDefault());
sl.addEventListener('keydown',e=>{if(e.key=='ArrowLeft'){go(i-1);play();}if(e.key=='ArrowRight'){go(i+1);play();}});
go(0);play();}</script>`;
  out["index.html"] = page("Antarala — musik, kultur, pikiran", BIO, home, "", "index.html", "home", "og-antarala.jpg",
    { "@context": "https://schema.org", "@type": "WebSite", name: "Antarala", alternateName: ["antarala", "Antarala Media"], url: SITE, description: BIO, inLanguage: "id-ID", publisher: ORG });

  // daftar artikel
  const rows = MAIN.concat(NEWS).map(a => `<a class="row" data-k="${e(lab(a).toLowerCase())}" href="artikel/${a.slug}.html"><div class="ph">${media(a, "")}</div>
<div>${kicker(a)}<h2>${a.judul}</h2><p>${a.ringkas}</p><div class="by">Oleh <b>${e(a.penulis)}</b></div></div></a>`).join("");
  out["opini.html"] = page("Artikel — Antarala", "Kumpulan opini dan kabar musik Antarala soal musik, kultur, dan hidup sehari-hari.", `<section class="band"><div class="wrap">
  <div class="sec-head"><h1 class="h-xl">Artikel</h1></div>
  <p class="lede" style="margin:-8px 0 20px">Opini, feature, dan update dari teman-teman Antarala: soal lagu, musisi, dan hidup di sekitarnya.</p>
  <div class="tabs" role="tablist"><a href="#semua" data-f="semua">Semua</a><a href="#opini" data-f="opini">Opini</a><a href="#feature" data-f="feature">Feature</a><a href="#update" data-f="update">Update</a></div>
  <div class="rows">${rows}</div>
<script>{function f(){const k=(location.hash||'#semua').slice(1);document.querySelectorAll('.tabs a').forEach(a=>a.setAttribute('aria-current',a.dataset.f==k));
document.querySelectorAll('.row').forEach(r=>r.hidden=!(k=='semua'||r.dataset.k==k));}addEventListener('hashchange',f);f();}</script>
</div></section>`, "", "opini.html", "opini");

  // berita
  const nrows = NEWS.map(a => `<a class="row" href="artikel/${a.slug}.html"><div class="ph">${media(a, "")}</div>
<div>${kicker(a)}<h2>${a.judul}</h2><p>${a.ringkas}</p><div class="by">Oleh <b>${e(a.penulis)}</b></div></div></a>`).join("");
  out["update.html"] = page("Update Terbaru — Antarala", "Kabar terbaru musik Indonesia, musik internasional, konser, festival, dan kultur pop dari Antarala.", `<section class="band"><div class="wrap">
  <div class="sec-head"><h1 class="h-xl">Update terbaru</h1></div>
  <p class="lede" style="margin:-8px 0 20px">Kabar musik, konser, dan kultur pop yang lagi rame, dirangkum tiap hari sama Redaksi Antarala.</p>
  ${nrows || '<p class="lede">Belum ada update. Cek lagi besok pagi.</p>'}
</div></section>`, "", "update.html", "berita");
  out["berita.html"] = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Update — Antarala</title><link rel="canonical" href="${SITE}update.html"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=update.html"></head><body><a href="update.html">Update terbaru Antarala</a></body></html>`;

  // tentang
  out["tentang.html"] = page("Tentang — Antarala", BIO, `<section class="band"><div class="wrap about">
  <div class="logo-block"><img src="${ast("")}img/logo-light.png" alt="Logo Antarala"></div>
  <div>
    <div class="kicker"><span class="tag">Tentang</span></div>
    <h1 class="h-xl" style="margin:16px 0 18px">${BIO}</h1>
    <p class="lede">Antarala adalah media kecil yang membahas musik, kultur, dan pikiran-pikiran yang lewat di antaranya. Kami menulis kabar terbaru, merangkum rilisan baru, dan memberi ruang buat opini personal dari para penulis dan pendengar.</p>
    <div class="pillars">
      <div><b>Musik</b><span>Rilisan, panggung, dan cerita di balik lagu.</span></div>
      <div><b>Kultur</b><span>Hal-hal yang sedang ramai dan kenapa itu penting.</span></div>
      <div><b>Pikiran</b><span>Opini personal yang jujur dan berimbang.</span></div>
      <div><b>Update</b><span>Kabar singkat yang menarik buat diikuti.</span></div>
    </div>
    <p style="margin-top:28px">Punya opini soal lagu, musisi, atau hidup sehari-hari? <a href="${mailto("Sumbang Tulisan")}">Sumbang tulisanmu</a>.</p>
    ${follow()}
  </div>
</div></section>`, "", "tentang.html", "tentang");

  // kontak
  const opt = [["Kerja sama & iklan", "Kolaborasi konten, promosi rilisan, atau kampanye brand bersama Antarala.", "Inquiry Kerja Sama"],
    ["Kirim rilis pers", "Musisi, label, atau penyelenggara acara yang ingin kabarnya diliput.", "Rilis Pers"],
    ["Sumbang tulisan", "Kirim opini atau tulisanmu. Lampirkan naskah, foto, dan sumber fotonya.", "Sumbang Tulisan"],
    ["Pertanyaan umum", "Koreksi, masukan, atau hal lain yang ingin kamu sampaikan.", "Pertanyaan"]];
  out["kontak.html"] = page("Kontak — Antarala", "Hubungi Antarala untuk kerja sama, rilis pers, sumbang tulisan, atau pertanyaan.", `<section class="band"><div class="wrap">
  <div class="sec-head"><h1 class="h-xl">Kontak</h1></div>
  <p class="lede" style="margin:-8px 0 28px">Semua pertanyaan dan kerja sama bisa dikirim ke <a href="mailto:${EMAIL}"><b>${EMAIL}</b></a>. Pilih topiknya supaya subjek email terisi otomatis.</p>
  <div class="cgrid">${opt.map(([t, d, s]) => `<a class="ccard" href="${mailto(s)}"><h2 class="h-m">${t}</h2><p>${d}</p><span class="more">Kirim email →</span></a>`).join("")}</div>
  <div style="margin-top:36px">${follow()}</div>
</div></section>`, "", "kontak.html", "kontak");

  // artikel
  for (const a of ARTICLES) {
    const parts = (a.isi || []).map(b => b[0] === "p" ? `<p>${b[1]}</p>` : b[0] === "h" ? `<h2>${b[1]}</h2>` : `<blockquote>${b[1]}<cite>${b[2] || ""}</cite></blockquote>`).join("");
    const refs = (a.referensi || []).length ? `<div class="refs"><h3>Referensi</h3><ol>${a.referensi.map(r => `<li>${r[0]}${r[1] ? ` — <a href="${e(r[1])}" target="_blank" rel="noopener">${e(r[1])}</a>` : ""}</li>`).join("")}</ol></div>` : "";
    const ytId = (String(a.yt || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
    const yt = ytId ? `<figure class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${ytId}" title="Video YouTube" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><figcaption>Video resmi via YouTube</figcaption></figure>` : "";
    const ig = a.ig ? `<p class="iglink"><a href="${e(a.ig)}" target="_blank" rel="noopener">Lihat postingan aslinya di Instagram →</a></p>` : "";
    const others = (isB(a) ? NEWS : MAIN).filter(x => x !== a).slice(0, 3);
    const path = `artikel/${a.slug}.html`;
    const ld = { "@context": "https://schema.org", "@type": isB(a) ? "NewsArticle" : "Article", headline: a.judul, description: a.ringkas, image: [SITE + "assets/img/" + a.cover],
      author: { "@type": "Person", name: a.penulis }, publisher: ORG, inLanguage: "id-ID", mainEntityOfPage: SITE + path, articleSection: lab(a), primaryImageOfPage: SITE + "assets/img/" + a.cover };
    if (a.tanggal) ld.datePublished = a.tanggal; if (a.diperbarui) ld.dateModified = a.diperbarui;
    const body = `<article>
<div class="wrap"><header class="art-head">${kicker(a)}<h1>${a.judul}</h1><p class="dek">${a.ringkas}</p><div class="by">${bylab(a)} <b>${e(a.penulis)}</b>${a.tanggal ? " · " + tgl(a.tanggal) : ""}</div></header>
<figure class="hero">${media(a, "../", "", true)}<figcaption>${/^ilustrasi/i.test(a.foto || "") ? e(a.foto) : "Foto: " + e(a.foto)}</figcaption></figure>
<div class="body">
${parts}
${yt}
${refs}
${ig}
<div class="share"><span>Bagikan</span>
<a class="btn" id="wa" href="#" target="_blank" rel="noopener">WhatsApp</a>
<a class="btn" id="x" href="#" target="_blank" rel="noopener">X</a>
<button class="btn" id="cp" type="button">Salin tautan</button><span class="toast" id="tst" aria-live="polite"></span></div>
</div></div>
</article>
<section class="band" style="padding-top:0"><div class="wrap">
<div class="sec-head"><h2 class="h-l">Baca juga</h2><a href="../${isB(a) ? "update" : "opini"}.html">${isB(a) ? "Semua update" : "Semua artikel"} →</a></div>
<div class="grid3">${others.map(o => card(o, "../")).join("")}</div>
</div></section>
<script>{const u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);
document.getElementById('wa').href='https://wa.me/?text='+t+'%20'+u;
document.getElementById('x').href='https://twitter.com/intent/tweet?text='+t+'&url='+u;
document.getElementById('cp').addEventListener('click',()=>{navigator.clipboard.writeText(location.href).then(()=>{tst.textContent='Tautan disalin'},()=>{tst.textContent=location.href})});}</script>`;
    out[path] = page(a.judul + " — Antarala", stripTags(a.ringkas), body, "../", path, "opini", a.cover, ld, "article");
  }

  // sitemap, robots, feed
  const latest = ARTICLES.map(a => a.diperbarui || a.tanggal || "").sort().pop() || new Date().toISOString().slice(0, 10);
  const urls = ["", "update.html", "opini.html", "tentang.html", "kontak.html"].map(u => [u, latest]).concat(ARTICLES.map(a => [`artikel/${a.slug}.html`, a.diperbarui || latest]));
  out["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod></url>\n`).join("")}</urlset>\n`;
  out["site.webmanifest"] = JSON.stringify({ name: "Antarala", short_name: "Antarala", start_url: "/", display: "standalone", background_color: "#f4f1ea", theme_color: "#1e1e1e",
    icons: [{ src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" }] }, null, 1);
  out["robots.txt"] = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`;
  const rfc = d => new Date((d || latest) + "T09:00:00+07:00").toUTCString();
  out["feed.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>Antarala</title><link>${SITE}</link><description>${e(BIO)}</description><language>id</language>
  <atom:link href="${SITE}feed.xml" rel="self" type="application/rss+xml"/>
${ARTICLES.slice().sort(byDate).slice(0, 50).map(a => `  <item><title>${e(stripTags(a.judul))}</title><link>${SITE}artikel/${a.slug}.html</link><guid>${SITE}artikel/${a.slug}.html</guid>
    <description>${e(stripTags(a.ringkas))}</description><category>${e(lab(a))}</category><author>${EMAIL} (${e(a.penulis)})</author><pubDate>${rfc(a.tanggal)}</pubDate></item>\n`).join("")}</channel></rss>
`;
  return out;
}
function stripTags(s) { return String(s || "").replace(/<[^>]+>/g, ""); }
})();
