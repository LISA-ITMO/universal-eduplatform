FROM node:16-alpine
WORKDIR /client
COPY ./client/web/package.json ./client/web/yarn.lock ./
RUN npm install
COPY ./client/web .
COPY ./compose/env/.env.client ./.env
# ENTRYPOINT ["tail", "-f", "/dev/null"]
RUN npm run build
