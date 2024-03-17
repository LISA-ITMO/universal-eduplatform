FROM node:16-alpine
WORKDIR /client
COPY ./client/web/package.json ./client/web/yarn.lock ./
RUN npm install
COPY ./client/web .
COPY ./compose/env/.env.client ./.env
# ENTRYPOINT ["tail", "-f", "/dev/null"]
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build
