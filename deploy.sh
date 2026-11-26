#!/bin/sh
# Dijalankan Cron Job cPanel tiap jam: ambil versi terbaru dari GitHub,
# lalu salin isi folder public/ ke folder subdomain.
REPO="$HOME/antarala-site"
TARGET="$HOME/antarala.futurinc.co.id"
cd "$REPO" || exit 1
git pull -q --ff-only origin main || exit 1
cp -R "$REPO/public/." "$TARGET/"
