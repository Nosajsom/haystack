const createAssistant = require("./createAssistant");
const fetch = require("node-fetch");
const lodash = require("lodash");
const { loadSettings } = require("../utils");

// Based on: https://stackoverflow.com/a/54580145/3558475
const k = 1.5;
const transformedSigmoid = (z)=> {
  return 1 / (1 + Math.exp(-(z-2*k)/k));
}

const getTimeFromSeconds = (seconds)=> {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

const getLinkFromAnswer = (selected)=>{
  const {meta} = selected;

  const filename = meta.name;
  const filepath = meta.file_path;
  const extension = filename.split('.').pop()
  let pageInfo = ""
  let pageHash = ""
  if(['doc','docx','pdf'].includes(extension)){
    pageInfo = `\nPage ${meta.page.answer_start_page}`
    if(extension==='pdf'){
      pageHash = '#page='+meta.page.answer_start_page
    }
  } else if(meta.page_time_map){
    pageHash = '#t='+meta.page_time_map[meta.page.answer_start_page-1]
    pageInfo = getTimeFromSeconds(meta.page_time_map[meta.page.answer_start_page-1])
  }

  return {
    id: "link",
    type: "link",
    href: `/static/${filepath}${pageHash}`,
    text: `${filename} ${pageInfo}`
  }
}


/**
 * Handles requests from a user
 * @param {*} message the message sent by the user
 * @returns
 */
async function ask({ message, settings }) {
  console.log({message})
  let url = 'http://haystack-api:8000/query';

  const {userId} = message
  console.log(message)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Cookie": new URLSearchParams({"user":userId}).toString(),
    },
    body: JSON.stringify({
        "query": message.message,
        "filters": null,
    })
  });
  const data = await res.json();
  if (data.answers.length){
    const selected = data.answers[0];
    const transformedScore = transformedSigmoid(selected.score)
    const {answer} = selected;

    if (selected.probability < settings.ai.minimumConfidence || transformedScore < settings.ai.minimumAnswerRelevance){
      return {
        message: settings.messages.unsure,
        answerData: selected,
        actions: [
          {
            id: "debugInfo",
            type: "debugInfo",
            text: `Debug info:\nRelevance: ${transformedScore.toFixed(3)}\nConfidence: ${selected.probability.toFixed(3)}`
          },
          ...lodash.uniqBy(
            data.answers.filter(answer=>transformedSigmoid(answer.score)>=settings.ai.minimumLinkRelevance).sort((a, b) => a.score-b.score).map(getLinkFromAnswer),
            (e)=>e.href
          ),
          {
            id: "alsoSee",
            type: "text",
            text: `Related content:`
          },
        ],
      }
    }
    return {
      message: answer,
      answerData: selected,
      actions: [
        {
          id: "debugInfo",
          type: "debugInfo",
          text: `Debug info:\nRelevance: ${transformedScore.toFixed(3)}\nConfidence: ${selected.probability.toFixed(3)}`
        },
        {
          id: "feedback",
          type: "feedback"
        },
        ...lodash.uniqBy(
          data.answers.slice(1).filter(answer=>transformedSigmoid(answer.score)>=settings.ai.minimumLinkRelevance).sort((a, b) => a.score-b.score).map(getLinkFromAnswer),
          (e)=>e.href
        ),
        {
          id: "alsoSee",
          type: "text",
          text: `Related content:`
        },
        getLinkFromAnswer(selected),
      ],
    };
  } else{
    return {
      message: settings.messages.unsure,
    }
  }
}

/**
 * Greet the user
 * @param {*} user
 * @returns
 */
async function greet({ user, settings }) {
  return {
    message: settings.messages.greeting,
  };
}

/**
 * Create the "Hackstack" assistant
 */
const HaystackAssistant = (userId)=>{
  const settings = loadSettings({user:userId.split('-').pop()});
  console.dir({userId,settings})
  return createAssistant({
    id: "aibot",
    name: "Hackstack",
    avatar: settings.ui.aiIcon,
    ask:(options)=>ask({...options,settings}),
    greet:(options)=>greet({...options,settings}),
  });
}

module.exports = HaystackAssistant;
