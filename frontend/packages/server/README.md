# Onlea AI Chat Server

The chat server receives messages from the Onlea AI Chat Client and sends responses.

Built with:

- Node.js
- Socket.io
- Express

## Getting Started

To run the server, first run `npm install`, then:

```sh
npm run start
```

## Usage

### Serving the front end

The Onlea AI Chat Client front end can be put on any static HTML page. See the client README for more info.

If you'd like to serve a front-end using the express server, place the files you want to serve in the `./public` folder.

### Configuring the port

By default, the server runs on port 5000. This can be adjusted by setting the `PORT` environment variable to your desired port.

### CORS configuration

The server accepts requests from all origins. If you would like to allow requests from other origins, modify the CORS configuration in `index.js`

### Client-Server Communication

All communication between chat clients and the server is handled using [socket.io](https://socket.io/), which utilizes [web sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to send messages back and forth between the two.

- listeners are set in `index.js` (binds the handler for specific events)
- handlers are set in `controller.js` (code that executes to handle events)

### Assistants

Assistants are the AI components that receive messages from users and then respond accordingly. New assistants can be created using the `/assistants/createAssistant.js` helper.

An assistant has the following properties:

```js
{
  // unique identifier for the assistant
  id,
  // "ai" role
  role: "ai",
  // assistant name
  name,
  // an image to use as the AI chat avatar
  avatar,
  // a function that receives a message, user, and chat and returns a message with a response
  ask,
  // a function that receives a user object and returns a message greetind the user
  greet,
  // a function that returns a message to the course owner when a user escalates their question
  escalate: escalate || DEFAULT_ESCALATE,
  // retuns the user object for the assistant
  getUser
}
```

See the examples below for a couple sample assistants:

- **Keyword Assistant** ([code](./assistants/unhelpful.js))  
  checks received messages for keywords and returns a response if it finds a match, if not it can redirect the request to another user.
- **Dog Picture Assistant** ([code](./assistants/dogs.js))  
  replies back with a picture of a dog when the message contains the string "dog"
- **Parrot Assistant** ([code](./assistants/parrot.js))  
  Copies the received message and says it back, with a "?" appended.

### Storage

There is no database or persistant storage for this demo. All users, chats, and messages are stored in javascript objects in memory. After every server restart the users, chats, and messages will be reset to their default values set in the `./models` folder.

### Models

Sample models have been created in the `./models` folder.

#### Chats

Chats represent a conversation with an AI assistant.

**Sample `Chat` entry:**

```js
{
  // identifier for the chat
  id: "abcd",
  // name of the chat
  name: "Assistant",
  // assistant ID to use in the chat
  assistant: "dogs",
  // user IDs of the chat "owners"
  // owners get notified when questions are asked,
  // and can add responses
  owners: ["admin1"],
  // non-owner participants
  participants: ["user1"],
}
```

#### Messages

Messages represent a message in a conversation.

**Sample `Message` entry:**

```js
{
  // message unique identifier
  id,
  // originating user identifier
  userId,
  // recipient user identifier
  toUserId,
  // chat identifier that this message belongs to
  chatId,
  // text content of the message
  message,
  // date the message was sent
  date,
}
```

#### Users

Users represent an entity who is using the chat.

**Sample `User` entry:**

```js
{
  // user identifier
  id,
  // user role
  role,
  // user name
  name,
}
```

#### Answers

Answers represent responses to messages or questions in the chat.

**Sample `Answer` entry:**

```js
{
  // answer text
  answer,
    // array of keywords
    keywords,
    // source message object
    sourceMessage;
}
```
