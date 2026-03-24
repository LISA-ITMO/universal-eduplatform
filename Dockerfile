# Multi-stage Dockerfile
# Builder: build frontends (pnpm) and server (npm)
FROM node:18-bullseye AS builder
WORKDIR /build

# Install pnpm (via corepack) for frontend workspace builds
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy frontend workspace and build
COPY frontend ./frontend
WORKDIR /build/frontend
RUN pnpm install --frozen-lockfile --network-concurrency 1 || pnpm install
RUN pnpm run build:all

# Build server
WORKDIR /build
COPY server ./server
WORKDIR /build/server
RUN npm ci --no-audit --no-fund
RUN npm run build

# Keep server node_modules to avoid re-install in final image

# Final image: runtime with node + python for bot
FROM node:18-bullseye-slim

ENV NODE_ENV=production

WORKDIR /app

# Install python for bot
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Install static server "serve" globally
RUN npm install -g serve@14.2.0

# Copy built frontends from builder
COPY --from=builder /build/frontend/packages/web/dist /app/web
COPY --from=builder /build/frontend/packages/admin/dist /app/admin

# Copy server build and node_modules from builder
COPY --from=builder /build/server/dist /app/server/dist
COPY --from=builder /build/server/node_modules /app/server/node_modules
COPY --from=builder /build/server/package.json /app/server/package.json

# Copy bot sources
COPY tgbot /app/tgbot

# Install python dependencies for bot
RUN pip3 install --no-cache-dir pytelegrambotapi requests python-dotenv

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose ports: web (8888), admin (9999), server (3000)
EXPOSE 8888 9999 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/graphql || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
