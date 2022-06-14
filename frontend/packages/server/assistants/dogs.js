const createAssistant = require("./createAssistant");
const fetch = require("node-fetch");

// helper to fake wait time
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// track if first message has sent
let hasSent = false;

/**
 * Returns a random response
 * @returns {string}
 */
const getDogMessage = () => {
  if (!hasSent) {
    hasSent = true;
    return "I like dogs!";
  }
  const responses = [
    "a dog!",
    "what about this guy?",
    "more! more! more!",
    "🐶",
    "i am here with another dog",
    "still need more dogs?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Handles requests from a user
 * @param {*} message the message sent by the user
 * @returns
 */
async function ask({ message }) {
  // handle message about dogs
  if (message.message && message.message.indexOf("dog") > -1) {
    await delay(1000);
    return fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => res.json())
      .then((json) => {
        return {
          message: getDogMessage(),
          actions: [
            {
              id: "image",
              type: "image",
              src: json.message,
              context: {
                message,
              },
            },
          ],
        };
      });
  }
  // handle message not about dogs
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        message: "Hmm.. I'm not sure, can we talk about dogs?",
      });
    }, 4000);
  });
}

/**
 * Greet the user
 * @param {*} user
 * @returns
 */
async function greet({ user }) {
  return {
    message: `Hi, you can ask me things, but I only like to talk about dogs.`,
  };
}

/**
 * Create the "Dog Fetcher" assistant
 */
const DogAssistant = createAssistant({
  id: "aibot",
  name: "Dog Fetcher",
  avatar:
    "https://avatars.dicebear.com/4.5/api/human/dogs.svg?m=8&b=%23eeeeff&mood[]=sad",
  ask,
  greet,
});

module.exports = DogAssistant;
