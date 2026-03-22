#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────
#  DecisionLab — Production Deploy Script
#  Usage:  ./deploy.sh [init|deploy|ssl|logs|down]
# ──────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"

cd "$APP_DIR"

# Load .env
if [[ ! -f .env ]]; then
  echo "✗ Missing app/.env — copy .env.example and fill in values"
  exit 1
fi
set -a; source .env; set +a

usage() {
  echo "Usage: $0 {init|deploy|ssl|logs|down}"
  echo ""
  echo "  init    — First-time setup: get SSL certs, start everything"
  echo "  deploy  — Pull latest code, rebuild, restart"
  echo "  ssl     — Renew SSL certificates"
  echo "  logs    — Tail logs from all services"
  echo "  down    — Stop all services"
  exit 1
}

# ── SSL: obtain initial certificates ─────────────────
cmd_ssl_init() {
  local domain="${DOMAIN:?Set DOMAIN in .env}"
  local negsim_domain="${NEGSIM_DOMAIN:?Set NEGSIM_DOMAIN in .env}"
  local email="${CERTBOT_EMAIL:?Set CERTBOT_EMAIL in .env}"

  echo "→ Obtaining SSL certificates for $domain, $negsim_domain ..."

  # Start nginx with a temporary self-signed cert for the ACME challenge
  mkdir -p nginx/ssl-temp
  openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
    -keyout nginx/ssl-temp/privkey.pem \
    -out nginx/ssl-temp/fullchain.pem \
    -subj "/CN=localhost" 2>/dev/null

  # Temporarily swap nginx config to HTTP-only for cert issuance
  cat > nginx/init.conf << 'INITCONF'
server {
    listen 80;
    server_name _;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'waiting for SSL'; }
}
INITCONF

  docker compose run --rm \
    -v "$APP_DIR/nginx/init.conf:/etc/nginx/conf.d/default.conf:ro" \
    nginx true 2>/dev/null || true

  # Start just nginx for the challenge
  docker compose up -d nginx

  docker compose run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$email" --agree-tos --no-eff-email \
    -d "$domain" -d "www.$domain" -d "$negsim_domain"

  # Clean up temp config
  rm -rf nginx/ssl-temp nginx/init.conf

  echo "✓ SSL certificates obtained"
}

# ── SSL: renew ────────────────────────────────────────
cmd_ssl() {
  echo "→ Renewing SSL certificates..."
  docker compose run --rm certbot renew --webroot -w /var/www/certbot --quiet
  docker compose exec nginx nginx -s reload
  echo "✓ SSL certificates renewed"
}

# ── First-time init ──────────────────────────────────
cmd_init() {
  echo "═══════════════════════════════════════"
  echo "  DecisionLab — First-Time Setup"
  echo "═══════════════════════════════════════"

  # Pull submodules
  cd "$SCRIPT_DIR"
  git submodule update --init --recursive
  cd "$APP_DIR"

  # Get SSL certs
  cmd_ssl_init

  # Build and start everything
  docker compose up -d --build

  # Run migrations and seed
  echo "→ Running database migrations..."
  docker compose exec app npx prisma migrate deploy
  echo "→ Seeding database..."
  docker compose exec app npx tsx prisma/seed.ts

  echo ""
  echo "✓ DecisionLab is running!"
  echo "  → https://${DOMAIN}"
  echo "  → https://${NEGSIM_DOMAIN}"
}

# ── Deploy (update) ──────────────────────────────────
cmd_deploy() {
  echo "→ Pulling latest code..."
  cd "$SCRIPT_DIR"
  git pull
  git submodule update --recursive
  cd "$APP_DIR"

  echo "→ Rebuilding containers..."
  docker compose build

  echo "→ Restarting services..."
  docker compose up -d

  echo "→ Running migrations..."
  docker compose exec app npx prisma migrate deploy

  echo "✓ Deploy complete"
}

# ── Logs ──────────────────────────────────────────────
cmd_logs() {
  docker compose logs -f --tail=100
}

# ── Stop ──────────────────────────────────────────────
cmd_down() {
  docker compose down
  echo "✓ All services stopped"
}

# ── Main ──────────────────────────────────────────────
case "${1:-}" in
  init)   cmd_init   ;;
  deploy) cmd_deploy ;;
  ssl)    cmd_ssl    ;;
  logs)   cmd_logs   ;;
  down)   cmd_down   ;;
  *)      usage      ;;
esac
