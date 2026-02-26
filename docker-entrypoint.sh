#!/bin/sh
set -e

echo "Running Prisma db push..."
./node_modules/.bin/prisma db push --accept-data-loss || echo "Prisma db push finished with warnings, continuing..."

echo "Starting application..."
exec "$@"
