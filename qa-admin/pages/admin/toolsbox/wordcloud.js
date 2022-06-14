import { useEffect } from "react";
import { useRouter } from 'next/router';
// node.js library that concatenates classes (strings)

import { parseCookies } from 'nookies';
import Collapsible from 'react-collapsible';
import { TagCloud } from 'react-tagcloud'
import { useUser } from "../../../hooks/user";
import "../../../assets/css/wordcloud.css";

import {
  Container,
  Button
} from "reactstrap";
// layout for this page
import AdminChild from "layouts/AdminChild.js";
// core components

import {API} from 'api';
import Header from "components/Headers/Header.js";

function Wordcloud({response}) {
  var selected_value = 20;
  var cloudWord = response;
  console.log("response",response);
  const router = useRouter();
  useEffect(async ()=>{
  var user;
  fetch('../../api/user', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    var body = data.user;
    //console.log("user",body);
    if(body != 'Not found'){
      user = body;
    }else{
      //console.log("body",body);
      router.push('../../auth/login');
    }
    
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  })
    const options = {
  luminosity: 'heavy',
  hue: 'blue',
}



return (
         <>
         
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}

            <div style={{"marginTop":"100px",marginLeft:"50px",marginRight:"50px"}}>

            <TagCloud
            minSize={22}
            maxSize={150}
            tags={cloudWord}
            colorOptions={options}
            shuffle={false}
            className="simple-cloud"
            style={{"textAlign":'center',justifyContent: "center", alignItems:"center"}}
            
            /></div>
              <Button 
              style={{width:"200px", height:"100px", backgroundColor: "#0E3831",color:"white",marginTop:"30px","borderRadius":"5px","borderColor":"white",border:"none"}}
              onClick={async (e) => {
                var user = useUser();
                console.log("value",selected_value);
              
                
                API.getFequencyList({user,num:selected_value}).then(res => {
                  if (res){
                    window.confirm("Generate finished");
                    window.location.reload(true);
                  }else{
                    // 500 error
                    window.confirm("Generate failed.");
                }
                  
                });
                
              }}>Generate Word Cloud from all documents
                
              
              </Button>
              <div class="dropdown">

                <select id="wordcloud_dropdown" className="dropdown-content" onChange={async (e) => {

                    var selected = document.getElementById("wordcloud_dropdown");
                    selected_value = Math.round(selected.options[selected.selectedIndex].value);

                  
                }}>
                  <option value={10}>10</option>
                  <option value={20} defaultValue selected>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
            
        </Container>
      </>
    

  );
};


const getServerSideProps = async function ({req}) {
  var { user } = parseCookies({ req });
  var response = await API.getStaticWordFrequency({user});
  //var response = {};
  //console.log("response",response);
  return {
    props: {response}, // will be passed to the page component as props
  };
}

Wordcloud.layout = AdminChild;

export default Wordcloud;
export {getServerSideProps}
