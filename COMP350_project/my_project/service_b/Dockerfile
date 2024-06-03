# app_b/Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apk --no-cache add curl 
COPY . .
EXPOSE 1001
CMD ["node", "server.js"]

