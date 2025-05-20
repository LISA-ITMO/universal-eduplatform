FROM node:20-alpine
WORKDIR /client
COPY ./client/web-new/package.json ./client/web-new/package-lock.json ./
RUN npm install
COPY ./client/web-new .
# COPY ./compose/env/.env.client ./.env
# ENTRYPOINT ["tail", "-f", "/dev/null"]
ENV VITE_API_USER_URL='/users'
ENV VITE_API_TESTS_URL='/tests'
ENV VITE_API_SUBJECTS_URL='/subjects'
RUN npm run build