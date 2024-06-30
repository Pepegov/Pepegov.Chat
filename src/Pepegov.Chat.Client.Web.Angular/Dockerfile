#build
FROM node:21.7.1-alpine AS build
LABEL authors="pepegov"
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

#proxy
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/pepegov.chat.client /usr/share/nginx/html
