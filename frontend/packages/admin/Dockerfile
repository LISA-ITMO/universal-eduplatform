FROM node:22-bullseye AS builder
RUN apt-get update && apt-get install -y python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@7
WORKDIR /app

COPY package.json ./

RUN echo "packages:" > pnpm-workspace.yaml && \
    echo "  - 'packages/*'" >> pnpm-workspace.yaml

RUN echo "link-workspace-packages=true" > .npmrc && \
    echo "prefer-workspace-packages=true" >> .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc

COPY packages ./packages

RUN pnpm approve-builds --all || true
RUN pnpm install

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV VITE_CLIENT_ID="admin"
RUN pnpm --filter admin build

FROM nginx:alpine
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html
COPY ../nginx/admin.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]