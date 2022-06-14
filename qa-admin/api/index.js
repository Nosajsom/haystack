import elasticsearch from 'elasticsearch';
import axios from 'axios';
const fetch = require('node-fetch');
const FormData = require('form-data');
import fs from 'fs';
import {sync as writeFileAtomicSync } from 'write-file-atomic'


const client = new elasticsearch.Client({
    host: 'elasticsearch:9200', apiVersion: '7.4', // use the same version of your Elasticsearch instance
});

const loadJSON = (path)=>{
    try{
      const rawdata = fs.readFileSync(path,{encoding:'utf8'});
      return JSON.parse(rawdata);
    } catch(e){
      return {} // Default return empty
    }
  }

export const __API__ =  {

    

    updateHTML: async({user})=>{
        // send a get request to the framework
        return fetch("http://haystack-api:8000/update", {
        "headers": {
            "Cookie": new URLSearchParams({"user":user}).toString(),
        },
        "method": "GET"
        }).then(response =>{
            console.log("res before",response);
            if (response.status == 200){
                    // Means no update is needed.
                return {"200":"Ok"};
            }else{
                return {"500":"Error"}

            }
            
        })

    },
    addAvailableUser: async({email})=>{
        // send a get request to the framework

        return fetch("http://haystack-api:8000/add_user/"+email, {

        "method": "POST"
        }).then(res => res.json())

    },
    getAvailableUsers: async({})=>{
        // send a get request to the framework
        return fetch("http://haystack-api:8000/available_users", {
        "headers": {
        },
        "method": "GET"
        }).then(res => res.json())

    },
    
    getFequencyList: async({user, num})=>{
        // send a get request to the framework
        console.log("num",num);
        if (!Number.isInteger(num)) {
            throw new Error("API getFequencyList failed. Argument num is not integer");
        }
        return fetch("http://haystack-api:8000/word_frequency/"+num, {
        "headers": {
            "Cookie": new URLSearchParams({"user":user}).toString(),
        },
        "method": "POST"
        }).then(res => res.json())

    },
    updateFileName: async ({oldname,newname,user})=>{
        console.log("name user",oldname,user);
        const response = await client.search({
            index: 'document',
            body: {
                "size": 1000,
                "query": {
                    "bool":{"must":[
                        {"term":{"name":oldname}}
                        ]
                        
                    }
                      
                }
                
            }
        });
        const hitsTotal = response.hits.hits;
        //var id_array = [];
        var i;
        if (hitsTotal != []){
            for(i of hitsTotal){
            //id_array.push(i._id);
            console.log("id ",i._id);
            await client.update({
                index: 'document',
                id: i._id,
                body: {
                  script: {
                   
                    source: 'ctx._source.name = params.name',
                    params:{name:newname}
                    // you can also use parameters
                    // source: 'ctx._source.times += params.count',
                    // params: { count: 1 }
                  }
                }
              })
        }
            
        
        }
        
        
        // now update filename using this id array
        return response;
        
    },
    checkLogIndexExists:async()=>{
        return client.indices.exists({index: "message-log"});
    },
    
    getAcronyms:async({user})=>{
        return fetch("http://haystack-api:8000/acronym",   
        {
            "method": "POST",
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
        
    },
    getStaticAcronyms:async({user})=>{
        return fetch("http://haystack-api:8000/static_acronyms",{
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
        
    },
    getStaticWordFrequency:async({user})=>{
        return fetch("http://haystack-api:8000/static_word_frequency",{
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
        
    },
    getFaqs:async({user})=>{
        return fetch("http://haystack-api:8000/faq",       
        {
            "method": "POST",
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
        
    },
    getStaticFaqs:async({user})=>{
        return fetch("http://haystack-api:8000/static_faqs",{
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
        
    },
    getKeywords:async({user})=>{
        return fetch("http://haystack-api:8000/keywords",       
        {
            "method": "POST",
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(async res => res.json())
        
    },
    getStaticKeywords:async({user})=>{
        return fetch("http://haystack-api:8000/static_keywords",{
            "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
            }
        }).then(res => res.json())
    },
    
    deleteDocumentByName: async({name,user})=>{

        return client.deleteByQuery({
            index: 'document',
            body: {
                query: {
                    bool:{
                        must:[
                            {term:{name:name}},
                            {term:{clientIdentity:user}}
                        ]
                    }
                }
                
            }
          
          }).then(res => {return res})
        
    },
    
    searchDocuments: async({query,index,sort})=>{
        // const sort = {'date':{'type':'integer','direction':'asc'}}
        if (sort){
            await client.indices.putMapping({
                index: index || 'document',
                body:{
                    "properties": Object.keys(sort).reduce((obj,key)=>{
                        obj[key]={
                            'type': sort[key].type
                        }
                        return obj;
                    },{})
                }
            })
        }
        const response = await client.search({
            index: index || 'document',
            body: {
                size: 1000,
                query,
                sort: !sort? undefined:Object.keys(sort).map((key)=>{
                    return {[key]:sort[key].direction}
                })
            },
        });
        return response
    },
    getAllMessageLog: async({user})=>{
        //console.log("user",user);
        
        return client.search({
        index: 'message-log',
        body: {
            "size": 10000,
            query: {
                match_phrase_prefix:{
                    chatId:{
                        query:user
                    }
                }
            }
                
            }
        
        }).then(res => {return res})
        
        
        
    },
    
    getMessageSessions: async({user})=>{
        // Enable aggreation of chatId
        await client.indices.putMapping({
            index:'message-log',
            body:{
                "properties": {
                    "chatId": { 
                        "type": "text",
                        "fields": {
                            "keyword": { 
                                "type": "keyword"
                            }
                        }
                    }
                }
              }
        })
        // Search
        const response = await client.search({
            index: 'message-log',
            body: {
                "size": 0,
                "query": {
                    "match_phrase_prefix": {
                        "chatId": {
                            "query": user
                        }
                    }
                },
                "aggs": {
                    "langs": {
                        "terms": {
                            "field": "chatId.keyword",
                            "size": 1000
                        }
                    }
                }
            }
        });
        return response
    },
    saveSettings: ({data,user}) => {
        const dir = `/home/shared/${user}/`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        // Atomic save
        writeFileAtomicSync(`/home/shared/${user}/settings.json`, JSON.stringify(data), {encoding:'utf8'})
        return true
    },
    loadDefaultSettings: () => {
        return loadJSON('/home/shared/default-settings.json')
    }
}

function TimeoutError(message = "") {
    this.name = "TimeoutError";
    this.message = message;
}
TimeoutError.prototype = Error.prototype;
export {TimeoutError}

export const API = new Proxy(
    __API__,
    {
        get: function(_, name) {
            return async function(){
                //console.log("name",name);
                const args = Array.from(arguments);
                let url = '/admin/api'
                if (typeof window === 'undefined'){
                    //console.log("herere")
                    url = 'http://localhost:3000/admin/api'
                }
                const apiResponse = await fetch(url,{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'
                
                },
                    body: JSON.stringify({
                        func:name,
                        args
                    })
                })
                if(apiResponse.status===200){
                    var json_response =  apiResponse.json();
                    return json_response;
                } else if(apiResponse.status===504){
                    throw TimeoutError(await apiResponse.text()) 
                }
                else{
                    throw Error(await apiResponse.json())
                }
            }
        },
    }
);

export default API;