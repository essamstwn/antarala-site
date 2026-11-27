# Antarala — antarala.futurinc.co.id

Website statis Antarala. Isinya dibangun dari `content/` jadi HTML siap tayang di `public/`.

- `content/artikel.json` — artikel Opini & Feature (urutan = urutan di website; 3 teratas jadi sorotan beranda)
- `content/berita/<slug>.json` — satu file per update/berita (urut otomatis berdasarkan tanggal + jam)
- `static/` — CSS, logo, favicon, foto cover (`static/assets/img/cover-<slug>.jpg`), `.htaccess`, `brief.html`, `kol.html`
- `tools/gen.js` — generator halaman (dipakai juga oleh Antarala Editor; kalau diubah, salin juga ke file `gen.js` di artifact editor)
- `tools/build.mjs` — build: `node tools/build.mjs` (butuh Node 18+ dan Python 3 + Pillow untuk cover otomatis & WebP)
- `public/` — hasil build, ini yang disalin ke cPanel
- `deploy.sh` — dijalankan Cron Job cPanel tiap 15 menit: `git pull` lalu salin `public/` ke folder subdomain

## Field konten (SEO)
Selain field lama (slug, judul, ringkas, penulis, kategori, isi, referensi, dst.):
- `topik`: `musik` | `konser` | `film` | `kultur` (default musik) → halaman `topik/<topik>.html`
- `tag`: teks dipisah koma, mis. `"Hindia, Lafa Pratomo, Rilisan Baru"` → halaman `tag/<slug>.html`. Tag yang punya ≥2 tulisan diindeks Google dan otomatis ditautkan dari isi artikel.
- `judulSeo`: judul pendek ±60 karakter untuk Google (opsional)
- `poin`: array 2–3 kalimat "Intinya" di atas artikel (opsional; bagus untuk Google & asisten AI)

## Halaman yang dibuat otomatis
Beranda, `update.html`, `opini.html`, `feature.html` (12 per halaman), `topik/*`, `tag/*`, `penulis/*`, artikel, `tentang.html`, `pedoman.html`, `kontak.html`, `cari.html` + `search.json`, `404.html`, `sitemap.xml`, `news-sitemap.xml`, `feed.xml`, `robots.txt`, `llms.txt`.

## Pindah ke antarala.co.id
Setelah https://antarala.co.id aktif (addon domain + SSL di cPanel): ganti `SITE` di `tools/gen.js` (dan gen.js di editor), aktifkan 2 baris redirect di `static/.htaccess`, build, push. Lalu tambahkan property baru di Search Console dan submit sitemap.

Berita harian ditulis otomatis oleh Claude tiap pagi, di-build, lalu di-push ke repo ini.
