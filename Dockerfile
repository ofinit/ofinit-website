# Next.js 16 + Prisma — optimized for Coolify / Docker (standalone output).
# Coolify: use Dockerfile build pack, expose port 3000 (or map Coolify PORT → 3000).
#
# Required env (set in Coolify):
#   DATABASE_URL — e.g. file:/app/data/app.db  (mount a persistent volume on /app/data)
#   Optional: NODE_ENV=production (set by image)
#
# After first deploy, apply the schema (run once or from Coolify “Execute Command”):
#   npx prisma db push
# Seeding (optional): npx prisma db seed
#
# Uploads: persist public/uploads by mounting the same volume path or bind-mount ./public/uploads.

ARG NODE_VERSION=22-bookworm-slim

FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY package.json package-lock.json .npmrc* ./
RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

RUN mkdir -p /app/data /app/public/uploads \
  && chown -R nextjs:nodejs /app/data /app/public/uploads

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma Client + engines (not fully traced into standalone)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Schema + CLI: run `npx prisma db push` once from a shell (or Coolify one-off) after first deploy.
COPY --from=builder /app/prisma ./prisma
USER root
RUN cd /app && npm install prisma@6.19.0 --omit=dev --no-save \
  && chown -R nextjs:nodejs /app/prisma /app/node_modules/prisma \
  && npm cache clean --force

COPY --chmod=755 scripts/docker-entrypoint.sh /docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
