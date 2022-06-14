import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import {
  Card,
  Table,
  Container,
  Row,
  Button
} from "reactstrap";
// layout for this page
import AdminChild from "layouts/AdminChild.js";
// core components
import UserLayout from "layouts/User.js";
import {API} from 'api';
import Header from "components/Headers/Header.js";
function FlashCards({response}) {
    const router = useRouter();
    const {user} = router.query;
    const responseBackup = {response};
    var round = 1;
    var [page, setPage] = useState(cardsPage({response}));
    var [cardSide, setSide] = useState(0);
    var [cardNum, setNum] = useState(0);
    var [firstRound, setFirstRound] = useState(true);
    var [score, setScore] = useState([0,0]);
    var [incorrectList, setIncorrectList] = useState([]); {/*https://www.techiediaries.com/react-usestate-hook-update-array/*/}
    var [incorrectList2, setIncorrectList2] = useState([]); {/* TEMP */}
    var numCards = 0;
    var [page, setPage] = useState(cardsPage);
  
    function updateNumCards(event){
        numCards = event.target.value;
    }
  
    return (
        <>
          <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
          <h1 style={{marginTop:"150px"}}>Enter how many cards you would like to be tested on (max {response.length}):</h1>
              <input style={{marginTop:"30px"}} onChange={updateNumCards}></input>
            
            <Button onClick={()=>cardsPage({response})}>SELECT</Button>
            
            <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
              
            </div>
          </Container>
        </>
    );
    
    
    function flipCard(){
      
      if (cardSide == 0){
        setSide(1);
      }
      else{
        setSide(0);
      }
      
    }
    function switchCard(len, direction){
      
      setSide(0);
      if (direction == 0){
        if (cardNum == 0){
          setNum(len-1);
        }
        else{
          setNum(cardNum-1);
        }
      }
      else if (direction == 1){
        setNum((cardNum+1)%len);
      }
      
    }
    function incorrect(){
      {/*https://www.techiediaries.com/react-usestate-hook-update-array/*/}
      if (round % 2 == 1){
        setIncorrectList([...incorrectList, response[cardNum]]); 
      }
      else{
        setIncorrectList2([...incorrectList2, response[cardNum]]);
      }
      
      setScore([score[0],score[1]+1]);
      removeCard();
    }
    function correct(){
      
      setScore([score[0]+1,score[1]]);
      removeCard();
    }
    function resetIncorrect(){
      
      if (round % 2 == 1){
        if (incorrectList2.length > 0){
          setIncorrectList2([]);
          setScore([0,0])
        }
      }
      else{
        if (incorrectList.length > 0){
          setIncorrectList([]);
          setScore([0,0])
        }
      }
    }
    function removeCard(){
      response.splice(cardNum, 1);
      if (cardNum == response.length){
        setNum(0);
      }
    }
    function notFirstRound(){
      if (firstRound){
        setFirstRound(false);
      }
    }
    
    
    function cardsPage({response}) {
        

        function flashCard(){
          return (
            <>
              {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                  <h1 style={{ marginTop:"150px", display:"flex", justifyContent: "center", alignItems: "center"}}> ROUND {round}</h1>
                  <h2 style={{ marginTop:"0px", display:"flex", justifyContent: "center", alignItems: "center"}}>✕: {score[1]}, ✓: {score[0]} </h2>
                  <h2 style={{ marginTop:"0px", display:"flex", justifyContent: "center", alignItems: "center"}}>(remaining: {response.length}) </h2>
                  {/* Flash Card */}
                  {/* Flash Card */}
                  <div className="col" style={{display:"flex", justifyContent: "center", alignItems: "center"}}> {/*https://dev.to/ayushmanbthakur/different-ways-to-center-a-div-in-a-webpage-5enn#:~:text=For%20that%2C%20we%20can%20use%3A%20margin%3A%200,auto%3B%20to%20center%20the%20card.*/}
                  
                    <Button style={{marginRight: "20px"}} onClick={() => switchCard(response.length, 0)}> PREVIOUS </Button>
                    <Card style={{width:"500px", height:"300px", display:"flex", justifyContent: "center", alignItems: "center"}} onClick={flipCard}>
                    
                      <h1 style={{textAlign:"center"}}> {response[cardNum][cardSide]} </h1>
                      {cardSide == 1 ? <a href={"/static/"+response[cardNum][2]} style={{textAlign:"center"}}> Source </a> : null}
                    
                    
                      <div style={{marginTop: "50px"}}>
                      {cardSide == 1 ? <Button onClick={incorrect}> ✕ </Button> : null}
                      {cardSide == 1 ? <Button onClick={correct}> ✓ </Button> : null}
                      </div>
                    
                    </Card>
                    <Button style={{marginLeft: "20px"}} onClick={() => switchCard(response.length, 1)}> NEXT </Button> 
                    
                  </div>
                  
                  <h2 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> Click on card to flip side</h2>
                  <h3 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> If you correctly guessed the answer, click the ✓ button. Otherwise, click the ✕.</h3>
                  <h3 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> Once you've attempted each card, those you answered incorrectly will reappear.</h3>
                </Container>
            </>
            );
        }
        var trimmed_user = user.split('@')[0];
        if (!isEmpty(response)){
          notFirstRound();
          return (flashCard());
        }else{
          if (firstRound == true){
            return (
             <>
                {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                  {/* Table */}
                  <Row>
                          <row>
                            <h1 style={{marginTop:"120px"}}>No Acronyms at this moment</h1>
                            {firstRound ? <h1> First </h1> : <h1> Not First </h1>}
                          </row>
                          
                  </Row>
                  
                </Container>
              </>
            );
          }
          else {
            if (round % 2 == 1){
              if (isEmpty(incorrectList)){
                response = response.concat(responseBackup);
              }
              else{
                response = response.concat(incorrectList);
              }
            }
            else{
              if (isEmpty(incorrectList2)){
                response = response.concat(responseBackup);
              }
              else{
                response = response.concat(incorrectList2);
              }
            }
            
            resetIncorrect();
            
            round = round + 1;
            return(flashCard());
            
            
            
            
          }
          
        }
    };
    
    
}

// function flipCard({cardSide}){
//   if (cardSide == 0){
    
//   }
// }
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
async function convertDict({response}){
  var new_list = [];
  var key_list = [];
  var i;
  //console.log("response convertDict",response);
  
  for(i of response){
    
    if(!key_list.includes(i[2])){
      key_list.push(i[2]);
      new_list.push([i[2],i[1],i[3]]);
    }
  }
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
const getServerSideProps = async function ({req,query}) {
  const { user } = query;
  let response = await API.getStaticAcronyms({user});
  response = await convertDict({response});
  //console.log("re2",response);
  return {
    props: {response}, // will be passed to the page component as props
  };
}
FlashCards.layout = UserLayout;
export default FlashCards;
export {getServerSideProps}