# Onlea AI Chat Client

The client provides a popup chat for users to interact with the AI chatbot server.

Built with:

- React
- Material UI
- Zustand (state management)
- Socket.io

## Usage

First add the client bundle to the page you want to include the chat on.

```html
<script src="onlea-chat.min.js"></script>
```

With the client bundle on the page, initialize the chat client with a configuration object to add it to the page.

- `endpoint`: the backend server for the chat client
- `userId`: an identifier for the user to start the chat as
- `chatId`: an identifier for the chat conversation to connect to

```js
OnleaChatClient.init({
  endpoint: "localhost:5000",
  userId: "user1",
  chatId: "abcd",
});
```

## Contributing

To run the development server, first run `yarn install`, then:

```sh
yarn start
```

this command will loads the Chat AI demo sandbox on port 3000 (http://localhost:3000/). The code for this demo is in the `demo/src` folder.

### Creating a Build

You can create a front-end build of the application by running

```sh
yarn build
```

The build will create the primary build of the app:

- `./dist/`: UMD build of the client (with dependencies and bootstrap)
  - best for integrating on an existing site
  - provides `OnleaChatClient` to the global namespace, which has `OnleaChatClient.init()` and `OnleaChatClient.destroy()` for initializing / tearing down the chat. See `./dist/index.html` for example.

These secondary builds are also created:

- `./umd/`: UMD build of the client (no dependencies / bootstrap)
  - chat client only, does not include React dependencies or bootstrap
  - provides `OnleaChat` React component to the global namespace
- `./es/`: ES modules build of the application
  - best for importing components into another React project

## Notes

### Structure

The front end components are separated into modules:

- [./src/modules/App](./src/modules/App)
  - Connected components that provide state to presentational components
- [./src/modules/Chat](./src/modules/Chat)
  - Presentational components for chat interface
- [./src/modules/Answers](./src/modules/Answers)
  - Presentational components for answer interface

### Client-Server Communication

Messages are sent and received from the backend in the [useSocketClient](./src/modules/App/hooks/useSocketClient.js) hook.

- Receives the following from the server:

  - `message`
    - received when the server emits a single message to the client
    - payload: a single `message` object
  - `messages`
    - received when the server emits new messages to the client
    - payload: an array of `message` objects
  - `responding`
    - received when the server emits a responding status update
    - payload: `true` if the server is processing the request, `false` when it is no longer processing.

- Emits the following to the server:
  - `join`
    - emitted when a user joins the chat
    - payload: `userId`, `chatId`
  - `sendMessage`
    - emitted when a user submits a message on chat
    - payload: `userId`, `chatId`, `message`
  - `action`
    - emitted when a user triggers an action from within a message
    - payload: `id`, `action`, `message`, `userId`, `chatId`
  - `sendAnswer`
    - emitted when a user submits an answer from the chat interface
    - payload: `response`, `answerMessage`, `sourceMessage`, `userId`, `chatId`
