#!/bin/sh
set -e

echo "Running Prisma Migration........"
npx prisma migrate deploy

echo "Starting App......"
node dist/main.js