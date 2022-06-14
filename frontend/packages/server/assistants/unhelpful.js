const { findAnswer } = require("../models/answers");
const createAssistant = require("./createAssistant");
const debug = require("debug")("app:unhelpful");

// response to instructor messages
const RESPONSE_INSTRUCTOR = {
  message: "I can't help instructors.",
};

/**
 * Gets a response to a student message
 * @param {*} message
 * @returns
 */
const getResponse = (message) => {
  debug("getting response to:", message.message);
  const answer = findAnswer(message.message);
  return answer
    ? {
        message: "I found this: " + answer.answer,
      }
    : {
        message: "I'm not sure how to respond, should I ask the instructor?",
        actions: [
          {
            id: "escalate", // button w/ id "escalate" sends request to owners
            type: "button",
            label: "Ask Instructor",
            context: {
              message,
            },
          },
        ],
      };
};

/**
 * Handler for when a message is sent to the assistant
 * @returns {Promise<object>} promise with a message payload
 */
async function ask({ message, user, chat }) {
  const isOwner = chat.owners.indexOf(user.id) > -1;
  const response = isOwner ? RESPONSE_INSTRUCTOR : getResponse(message);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response);
    }, 4000);
  });
}

/**
 * Handler for greeting someone who has connected to chat for the first time
 * @returns {Promise<object>} promise with a message payload
 */
async function greet({ user, chat }) {
  const isOwner = chat.owners.indexOf(user.id) > -1;
  return {
    message: isOwner
      ? `Hello ${user.name}!`
      : `Hi ${user.name}, I am your virtual assistant. Ask me something and I'll do my best to help you!`,
  };
}

/**
 * Unhelpful Assistant
 * ---
 * This assistant doesn't know much.
 * - Starts with an empty answers store.
 * - Searches answers store for keywords when messages received.
 * - Escalates any messages with no answer to the course instructor.
 */
const UnhelpfulAssistant = createAssistant({
  id: "aibot",
  name: "Unhelpful Assistant",
  avatar:
    "https://avatars.dicebear.com/4.5/api/human/onlea.svg?m=8&b=%23eeeeff&mood[]=happy",
  ask,
  greet,
});

module.exports = UnhelpfulAssistant;
