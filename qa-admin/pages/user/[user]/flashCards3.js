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

class FlashCards extends React.Component{
    constructor(props){
        super(props);
        
        
        this.state = {
            response: props,
            round: 0,
            firstRound: true,
            score: [0,0],
            cardNum: 0,
            cardSide: 0
        }
    }
    
    flipCard(){
      
      if (this.cardSide == 0){
        setSide(1);
      }
      else{
        setSide(0);
      }
      
    }
    switchCard(len, direction){
      
      setSide(0);
      if (direction == 0){
        if (this.cardNum == 0){
          setNum(len-1);
        }
        else{
          setNum(this.cardNum-1);
        }
      }
      else if (direction == 1){
        setNum((this.cardNum+1)%len);
      }
      
    }
    incorrect(){
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
    correct(){
      
      setScore([score[0]+1,score[1]]);
      removeCard();
    }
    resetIncorrect(){
      
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
    removeCard(){
      response.splice(cardNum, 1);
      if (cardNum == response.length){
        setNum(0);
      }
    }
    notFirstRound(){
      if (firstRound){
        setFirstRound(false);
      }
    }
    
    render(){
        return(
            <>
              {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                  <h1 style={{ marginTop:"150px", display:"flex", justifyContent: "center", alignItems: "center"}}> ROUND {this.round}</h1>
                  <h2 style={{ marginTop:"0px", display:"flex", justifyContent: "center", alignItems: "center"}}>✕: {this.score[1]}, ✓: {this.score[0]} </h2>
                  <h2 style={{ marginTop:"0px", display:"flex", justifyContent: "center", alignItems: "center"}}>(remaining: {this.response.length}) </h2>
                  {/* Flash Card */}
                  {/* Flash Card */}
                  <div className="col" style={{display:"flex", justifyContent: "center", alignItems: "center"}}> {/*https://dev.to/ayushmanbthakur/different-ways-to-center-a-div-in-a-webpage-5enn#:~:text=For%20that%2C%20we%20can%20use%3A%20margin%3A%200,auto%3B%20to%20center%20the%20card.*/}
                  
                    <Button style={{marginRight: "20px"}} onClick={() => switchCard(this.response.length, 0)}> PREVIOUS </Button>
                    <Card style={{width:"500px", height:"300px", display:"flex", justifyContent: "center", alignItems: "center"}} onClick={flipCard}>
                    
                      <h1 style={{textAlign:"center"}}> {this.response[this.cardNum][this.cardSide]} </h1>
                      {this.cardSide == 1 ? <a href={"/static/"+this.response[this.cardNum][2]} style={{textAlign:"center"}}> Source </a> : null}
                    
                    
                      <div style={{marginTop: "50px"}}>
                      {this.cardSide == 1 ? <Button onClick={incorrect}> ✕ </Button> : null}
                      {this.cardSide == 1 ? <Button onClick={correct}> ✓ </Button> : null}
                      </div>
                    
                    </Card>
                    <Button style={{marginLeft: "20px"}} onClick={() => switchCard(this.response.length, 1)}> NEXT </Button> 
                    
                  </div>
                  
                  <h2 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> Click on card to flip side</h2>
                  <h3 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> If you correctly guessed the answer, click the ✓ button. Otherwise, click the ✕.</h3>
                  <h3 style={{ marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}> Once you've attempted each card, those you answered incorrectly will reappear.</h3>
                </Container>
            </>
            
            )
    }
}
















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