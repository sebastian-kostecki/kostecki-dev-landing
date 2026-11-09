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
  docker rm -f "$NAME" >/dev/null 2>&1 || true
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
  if curl -s -o /dev/null "$BASE/"; then
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
  got="$(curl -s -o /dev/null -w '%{http_code}' "$BASE$path")"
  if [ "$got" = "$want" ]; then
    echo "ok   $path -> $got"
  else
    fail "$path: status $got, oczekiwano $want"
  fi
}

for p in / /projects /projects/ /cv /sitemap.xml /llms.txt /favicon.svg; do
  check_status "$p" 200
done
check_status /nie-ma 404

# /projects ma odpowiadać 200 bez przekierowania (curl bez -L); brak nagłówka Location
if curl -sI "$BASE/projects" | grep -qi '^location:'; then
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
  resp="$(curl -sI "$BASE$p")"
  for h in "${HEADERS[@]}"; do
    if printf '%s\n' "$resp" | grep -qi "^${h}:"; then
      echo "ok   $p  $h"
    else
      fail "$p: brak nagłówka $h"
    fi
  done
  if [ "$p" = "/" ]; then
    csp="$(printf '%s\n' "$resp" | grep -i '^Content-Security-Policy:' || true)"
    for d in "default-src 'self'" "connect-src 'self'"; do
      case "$csp" in
        *"$d"*) echo "ok   $p  CSP zawiera $d" ;;
        *) fail "$p: CSP nie zawiera $d" ;;
      esac
    done
  fi
done

if [ "$FAILS" -gt 0 ]; then
  echo "check-nginx: $FAILS niepowodzeń" >&2
  exit 1
fi
echo "check-nginx: wszystko przeszło"
