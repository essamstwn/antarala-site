#!/bin/sh
# Dijalankan Cron Job cPanel tiap 15 menit: ambil versi terbaru dari GitHub,
# lalu salin isi folder public/ ke folder subdomain.
# Kalau ada halaman baru/berubah, kabari Bing & mesin pencari lain lewat IndexNow.
export PATH="$PATH:/usr/local/cpanel/3rdparty/bin:/usr/local/bin:/usr/bin"
REPO="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/antarala.futurinc.co.id"
INDEXNOW_KEY="cdd22c879dacc0174aeccba3be9df7a6"
cd "$REPO" || exit 1
OLD="$(git rev-parse HEAD)"
git pull -q --ff-only origin main || exit 1
cp -R "$REPO/public/." "$TARGET/"
NEW="$(git rev-parse HEAD)"
[ "$OLD" = "$NEW" ] && exit 0
# IndexNow: kirim URL artikel & halaman daftar yang berubah
SITE="$(sed -n 's#^Sitemap: \(https://[^/]*\)/sitemap.xml$#\1#p' public/robots.txt | head -n 1)"
HOST="${SITE#https://}"
URLS="$(git diff --name-only "$OLD" "$NEW" -- public | grep -E '^public/(artikel/.*|index|update|opini|feature|topik/.*|tag/.*)\.html$' | sed "s#^public/#$SITE/#; s#/index\.html$#/#" | head -n 200)"
[ -z "$URLS" ] && exit 0
LIST="$(printf '%s\n' $URLS | sed 's/.*/"&"/' | paste -sd, -)"
command -v curl >/dev/null 2>&1 && curl -s -m 20 -o /dev/null -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"$HOST\",\"key\":\"$INDEXNOW_KEY\",\"keyLocation\":\"$SITE/$INDEXNOW_KEY.txt\",\"urlList\":[$LIST]}" \
  https://api.indexnow.org/indexnow
exit 0
