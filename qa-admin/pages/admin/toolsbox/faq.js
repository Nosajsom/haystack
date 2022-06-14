import { useEffect } from "react";
import { useRouter } from 'next/router';
// node.js library that concatenates classes (strings)

import { parseCookies } from 'nookies';
import Collapsible from 'react-collapsible';

import {
  Container,
} from "reactstrap";
// layout for this page
import AdminChild from "layouts/AdminChild.js";
// core components

import {API} from 'api';
import Header from "components/Headers/Header.js";

function Faq({response}) {

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

return (
         <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
            <div style={{marginTop:"200px",width:"100%",marginBottom:"200px",background:"white"}}>
              {response.map(d=>{
                var key = d.question;
                if (d.question.length>=20){
                  key = d.question.slice(0,20);
                }
                return (
                  <div key={key} style={{"borderStyle": "solid", "borderColor":"grey", "borderWidth":"1px"}}>
                  <Collapsible trigger={d.question} triggerStyle={{background:"#f0f0f0", padding:"10px",width:"100%", borderRadius:"4px",border:"2px",borderColor:"black","white-space": "pre-line"}} triggerTagName="div">

                    <p style={{background:"white",width:"100%", padding:"10px","whiteSpace": "pre-line"  }}>
                      {d.answer}
                    </p>
                  
                  </Collapsible>
                  </div>
              )})}
            </div>
        </Container>
      </>
    

  );
};


const getServerSideProps = async function ({req}) {
  var { user } = parseCookies({ req });
  var response = await API.getFaqs({user});
  return {
    props: {response}, // will be passed to the page component as props
  };
}

Faq.layout = AdminChild;

export default Faq;
export {getServerSideProps}
