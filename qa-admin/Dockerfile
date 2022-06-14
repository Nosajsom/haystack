
FROM node:16.1.0-alpine3.11

RUN npm install -g npm@6
RUN mkdir /app

WORKDIR /app

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*

COPY package.json package-lock.json /app/

# COPY . /app

# RUN npm run build

EXPOSE 3000
EXPOSE 9229
CMD ["/bin/sh","-c","npm ci && NODE_OPTIONS='--inspect=0.0.0.0:9229' /app/node_modules/next/dist/bin/next"]