#!/bin/sh
# Do not use `set -e` — DB setup failures must not prevent the web server from starting.

export HOME=/tmp
export NPM_CONFIG_CACHE=/tmp/.npm-cache
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
  if prisma db push --skip-generate; then
    echo "[entrypoint] Database schema OK"
  else
    echo "[entrypoint] WARN: prisma db push failed — starting app anyway (check DATABASE_URL and /app/data volume)"
  fi

  if [ -f /app/scripts/docker-seed-admin.mjs ]; then
    echo "[entrypoint] Ensuring admin user exists..."
    if node /app/scripts/docker-seed-admin.mjs; then
      echo "[entrypoint] Admin seed OK"
    else
      echo "[entrypoint] WARN: admin seed failed — login may not work until fixed"
    fi
  else
    echo "[entrypoint] WARN: docker-seed-admin.mjs missing — rebuild image from latest main"
  fi

  if [ -f /app/scripts/docker-seed-blogs.mjs ] && [ -f /app/prisma/seed-data/blog-posts.json ]; then
    echo "[entrypoint] Ensuring blog articles exist..."
    if node /app/scripts/docker-seed-blogs.mjs; then
      echo "[entrypoint] Blog seed OK"
    else
      echo "[entrypoint] WARN: blog seed failed — blog may use built-in fallback content"
    fi
  fi
fi

echo "[entrypoint] Starting Next.js on port ${PORT:-3000}..."
exec node server.js
