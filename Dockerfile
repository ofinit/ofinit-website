# Next.js 16 + Prisma — optimized for Coolify / Docker (standalone output).
# Coolify: use Dockerfile build pack, expose port 3000 (or map Coolify PORT → 3000).
#
# Required env (set in Coolify — runtime):
#   DATABASE_URL — e.g. file:/app/data/app.db  (mount a persistent volume on /app/data)
#   SITE_URL — https://ofinit.com  (auth redirects; required at runtime, not only at build)
#   NEXT_PUBLIC_SITE_URL — same URL (build-time + client; set as Coolify build arg too if possible)
#   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM — required in production for double opt-in emails
#   Optional: NODE_ENV=production (set by image)
#
# On container start, entrypoint runs `prisma db push` + admin seed (no manual tsx seed needed).
# Optional: SEED_ADMIN_PASSWORD (default admin123). Set RUN_DB_SETUP=0 to skip auto migrate/seed.
# Full sample data (blogs, etc.): run locally with `npx prisma db seed` — not in production image.
#
# Uploads: persist public/uploads by mounting the same volume path or bind-mount ./public/uploads.

ARG NODE_VERSION=22-bookworm-slim

FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
# postinstall runs `prisma generate` — needs schema + OpenSSL before npm ci
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json .npmrc* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Regenerate client after schema (binaryTargets) is fully copied — deps stage used an older layer cache.
RUN npx prisma generate

ARG SITE_URL=
ARG NEXT_PUBLIC_SITE_URL=
ENV SITE_URL=$SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
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
ENV ANALYTICS_LOG_FILE=/app/data/analytics/logs.json

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

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
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Schema + global Prisma CLI (`npx prisma db push`). Local npm install hits peer-deps on standalone package.json — use -g.
COPY --from=builder /app/prisma ./prisma
COPY --chown=nextjs:nodejs scripts/docker-seed-admin.mjs ./scripts/docker-seed-admin.mjs
COPY --chown=nextjs:nodejs scripts/docker-seed-blogs.mjs ./scripts/docker-seed-blogs.mjs
USER root
RUN npm install -g prisma@6.19.3 \
  && npm cache clean --force

COPY --chmod=755 scripts/docker-entrypoint.sh /docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
