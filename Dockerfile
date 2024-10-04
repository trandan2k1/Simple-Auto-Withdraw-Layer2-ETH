FROM node:18.14.2 AS builder

WORKDIR /app

COPY . .

RUN yarn

CMD ["node", "index.js"]