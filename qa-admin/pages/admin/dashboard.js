import React, { useEffect } from "react";
import { useRouter } from 'next/router';
// node.js library that concatenates classes (strings)
import classnames from "classnames";
import { parseCookies } from 'nookies';
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Bar ,Pie} from "react-chartjs-2";
import Collapsible from 'react-collapsible';
import {API} from 'api';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import { useUser } from "../../hooks/user";


import Header from "components/Headers/Header.js";

function Dashboard({response}) {

  const user = useUser();
  console.log("dashboard user",user);
 
  const router = useRouter();
  console.log(response);
  useEffect(async ()=>{
   
    

  
  var user;
  fetch('/admin/api/user', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    var body = data.user;
    if(body != 'Not found'){
      user = body;
    }else{
      console.log("body",body);
      router.push('../auth/login');
    }
    
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  })
  
  const documentOptions = {
     indexAxis: 'y',
     type: 'bar',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      
      scales: {
        xAxes: [{
            ticks: {
                fontSize: 10
            }
        }],        
        yAxes: [{
            ticks: {
                fontSize: 12
            }
        }]
      },
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Chart.js Horizontal Bar Chart',
        },
      },
  };
  const feedbackOptions = {

     type: 'pie',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide

      scales: {
        xAxes: [{
            ticks: {
                fontSize: 10
            }
        }],        
        yAxes: [{
            ticks: {
                fontSize: 12
            }
        }]
      },
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Chart.js Horizontal Bar Chart',
        },
      },
  };
  const documentData = {
    labels: response.document_list[0],
    datasets: [
      {
        label: 'File appearance in AI assistant',
        data: response.document_list[1],
        borderWidth: 2,
      },
    ],
  };
  
    

  const feedbackData = {
    labels: response.feedbackSplitList[0],
    datasets: [
      {
        label: 'Feedback',
        data: response.feedbackSplitList[1],
        
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      },
    ],
  };
  var question_amount = response.question_list.length;
  var question_title = "User searched questions ("+question_amount+" unique questions) (click to unfold)";
 

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Button href={`/demo/`}>Question & Answering Assistant</Button>
        <Button href={`/admin/user/${user}`}>Public Page</Button>
          <div style={{marginTop:"150px",marginBottom:"150px"}}>
          <Collapsible trigger={question_title} triggerStyle={{background:"#f0f0f0", padding:"10px",width:"100%", borderRadius:"4px",border:"2px",borderColor:"black","white-space": "pre-line"}} triggerTagName="div">

          {response.question_list.map(d=>{
            return (

              <p style={{backgroundColor:"white"}}>
                {d}
              </p>

            )
            
            })
            
          }
          </Collapsible>
        
        
        </div>
        <div style={{marginTop:"150px"}}>
        
        <Bar
        	data={ documentData}


        	options={documentOptions }
        />

        </div>
        <div style={{marginTop:"150px"}}>
        
        <Pie
          data={feedbackData}/>

        </div>

        





      </Container>
    </>
  );
};
async function convertDict({response}){
  var new_list = [];


  new_list.sort(sortFunction);

  function sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
  }
  return new_list;
}
Dashboard.layout = Admin;

export default Dashboard;
function splitList(listToBeSplit){
  let labelList = []
  let dataList = []
  for (var i of listToBeSplit){
    labelList.push(i[0])
    dataList.push(i[1])
  }
  return [labelList,dataList]
  
}
function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}
const getServerSideProps = async function ({req}) {
  const { user } = parseCookies({ req });
  //console.log("user0",user);
  var exist = await API.checkLogIndexExists({});
  if (!exist){
    var response = {"document_list":[],"question_list":[],"feedbackSplitList":[]};
      return {
    props: {response}, // will be passed to the page component as props
  };
  }
  var resp = await API.getAllMessageLog({user});

  var hits2 = resp.hits.hits;
  var question_list = []
  var answer_document_dict = {}
  var answer_document_list = []

  var answerFeedbackList = [];
  var answerFeedbackDict = {"negative":0,"neutral":0,"positive":0,"noResponse":0,"bot_gives_not_sure":0};
  for (var i of hits2){
      //get all questions asked by the users
      //console.log(i._source)
      if(i._source.userId != "aibot"){
          //means a user asked this question
          question_list.push(i._source.message)
      }else if("answerData" in i._source){
          var doc_name = i._source.answerData.meta.name
          if (doc_name in answer_document_dict){
              answer_document_dict[doc_name] +=1

          }else{
              answer_document_dict[doc_name] = 1
          }
          if (!i._source.message.includes("I am not sure")){
              
            
            if ("feedback" in i._source){
              // Means the user marked this answer
              if (i._source.feedback == 1){
                answerFeedbackDict.positive +=1;
                
              }else if (i._source.feedback==0){
                answerFeedbackDict.neutral+=1;
              }else{
                answerFeedbackDict.negative+=1;
              }

            }else{
  
              answerFeedbackDict.noResponse += 1;
              
            }

            
          }else{
            answerFeedbackDict.bot_gives_not_sure +=1;
          }
          
      
  
  }}
  question_list = [...new Set(question_list)];
  console.log("question list",question_list)
  //console.log("response list",answerFeedbackDict);

  for (var k of Object.keys(answer_document_dict)){
    answer_document_list.push([k,answer_document_dict[k]]);
  }
  answer_document_list.sort(sortFunction);
  
  for (var k of Object.keys(answerFeedbackDict)){
    answerFeedbackList.push([k,answerFeedbackDict[k]]);
  }


  var documentSplitList = splitList(answer_document_list);
  console.log("answer",answerFeedbackList);
  var feedbackSplitList = splitList(answerFeedbackList)

  var response = {"document_list":documentSplitList,"question_list":question_list,"feedbackSplitList":feedbackSplitList};

  //console.log("re2",response);
  return {
    props: {response}, // will be passed to the page component as props
  };
}

export {getServerSideProps}