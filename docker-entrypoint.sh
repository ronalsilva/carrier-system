#!/bin/sh
set -e

echo "Running Prisma db push..."
npx prisma db push --skip-generate --accept-data-loss || echo "Prisma db push finished with warnings, continuing..."

echo "Starting application..."
exec "$@"
