FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY server.js .
COPY config.js .
COPY index.html .
COPY views/ ./views/
COPY assets/ ./assets/

EXPOSE 3000

CMD ["node", "server.js"]
