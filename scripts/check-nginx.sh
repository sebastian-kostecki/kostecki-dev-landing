#!/usr/bin/env bash
# Sprawdza zbudowane dist/ z docker/nginx.conf na nginx:alpine:
# nginx -t, statusy HTTP i nagłówki bezpieczeństwa.
# Użycie: pnpm build && pnpm check:nginx   (port: CHECK_NGINX_PORT, domyślnie 8080)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${CHECK_NGINX_PORT:-8080}"
NAME="check-nginx-$$"
BASE="http://127.0.0.1:${PORT}"

if [ ! -f "$ROOT/dist/index.html" ]; then
  echo "BŁĄD: brak dist/index.html — uruchom najpierw: pnpm build" >&2
  exit 1
fi

cleanup() {
  if ! docker rm -f "$NAME" >/dev/null; then
    echo "UWAGA: nie udało się usunąć kontenera $NAME — usuń go ręcznie (docker rm -f $NAME)" >&2
  fi
}
trap cleanup EXIT

FAILS=0
fail() {
  echo "FAIL: $*" >&2
  FAILS=$((FAILS + 1))
}

docker run -d --name "$NAME" -p "127.0.0.1:${PORT}:80" \
  -v "$ROOT/dist:/usr/share/nginx/html:ro" \
  -v "$ROOT/docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:alpine >/dev/null

if docker exec "$NAME" nginx -t >/dev/null 2>&1; then
  echo "ok   nginx -t"
else
  fail "nginx -t nie przeszło:"
  docker exec "$NAME" nginx -t >&2 || true
fi

ready=0
for _ in $(seq 1 30); do
  if curl -sS --max-time 5 -o /dev/null "$BASE/" 2>/dev/null; then
    ready=1
    break
  fi
  sleep 0.5
done
if [ "$ready" -ne 1 ]; then
  echo "BŁĄD: kontener nie odpowiada na $BASE po 15 s; logi:" >&2
  docker logs "$NAME" >&2 || true
  exit 1
fi

check_status() {
  local path="$1" want="$2" got
  if ! got="$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "$BASE$path")"; then
    fail "$path: curl nie połączył się z $BASE$path"
    return
  fi
  if [ "$got" = "$want" ]; then
    echo "ok   $path -> $got"
  else
    fail "$path: status $got, oczekiwano $want"
  fi
}

# /cv jest ukryte (cv.href puste w src/content); po opublikowaniu dopisz je tutaj.
for p in / /projects /projects/ /skills /contact /sitemap.xml /llms.txt /favicon.svg; do
  check_status "$p" 200
done
check_status /nie-ma 404

# 404 ma zwracać prerenderowane 404.html (widok „nie znaleziono”), a nie domyślną stronę nginx
if ! body404="$(curl -sS --max-time 5 "$BASE/nie-ma")"; then
  fail "/nie-ma: curl nie pobrał treści"
elif printf '%s\n' "$body404" | grep -q '<title>Nie znaleziono'; then
  echo "ok   /nie-ma  treść to prerenderowane 404.html"
else
  fail "/nie-ma: treść 404 nie jest prerenderowanym 404.html (brak <title>Nie znaleziono)"
fi

# /projects ma odpowiadać 200 bez przekierowania (curl bez -L); brak nagłówka Location
if ! projects_resp="$(curl -sSI --max-time 5 "$BASE/projects")"; then
  fail "/projects: curl nie pobrał nagłówków"
elif printf '%s\n' "$projects_resp" | grep -qi '^location:'; then
  fail "/projects: odpowiedź zawiera przekierowanie (Location)"
fi

HEADERS=(
  Strict-Transport-Security
  X-Content-Type-Options
  X-Frame-Options
  Referrer-Policy
  Permissions-Policy
  Content-Security-Policy
)

for p in / /projects /nie-ma /favicon.svg; do
  if ! resp="$(curl -sSI --max-time 5 "$BASE$p")"; then
    fail "$p: curl nie pobrał nagłówków"
    continue
  fi
  for h in "${HEADERS[@]}"; do
    if printf '%s\n' "$resp" | grep -qi "^${h}:"; then
      echo "ok   $p  $h"
    else
      fail "$p: brak nagłówka $h"
    fi
  done
  # wartości, nie tylko obecność: osłabienie nagłówka ma czerwienić skrypt
  expect_value() {
    local header="$1" want="$2" line
    line="$(printf '%s\n' "$resp" | grep -i "^${header}:" || true)"
    case "$line" in
      *"$want"*) echo "ok   $p  $header zawiera $want" ;;
      *) fail "$p: $header nie zawiera $want (jest: ${line:-brak})" ;;
    esac
  }
  expect_value X-Frame-Options "DENY"
  expect_value X-Content-Type-Options "nosniff"
  expect_value Referrer-Policy "strict-origin-when-cross-origin"
  # dyrektywy CSP porównujemy w całości (script-src 'self' 'unsafe-inline' ma nie przejść)
  csp_directives="$(printf '%s\n' "$resp" | grep -i '^Content-Security-Policy:' | sed 's/^[^:]*: *//' | tr -d '\r' | tr ';' '\n' | sed 's/^ *//; s/ *$//' || true)"
  for d in "default-src 'self'" "script-src 'self'" "connect-src 'self'" "object-src 'none'" "frame-ancestors 'none'"; do
    if printf '%s\n' "$csp_directives" | grep -qxF "$d"; then
      echo "ok   $p  CSP: $d"
    else
      fail "$p: CSP nie ma dokładnie dyrektywy $d"
    fi
  done
done

if [ "$FAILS" -gt 0 ]; then
  echo "check-nginx: $FAILS niepowodzeń" >&2
  exit 1
fi
echo "check-nginx: wszystko przeszło"
