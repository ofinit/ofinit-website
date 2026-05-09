#!/bin/sh
set -e
# Ensure parent directory exists for SQLite file URLs (Coolify / Docker volumes).
# Use file paths under /app (e.g. file:/app/data/app.db) so the nextjs user can write.
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
exec node server.js
