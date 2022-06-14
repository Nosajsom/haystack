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
        
        // console.log("PROPS: ", props.response);
        
        this.flipCard = this.flipCard.bind(this);
        this.numPrompt = this.numPrompt.bind(this);
        this.cardsPage = this.cardsPage.bind(this);
        this.confirmPressed = this.confirmPressed.bind(this);
        this.cardResult = this.cardResult.bind(this);
        this.switchCard = this.switchCard.bind(this);
        this.winScreen = this.winScreen.bind(this);
        this.reset = this.reset.bind(this);
        
        
        this.state = {
            response: props.response,
            responseBackup: [...props.response],
            incorrectList: [],
            numCards: props.response.length,
            page: 0,
            round: 1,
            firstRound: true,
            score: [0,0],
            cardNum: 0,
            cardSide: 0
        }
    }
    
    numPrompt(){
        console.log("PROMPT--------------");
        return(
            <>
                {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                    <div style={{position: 'absolute', left: '50%', top: '20%', transform: 'translate(-50%, -50%)', textAlign:"center"}}> {/*https://stackoverflow.com/questions/52284288/how-to-vertically-and-horizontally-center-a-component-in-react*/}
                        <h1>Enter how many cards you would like to be tested on (max {this.state.response.length}):</h1>
                        <input onChange={(event)=>this.inputChanged(event)}></input>
                        <Button style={{marginLeft:"10px"}} onClick={this.confirmPressed}>CONFIRM</Button>
                    </div>
                    
                </Container>
            </>
            
        )
    }

    inputChanged(event){
        var value = event.target.value;
        
        if (value > this.state.response.length){
            value = this.state.response.length;
        }
        
        this.setState({numCards: value})
    }

    confirmPressed(){
        
        var pos;
        var responseCopy = [...this.state.response];
        var newResponse = [];
        
        for (let i=0; i < this.state.numCards; i++){
            pos = Math.floor(Math.random() * responseCopy.length);
        
            newResponse.push(responseCopy[pos]);
            responseCopy.splice(pos, 1);
        }
        
        this.setState({page: 1, response:newResponse});
    }

    cardResult(result){
        
        var card = this.state.response[this.state.cardNum];
        var newResponse = [...this.state.response];
        newResponse.splice(this.state.cardNum, 1);
        
        var newCardNum = this.state.cardNum;
        if (this.state.cardNum == this.state.response.length-1){
            newCardNum = 0;
        }
        
        if (result=="correct"){
            this.setState({score: [this.state.score[0]+1, this.state.score[1]], response: newResponse, cardNum: newCardNum});
        }
        else if (result=="incorrect"){
            this.setState({score: [this.state.score[0], this.state.score[1]+1], response: newResponse, cardNum: newCardNum, incorrectList: [...this.state.incorrectList, card]});
        }
    }
    
    cardsPage(){
        
        if (this.state.firstRound){
            this.setState({firstRound: false});
        }
        
        const topStyle = {marginTop:"150px", display:"flex", justifyContent: "center", alignItems: "center"};
        const subStyle = {marginTop:"0px", display:"flex", justifyContent: "center", alignItems: "center"};
        const cardStyle = {marginTop:"30px", display:"flex", justifyContent: "center", alignItems: "center"};

        return(
            <>
                {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                        <h1 style={topStyle}>ROUND {this.state.round}</h1>
                        <h2 style={subStyle}>✕: {this.state.score[1]}, ✓: {this.state.score[0]}</h2>
                        <h2 style={subStyle}>(remaining: {this.state.response.length})</h2>
                        
                        <div className="col" style={subStyle}>
                        
                            <Button style={{marginRight: "20px", width:"100px", display:"flex", justifyContent: "center", alignItems: "center"}} onClick={() => this.switchCard("left")}> PREVIOUS </Button>
                            <Card style={{...cardStyle}, {width:"500px", height:"300px", textAlign:"center", flexDirection:"column"}} onClick={this.flipCard}>
                                
                                <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign:"center"}}>
                                <h1> {this.state.response[this.state.cardNum][this.state.cardSide]} </h1>
                                {this.state.cardSide == 1 ? <a href={"/static/"+this.state.response[this.state.cardNum][2]}> Source </a> : null}

                                <div style={{marginTop:"20px"}}>
                                    {this.state.cardSide == 1 ? <Button onClick={() => this.cardResult("incorrect")}> ✕ </Button> : null}
                                    {this.state.cardSide == 1 ? <Button onClick={() => this.cardResult("correct")}> ✓ </Button> : null}
                                </div>
                                </div>
                            
                            </Card>
                            <Button style={{...subStyle}, {marginLeft: "20px", width:"100px"}} onClick={() => this.switchCard("right")}> NEXT </Button>
                        </div>
                        <h2 style={cardStyle}> Click on card to flip side</h2>
                        <h3 style={cardStyle}> If you correctly guessed the answer, click the ✓ button. Otherwise, click the ✕.</h3>
                        <h3 style={cardStyle}> Once you've attempted each card, those you answered incorrectly will reappear.</h3>
                </Container>
            </>
            )
    }
    
    noCardsPage(){
        return(
            <>
                {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
                        <h1 style={{marginTop:"120px", position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', textAlign:"center"}}>No Acronyms at this moment</h1>
                </Container>
            </>
            
        )
    }
    
    winScreen(){
        return(
            <>
                {/* Page content */}
                <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF", position: 'absolute', left: '50%', top: '20%', transform: 'translate(-50%, -50%)', textAlign:"center"}}>
                    throw Error("You win!");
                        <h1 style={{marginTop:"120px"}}>Congratulations!</h1>
                        <Button onClick={this.reset}>Start Over</Button>
                </Container>
            </>
            
        );
    }
    
    reset(){
        this.setState({
            round: 1,
            response: this.state.responseBackup,
            page: 0,
            score: [0, 0]
        });
    }
    
    flipCard(){
        if (this.state.cardSide == 0){
            this.setState({cardSide: 1});
            console.log("THING: 0");
        }
        else{
            this.setState({cardSide: 0});
            console.log("THING: 1");
        }
    }
    
    switchCard(direction){
        
        if (direction == "left"){
            if (this.state.cardNum == 0){
                this.setState({cardNum: this.state.response.length-1, cardSide:0});
            }
            else{
                this.setState({cardNum: this.state.cardNum-1, cardSide:0});
            }
        }
        else if (direction == "right"){
            this.setState({cardNum: (this.state.cardNum+1)%this.state.response.length, cardSide:0});
        }
      
    }
    
    
    render(){
        if (this.state.page == 0){
            return this.numPrompt();
        }
        else if (this.state.page == 1){
            
            if (this.state.response.length != 0){
                return this.cardsPage();
                
            }
            else{
                if (this.state.firstRound){
                    return this.noCardsPage();   
                }
                else{
                    
                    if (this.state.incorrectList.length == 0){
                        this.setState({page: 2});
                    }
                    else{
                        this.setState({
                        round: this.state.round+1,
                        response: [...this.state.incorrectList],
                        score: [0, 0],
                        incorrectList: []
                    });
                    }
                    
                    return null;
                }
            }
            
        }
        else if (this.state.page == 2){
            return this.winScreen();
        }
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