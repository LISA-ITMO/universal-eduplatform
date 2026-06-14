FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json ./

RUN echo "packages:" > pnpm-workspace.yaml && \
    echo "  - 'packages/*'" >> pnpm-workspace.yaml

RUN echo "link-workspace-packages=true" > .npmrc && \
    echo "prefer-workspace-packages=true" >> .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc

COPY packages ./packages

RUN pnpm install

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV VITE_CLIENT_ID="admin"
RUN pnpm --filter admin build

FROM nginx:alpine
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]