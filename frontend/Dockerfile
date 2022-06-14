FROM node:16.1.0-alpine3.11

# Install bash
RUN apk add bash

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY package.json yarn.lock /usr/src/app/
COPY packages/client/package.json packages/client/package-lock.json /usr/src/app/packages/client/
COPY packages/server/package.json packages/server/package-lock.json /usr/src/app/packages/server/

# Install app dependencies
RUN yarn install

COPY . /usr/src/app/

RUN yarn build

EXPOSE 5000

ENTRYPOINT [ "yarn", "start" ]