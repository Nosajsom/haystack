const ParrotAssistant = require("./parrot");
const UnhelpfulAssistant = require("./unhelpful");
const DogsAssistant = require("./dogs");
const HaystackAssistant = require("./haystack");

const getAssistant = (id,userId) => {
  switch (id) {
    case "haystack":
      return HaystackAssistant(userId);
    case "dogs":
      return DogsAssistant;
    case "parrot":
      return ParrotAssistant;
    case "unhelpful":
    default:
      return UnhelpfulAssistant;
  }
};

module.exports = { getAssistant };
