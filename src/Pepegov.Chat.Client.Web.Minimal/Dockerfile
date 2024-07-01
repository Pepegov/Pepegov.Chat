#FROM node:14-alpine AS builder
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build:production

#FROM nginx:alpine
#COPY --from=builder /app/dist /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

#----------------------------------------------------------------

#FROM node:14-alpine
#WORKDIR /app

#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build:production
#RUN npm install -g serve
#EXPOSE 80
#CMD ["serve", "-s", "dist", "-l", "80"]

#---------------------------------------------------------------

FROM node:14-alpine
WORKDIR /app
EXPOSE 80

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install webpack-dev-server --save-dev
RUN npm start
