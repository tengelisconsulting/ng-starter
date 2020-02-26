FROM node:13.8.0-alpine
WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

COPY ./angular.json ./angular.json
COPY ./browserslist ./browserslist
COPY ./src ./src
COPY ./tsconfig.app.json ./tsconfig.app.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./tslint.json ./tslint.json

RUN npm run prod

FROM nginx:1.17-alpine
WORKDIR /app
COPY --from=0 /app/dist/webapp ./dist
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'
