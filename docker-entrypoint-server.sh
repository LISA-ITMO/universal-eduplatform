#!/usr/bin/env bash
set -euo pipefail

echo "Running prisma migrations (deploy) if DATABASE_URL is set..."
if [ -n "${DATABASE_URL:-}" ]; then
  # run migrations (requires prisma available in node_modules from builder)
  echo "DATABASE_URL present, running: npx prisma migrate deploy"
  npx prisma migrate deploy || echo "prisma migrate deploy exit code $?";
else
  echo "DATABASE_URL not set, skipping migrations"
fi

echo "Starting server..."
node dist/main.js
