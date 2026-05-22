#!/bin/sh
set -e

export HOME=/app
export NPM_CONFIG_CACHE=/app/.npm-cache
mkdir -p "$HOME" "$NPM_CONFIG_CACHE"

case "${DATABASE_URL:-}" in
  file:*)
    path="${DATABASE_URL#file:}"
    path="${path%%\?*}"
    case "$path" in
      /*) full="$path" ;;
      *) full="/app/$path" ;;
    esac
    dir=$(dirname "$full")
    mkdir -p "$dir"
    ;;
esac

if [ "${RUN_DB_SETUP:-1}" != "0" ]; then
  echo "[entrypoint] Applying database schema..."
  prisma db push --skip-generate || {
    echo "[entrypoint] prisma db push failed"
    exit 1
  }

  if [ -f /app/scripts/docker-seed-admin.mjs ]; then
    echo "[entrypoint] Ensuring admin user exists..."
    node /app/scripts/docker-seed-admin.mjs || echo "[entrypoint] WARN: admin seed failed (check logs)"
  else
    echo "[entrypoint] WARN: /app/scripts/docker-seed-admin.mjs missing — redeploy latest image"
  fi
fi

exec node server.js
