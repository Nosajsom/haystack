const {
  hasMessages,
  addMessageFromBot,
  getMessages,
  addMessage,
  updateMessage,
} = require("./models/messages");
const { addAnswer } = require("./models/answers");
const { getUser } = require("./models/users");
const { getChat } = require("./models/chats");
const debug = require("debug")("app:controller");

const handleAnswer = ({ io, socket }) => async (
  { sourceMessage, answerMessage, userId, chatId, response },
  callback
) => {
  debug("received answer", response, answerMessage, sourceMessage);
  // get asker / answerer user data
  const { user: asker } = getUser(sourceMessage.message.userId);
  const { user: answerer } = getUser(userId);
  // add answer to answers
  addAnswer({
    answer: response.answer,
    keywords: response.keywords,
    sourceMessage: sourceMessage.message,
  });
  // remove "answer" action
  debug("updating answer message", answerMessage);
  updateMessage(answerMessage.id, {
    actions: answerMessage.actions.filter((v) => v.id !== "answer"),
  });
  // send message to asker
  addMessageFromBot({
    toUserId: sourceMessage.message.userId,
    chatId: sourceMessage.message.chatId,
    message: `${answerer.name} responded to your question: ${response.answer}`,
  });
  // let the answerer know their response was added
  addMessageFromBot({
    toUserId: userId,
    chatId: chatId,
    message: `Your response was sent to ${asker.name} and added to the answers database.`,
  });
  // broadcast new messages to the asker
  const userMessages = getMessages({
    userId: sourceMessage.message.userId,
    chatId,
  });
  socket.broadcast.to(chatId).emit("messages", userMessages);
  // emit updated messages to the answerer
  const ownerMessages = getMessages({ userId, chatId });
  socket.emit("messages", ownerMessages);
  // fire callback if it exists
  callback && callback();
};

/**
 * Hanlder for responding to a message
 */
const handleRespond = ({ io, socket }) => async ({
  userId,
  chatId,
  message,
}) => {
  const { user } = getUser(userId);
  const chat = getChat(chatId);
  // get response from the chat assistant
  socket.emit("responding", true);
  const response = await chat.assistant.ask({ message, user, chat });
  socket.emit("responding", false);
  // send response from chat assistant
  addMessageFromBot({
    toUserId: userId,
    chatId: chatId,
    ...response,
  });
  const messages = getMessages({ userId, chatId });
  socket.emit("messages", messages);
};

/**
 * Handler for when a message is received
 */
const handleMessage = ({ io, socket }) => (
  { userId, chatId, message },
  callback
) => {
  debug("received message", userId, chatId, message, socket.id);
  // add message to the conversation
  const messageObj = addMessage({ userId, chatId, message });
  const messages = getMessages({ userId, chatId });
  socket.emit("messages", messages);
  callback && callback();
  handleRespond({ io, socket })({ userId, chatId, message: messageObj });
};

/**
 * Handler for when a user connects to a chat
 * @param {*} param0
 * @param {*} callback
 */
const handleJoin = ({ io, socket }) => async ({ userId, chatId }, callback) => {
  const { error, user } = getUser(userId);
  if (error) return callback && callback(error);
  debug("user joined", user);
  socket.join(chatId);
  // send chat details to client
  const chat = getChat(chatId);
  socket.emit("chatDetails", {
    id: chatId,
    name: chat.name,
    assistant: chat.assistant.getUser(),
  });
  // add a welcome message if the user has no messages
  if (!hasMessages({ chatId, userId })) {
    const greeting = await chat.assistant.greet({ user, chat });
    addMessageFromBot({
      toUserId: userId,
      chatId,
      ...greeting,
    });
  }
  // emit previous chat messages
  const messages = getMessages({ userId, chatId });
  socket.emit("messages", messages);
  callback && callback();
};

/**
 * Handler for a user action within chat (e.g. clicking button)
 * @param {*} param0
 * @param {*} callback
 */
const handleAction = ({ io, socket }) => async ({
  id,
  action,
  message,
  userId,
  chatId,
}) => {
  debug("received action", id, userId, chatId, message);
  if (id === "escalate") {
    const { user } = getUser(userId);
    const chat = getChat(chatId);
    const ownerId = chat.owners[0];
    const response = await chat.assistant.escalate({
      user,
      message: action?.context?.message,
    });
    debug("handling escalation", user, response);
    // add message for chat owner
    addMessageFromBot({
      toUserId: ownerId,
      chatId,
      ...response,
    });
    // remove action from source message
    updateMessage(message.id, {
      actions: message.actions.filter((v) => v.id !== action.id),
    });
    // tell the user we've asked
    addMessageFromBot({
      toUserId: userId,
      chatId,
      message:
        "I've asked someone else, it might take them some time to respond.",
    });
    // broadcast new messages to the owner
    const ownerMessages = getMessages({ userId: ownerId, chatId });
    socket.broadcast.to(chatId).emit("messages", ownerMessages);
    // emit new messages to the student
    const userMessages = getMessages({ userId, chatId });
    socket.emit("messages", userMessages);
  } else if(id === "feedback"){
    const { user } = getUser(userId);
    const chat = getChat(chatId);
    const ownerId = chat.owners[0];
    debug("handling feedback", user);

    // Update feedback on message
    updateMessage(message.id, {
      feedback: action.feedback,
    });

    // broadcast new messages to the owner
    const ownerMessages = getMessages({ userId: ownerId, chatId });
    socket.broadcast.to(chatId).emit("messages", ownerMessages);
    // emit new messages to the student
    const userMessages = getMessages({ userId, chatId });
    socket.emit("messages", userMessages);
  }
};

/**
 * Handler for when the user disconnects from a session
 */
const handleDisconnect = ({ io, socket }) => () => {
  debug("disconnected");
};

module.exports = {
  handleJoin,
  handleMessage,
  handleDisconnect,
  handleAction,
  handleAnswer,
};
