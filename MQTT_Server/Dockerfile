FROM node:20.6.0-alpine

WORKDIR /usr/app

COPY package* .

RUN npm install

COPY . .

EXPOSE 1883

CMD ["npm","run","start"]