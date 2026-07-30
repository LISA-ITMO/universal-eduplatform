FROM node:18-bullseye AS builder

RUN npm install -g pnpm@8.15.6

WORKDIR /app

COPY package.json ./

RUN echo "packages:" > pnpm-workspace.yaml && \
    echo "  - 'packages/*'" >> pnpm-workspace.yaml

RUN echo "link-workspace-packages=true" > .npmrc && \
    echo "prefer-workspace-packages=true" >> .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc

COPY packages ./packages

RUN pnpm install

RUN pnpm rebuild esbuild

ENV NODE_OPTIONS="--max-old-space-size=4096"

ENV VITE_CLIENT_ID="web"
RUN pnpm --filter web build

FROM nginx:alpine
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY nginx/web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]