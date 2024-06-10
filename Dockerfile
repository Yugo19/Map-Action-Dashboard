From node:20-bookworm

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install

COPY . /usr/src/app


CMD ["npm", "start"]
