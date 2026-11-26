# Antarala — antarala.futurinc.co.id

Website statis Antarala. Isinya dibangun dari `content/` jadi HTML siap tayang di `public/`.

- `content/artikel.json` — artikel Opini & Feature (urutan = urutan di website; 3 teratas masuk slider beranda)
- `content/berita/<slug>.json` — satu file per berita (urut otomatis berdasarkan tanggal + jam)
- `static/` — CSS, logo, favicon, dan foto cover (`static/assets/img/cover-<slug>.jpg`)
- `tools/build.mjs` — build: `node tools/build.mjs` (butuh Node 18+ dan Python 3 + Pillow untuk cover otomatis)
- `public/` — hasil build, ini yang disalin ke cPanel
- `deploy.sh` — dijalankan Cron Job cPanel tiap 15 menit: `git pull` lalu salin `public/` ke folder subdomain

Berita harian ditulis otomatis oleh Claude tiap pagi, di-build, lalu di-push ke repo ini.
