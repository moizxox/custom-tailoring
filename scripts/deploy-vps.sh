#!/usr/bin/env bash
# Deploy this repo to the Hostinger VPS (lani-server) and restart PM2.
#
# Usage:
#   pnpm deploy
#   npm run deploy
#   ./scripts/deploy-vps.sh
#
# Optional:
#   DEPLOY_HOST=lani-server DEPLOY_PATH=/var/www/kostuemschneiderei ./scripts/deploy-vps.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${DEPLOY_HOST:-lani-server}"
REMOTE="${DEPLOY_PATH:-/var/www/kostuemschneiderei}"

echo "→ Deploying to ${HOST}:${REMOTE}"

rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .deploy \
  --exclude .env \
  --exclude .env.local \
  --exclude .env.vercel.production \
  --exclude 'wunschkleid-attachments' \
  --exclude '_reference' \
  --exclude 'lani-2' \
  --exclude 'new-chat-23' \
  --exclude 'Sewing_outline' \
  --exclude '.vercel' \
  --exclude '.pnpm-store' \
  --exclude 'kustom.zip' \
  --exclude '.DS_Store' \
  -e ssh \
  "$ROOT/" \
  "${HOST}:${REMOTE}/"

echo "→ Install, build, restart on VPS"
ssh "$HOST" "bash -s" <<REMOTE
set -euo pipefail
cd "${REMOTE}"
corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@8.15.9 --activate
pnpm install --frozen-lockfile

# Ensure business mailbox for contact notifications / From (do not overwrite SMTP password).
BUSINESS_EMAIL="info@kostuem-schneiderei.ch"
if [ -f .env ]; then
  for KEY in CONTACT_NOTIFICATION_EMAIL NODEMAILER_FROM RESEND_FROM_EMAIL; do
    if grep -q "^\${KEY}=" .env; then
      sed -i "s|^\${KEY}=.*|\${KEY}=\${BUSINESS_EMAIL}|" .env
    else
      echo "\${KEY}=\${BUSINESS_EMAIL}" >> .env
    fi
  done
fi

set -a
# shellcheck disable=SC1091
source .env
set +a
pnpm exec prisma generate
pnpm exec prisma db push --skip-generate
pnpm build
pm2 restart kostuemschneiderei --update-env || pm2 start ecosystem.config.cjs
pm2 save
sleep 3
curl -s -o /dev/null -w "local_home:%{http_code}\\n" http://127.0.0.1:3000/ || true
curl -s -o /dev/null -w "katalog:%{http_code}\\n" http://127.0.0.1:3000/katalog || true
curl -s -o /dev/null -w "shop:%{http_code}\\n" http://127.0.0.1:3000/shop || true
curl -s -o /dev/null -w "kontakt:%{http_code}\\n" http://127.0.0.1:3000/kontakt || true
curl -s -o /dev/null -w "portal:%{http_code}\\n" http://127.0.0.1:3000/kundenbereich/login || true
curl -s http://127.0.0.1:3000/api/termin >/dev/null 2>&1 || true
curl -s http://127.0.0.1:3000/api/kontakt/status || true
echo
REMOTE

echo "✓ Deploy finished → https://kostuemschneiderei.ch"
