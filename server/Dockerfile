FROM node:lts-alpine

WORKDIR /app/server

COPY package.json /app/server

RUN npm install

COPY . /app/server

EXPOSE 3001
CMD [ "node", "index.js" ]