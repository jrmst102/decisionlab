#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy 2>&1 || echo "Migration warning (non-fatal)"

echo "Running database seed..."
npx tsx prisma/seed.ts 2>&1 || echo "Seed warning (non-fatal)"

echo "Starting application..."
exec node server.js
