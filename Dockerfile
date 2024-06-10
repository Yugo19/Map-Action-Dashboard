From node:20-bookworm

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "start"]
