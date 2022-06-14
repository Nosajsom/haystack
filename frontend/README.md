# Onlea AI Chat

This repository contains code for the Onlea AI Chat proof-of-concept.

## Getting started

### Running Locally

**Requirements**
You will need to install the following to run the demo:

- node (v14 LTS)
- [yarn](https://yarnpkg.com/getting-started/install) - package / workspace manager

**Install packages**
Install all of the required node dependencies with:

```
yarn install
```

**Run the demo**

To start the client and server use:

```
yarn start
```

This starts the front-end demo on port 3000, and the mock backend on port 5000.

### Running via Docker

To run the app in a docker container, build the docker file with

```
docker build -t onlea/ai-chat-app .
```

then run with

```
docker run -p 5000:5000 -d onlea/ai-chat-app
```

## Contributing

For more details, see the README for the corresponding package:

- [packages/client](./packages/client): client side interface for the chat app
- [packages/server](./packages/server): mock server back-end
