FROM node:12.16
WORKDIR /
COPY package.json package.json
COPY index.js index.js
COPY www www
COPY config config
RUN npm i
CMD [ "node", "index.js" ]