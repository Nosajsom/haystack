import { useEffect } from "react";
import { useRouter } from 'next/router';
// node.js library that concatenates classes (strings)

import Collapsible from 'react-collapsible';

import {
  Container,
  Row,
  Button
} from "reactstrap";
// layout for this page
// core components

import {API} from 'api';
import UserLayout from "layouts/User.js";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function Faq({response}) {
const router = useRouter()
const {user} = router.query
var trimmed_user = user.split('@')[0]
// console.log("res3",response);
if (!isEmpty(response)){
    return (
         <>
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}

            <div style={{marginTop:"200px",width:"100%",marginBottom:"200px",background:"white"}}>
        
              {
                response.map(d=>{
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
}else{
    console.log("hereryguad");
    return (
         <>
            {/* Page content */}
            <Container className="mt--7" fluid>
              {/* Table */}
              <row>


                <h1 style={{marginTop:"120px"}}>No FAQs at this moment</h1>
              </row>
                <Row style={{marginTop:"20px",marginLeft:"20px"}}>
                  <Button href="/demo/379/">Back</Button>
                </Row>
                
                
                
                
            </Container>
          </>
    

  );
}

};


const getServerSideProps = async function ({req,query}) {
  const { user } = query;
  var response = await API.getStaticFaqs({ user });
  // console.log("response",response);
  return {
    props: {response}, // will be passed to the page component as props
  };
}

Faq.layout = UserLayout;

export default Faq;
export {getServerSideProps}
