#!/usr/bin/env bash
# Restore the source Neon dump into the client's Neon project, then sync schema + admin.
#
# Usage:
#   CLIENT_DATABASE_URL="postgresql://…-pooler…/neondb?sslmode=require" \
#     ./scripts/migrate-neon-to-client.sh
#
# Optional:
#   DUMP_FILE=.deploy/neon-source.dump   # custom format (preferred)
#   SQL_FILE=.deploy/neon-source.sql     # fallback plain SQL

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${CLIENT_DATABASE_URL:-}" ]]; then
  echo "ERROR: Set CLIENT_DATABASE_URL to the client's pooled Neon URL."
  exit 1
fi

if [[ "$CLIENT_DATABASE_URL" == *"localhost"* ]] || [[ "$CLIENT_DATABASE_URL" == *"127.0.0.1"* ]]; then
  echo "ERROR: CLIENT_DATABASE_URL looks local."
  exit 1
fi

DUMP_FILE="${DUMP_FILE:-$ROOT/.deploy/neon-source.dump}"
SQL_FILE="${SQL_FILE:-$ROOT/.deploy/neon-source.sql}"

echo "→ Target host: $(python3 -c "from urllib.parse import urlparse; print(urlparse('$CLIENT_DATABASE_URL').hostname)")"

# Prefer custom-format restore; fall back to psql for plain SQL
if [[ -f "$DUMP_FILE" ]]; then
  echo "→ pg_restore from $DUMP_FILE"
  pg_restore --no-owner --no-acl --clean --if-exists -d "$CLIENT_DATABASE_URL" "$DUMP_FILE" \
    || echo "WARN: pg_restore reported errors (often OK on empty Neon — continuing)"
elif [[ -f "$SQL_FILE" ]]; then
  echo "→ psql from $SQL_FILE"
  psql "$CLIENT_DATABASE_URL" -v ON_ERROR_STOP=0 -f "$SQL_FILE"
else
  echo "ERROR: No dump at $DUMP_FILE or $SQL_FILE — run Phase 0 dump first."
  exit 1
fi

echo "→ prisma db push (client)"
DATABASE_URL="$CLIENT_DATABASE_URL" pnpm exec prisma db push

echo "→ ensure admin exists"
DATABASE_URL="$CLIENT_DATABASE_URL" pnpm exec tsx prisma/create-admin.ts

echo "→ spot-check counts"
DATABASE_URL="$CLIENT_DATABASE_URL" pnpm exec tsx -e '
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const [admins, pages, products, media, customers, projects, submissions] = await Promise.all([
  p.admin.count(),
  p.pageContent.count(),
  p.product.count(),
  p.mediaFile.count(),
  p.customer.count(),
  p.project.count(),
  p.contactSubmission.count(),
]);
console.log({ admins, pages, products, media, customers, projects, submissions });
await p.$disconnect();
'

echo ""
echo "Done. Point VPS .env DATABASE_URL at CLIENT_DATABASE_URL and restart PM2."
