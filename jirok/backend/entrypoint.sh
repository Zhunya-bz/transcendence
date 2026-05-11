#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Running Prisma Migration........"
npx prisma migrate deploy

echo "Starting App......"
node dist/main.js