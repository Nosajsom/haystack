
import {
  Button,
  Container,
  Row,
} from "reactstrap";
// layout for this page
import { useRouter } from 'next/router';
import AdminChild from "layouts/AdminChild.js";
// core components
import UserLayout from "layouts/User.js";
import {API} from 'api';


import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import "d3-transition"; 
import { select } from "d3-selection";
// import { saveSvgAsPng } from 'save-svg-as-png'; 

// initialize list
const reactCloudWords = []; 
const wordLinks = {}; 


function displayInfo(word) {
  
  document.getElementById("box").style.visibility = "visible"; 
  
  document.getElementById("text").innerHTML = word.text + " appears " + word.value + " times. ";
  
  var ul = document.getElementById("list");
  ul.innerHTML = ''; 
  
  for (const link in wordLinks[word.text]) {
        
    var list_item = wordLinks[word.text][link]; 
  
    if (list_item["type"]==='page'){
          
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(link)); 

      // console.log(list_item["data"]);
      for(var i = 0; i < list_item["data"].length; i++) {
        
        var file_data = list_item["data"][i]; 
        var a = document.createElement("a");
        // var newItem = document.createElement("p");
        a.textContent = file_data[0];
        a.setAttribute('href', file_data[1]['url']);
        // newItem.appendChild(a);
        // li.appendChild(newItem);
        li.innerHTML += ' ' + a.outerHTML; 
      }
      
    } else {
      console.log(list_item["data"]);
      
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.textContent = link;
      a.setAttribute('href', list_item["data"][""]['url']);
      li.appendChild(a);
    }
  
    ul.appendChild(li); 
    
  }
  
  alert(`'${word.text}' was selected!`) 
  
}

function getCallback(callback) {

  return function (word, event) {
    const isActive = callback !== "onWordMouseOut";
    const element = event.target;
    const text = select(element);
    text
      .on("click", () => {
        if (isActive) {
          displayInfo(word); 
        }
      })
      .attr("background", "white")
      .attr("text-decoration", isActive ? "underline" : "none");
  };
  
}


function WordCloud({response}) {
  const router = useRouter()
  const {user} = router.query
  var trimmed_user = user.split('@')[0]
  
  
  if (!isEmpty(response)){
    var keywords = response;
  
    const callbacks = {
      getWordTooltip: (word) =>
        `The ${word.text} appears ${word.value} times.`,
      onWordClick: getCallback("onWordClick"),
      onWordMouseOut: getCallback("onWordMouseOut"),
      onWordMouseOver: getCallback("onWordMouseOver")
    }
    
    const options = {
      colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
      enableTooltip: true,
      deterministic: false,
      fontFamily: "impact",
      fontSizes: [20, 80],
      fontStyle: "normal",
      fontWeight: "normal",
      rotations: 5,
      rotationAngles: [-90, 90],
      scale: "sqrt",
      spiral: "archimedean",
      transitionDuration: 1000
    };
    
    // var cloudWord = response;
    // const reactCloudWords = cloudWord.map(({value, count}) => ({text: value, value: count}));

    var i = 0; 
    for (const keyword in keywords) {
      // console.log(keyword);
      // console.log(keywords[keyword]);
      
      var context = keywords[keyword]; 
      var wordname = context["display_keyword"]; 
      
      reactCloudWords[i] = {"text": context["display_keyword"], "value": context["count"]}
      wordLinks[wordname] = context["links"] 
      
      i ++; 
      
    }
    
    const wordcloudRef = React.createRef();
    
    // const handleSave = () => {
    //       const svgElement = wordcloudRef.current.querySelector('svg');
    //       saveSvgAsPng(svgElement, 'wordcloud.png');
    // };
     
  
    // <pre>{JSON.stringify(wordLinks, null, 2)}</pre>
    
    return (
      
      <>
          <h1> <center> Word Cloud - the collection of keywords </center> </h1>
          <h3> <center> The word cloud is an image composed of keywords in your KIND, in which he size of each word indicates its frequence and importance. </center> </h3>
  
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

          <center>
          <span ref={wordcloudRef}>
          { process.browser && <ReactWordcloud
              callbacks={callbacks}
              options={options}
              words={reactCloudWords}
              size={[$(window).width(), 600]}
              style = {{visibility: "visible"}}
            /> }
          </span>
          </center>
          
          <div id="box" style = {{visibility: "hidden"}}>
            <center> <h2 id="text"> No word selected </h2> </center>
            <ul id="list"> </ul>
            
          </div>
            
        </>
  
  
    );
  } else {
    return (
       <>
          <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
            <Row>
  
                    <row>
                      <h1 style={{marginTop:"120px"}}>No word cloud at this moment</h1>
                    </row>
            </Row>
          </Container>
        </>
      
  
    );
  }

};


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const getServerSideProps = async function ({req,query}) {
  const { user } = query;
  let response = await API.getStaticKeywords({user});

  return {
    props: {response}, // will be passed to the page component as props
  };
}

WordCloud.layout = UserLayout;

export default WordCloud;
export {getServerSideProps}
