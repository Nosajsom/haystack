const createAssistant = require("./createAssistant");

async function ask({ message, user }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ message: message.message + "?" });
    }, 4000);
  });
}

async function greet({ user }) {
  return { message: user.name ? user.name + "!" : "Question?" };
}

const ParrotAssistant = createAssistant({
  id: "aibot",
  name: "Parrot",
  avatar:
    "https://avatars.dicebear.com/4.5/api/human/onlea-parrot.svg?b=%23EFE14B&m=8&w=40&h=40&mood[]=sad",
  ask,
  greet,
});

module.exports = ParrotAssistant;
