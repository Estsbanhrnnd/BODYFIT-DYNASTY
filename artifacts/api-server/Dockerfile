# Production Dockerfile for BodyFit Dynasty API Server
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json

RUN pnpm install --frozen-lockfile

# Build stage
FROM dependencies AS builder
COPY artifacts/api-server/ ./artifacts/api-server/
RUN pnpm --filter @workspace/api-server run build

# Production Runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=5000
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/api-server/package.json ./artifacts/api-server/package.json

WORKDIR /app/artifacts/api-server
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/healthz || exit 1

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
