const DEFAULT_HANDLER = async function () {
  return "no response";
};

const DEFAULT_ESCALATE = async function ({ message, user }) {
  return {
    message: `${user.name} asked the following question that I was unable to answer: ${message.message}`,
    actions: [
      {
        id: "answer",
        type: "button",
        label: "Add a response",
        context: {
          message,
        },
      },
    ],
  };
};

module.exports = ({
  id,
  name,
  avatar,
  ask = DEFAULT_HANDLER,
  greet = DEFAULT_HANDLER,
  escalate,
}) => {
  return {
    id,
    role: "ai",
    name,
    avatar,
    ask,
    greet,
    escalate: escalate || DEFAULT_ESCALATE,
    getUser: () => {
      return {
      id,
      name,
      avatar,
    }},
  };
};
