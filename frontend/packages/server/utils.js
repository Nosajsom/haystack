const fs = require("fs");
const lodash = require("lodash");
const memoizer = require('lru-memoizer');

const loadJSON = (path)=>{
    try{
      const rawdata = fs.readFileSync(path,{encoding:'utf8'});
      return JSON.parse(rawdata);
    } catch(e){
      return {} // Default return empty
    }
}
  
const loadSettingsFromFile = ({user})=>{
      console.log('loading settings from file...')
      const defaultData = loadJSON('/home/shared/default-settings.json')
      const userData = loadJSON(`/home/shared/${user}/settings.json`)
      return lodash.merge({},defaultData,userData)
}

const loadSettings = memoizer.sync({
    load: loadSettingsFromFile,
    hash: (params) => params.user,
    max: 20, // Max 20 items in cache
    maxAge: 1000 * 60, // TTL 1 min
});

module.exports = {
    loadJSON,
    loadSettings
};
  