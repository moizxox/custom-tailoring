#!/usr/bin/env bash
# Push Prisma schema and create the required owner admin on a production database.
#
# Usage:
#   DATABASE_URL="postgresql://..." ./scripts/setup-production-db.sh
#
# Or with Neon connection string from Vercel Production env:
#   DATABASE_URL="$(pbpaste)" ./scripts/setup-production-db.sh
#
# Creates / upserts: mainmoiz899@gmail.com (username: moizxox, password: Admin@123)
# Change the password immediately after first login.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: Set DATABASE_URL to your production Postgres URL first."
  echo "  DATABASE_URL=\"postgresql://...\" ./scripts/setup-production-db.sh"
  exit 1
fi

# Refuse accidental use of localhost
if [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
  echo "ERROR: DATABASE_URL looks local. Use the production Neon URL."
  exit 1
fi

echo "→ prisma db push (production)…"
pnpm exec prisma db push

echo "→ create owner admin…"
pnpm exec tsx prisma/create-admin.ts

echo ""
echo "Done. Admin login:"
echo "  Email:    mainmoiz899@gmail.com"
echo "  Username: moizxox"
echo "  Password: Admin@123  (change after first login)"
echo ""
echo "IMPORTANT — Vercel Production DATABASE_URL must be THIS exact Neon URL"
echo "(use the pooled -pooler host + ?sslmode=require&connect_timeout=15)."
echo "Then Redeploy on Vercel. Verify with:"
echo "  curl -s https://custom-tailoring.vercel.app/api/kontakt/status"
echo "Expect: {\"ok\":true,\"contactForm\":\"ready\",...}"
echo ""
echo "Also set AUTH_SECRET, NEXTAUTH_URL=https://custom-tailoring.vercel.app,"
echo "NEXT_PUBLIC_APP_URL, Cloudinary, and SMTP/Resend for emails."
