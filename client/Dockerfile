FROM node:16-alpine
WORKDIR /client
COPY ./client/web/package.json ./client/web/yarn.lock ./
RUN npm install
COPY ./client/web .
# COPY ./compose/env/.env.client ./.env
# ENTRYPOINT ["tail", "-f", "/dev/null"]
ENV REACT_APP_API_USER_URL='/users'
ENV REACT_APP_API_TESTS_URL='/tests'
ENV REACT_APP_API_SUBJECTS_URL='/subjects'
RUN npm run build
