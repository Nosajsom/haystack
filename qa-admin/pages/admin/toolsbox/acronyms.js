import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import {
  Button,
  Card,
  Table,
  Container,
  Row,
} from "reactstrap";
// layout for this page
import AdminChild from "layouts/AdminChild.js";
// core components

import {API} from 'api';
import Header from "components/Headers/Header.js";
import { useUser } from "../../../hooks/user";
function Acronyms({response}) {

  const router = useRouter();
  useEffect(async ()=>{

  fetch('../../api/user', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    var body = data.user;
    //console.log("user",body);
    if(body != 'Not found'){
      let user = body;
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
        <Container className="mt--7" fluid >
          {/* Table */}
          <Row>
            <div className="col" style={{marginTop:"150px"}}>

              <Card className="shadow">
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th className="w-25" style={{minWidth: 80,backgroundColor: "#0E3831",color:"#EFEFEF" }}>Acronyms</th>
                      <th className="w-50" style={{minWidth: 60 }}>Text</th>
                      <th className="w-25" style={{minWidth: 40,backgroundColor: "#0E3831",color:"#EFEFEF"  }}>Link</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    
                      {
                      
                      response.map(d=>{
                          var source = "/static/"+d[2]
                          return (

           
                           
                            <tr key={"outerfile"+d[0]+d[1]}>
                              <td style={{minWidth: 80,width:80,borderRight: "1px solid #f0f0f0"}}>{d[0]}</td>
                              <td style={{minWidth: 60,width:120,borderRight: "1px solid #f0f0f0"}}>{d[1]}</td>
                              <td style={{minWidth: 40}}><a href={source} target="_blank" rel="noopener noreferrer">Link</a></td>
                            </tr>

                        )})}
                    
                  </tbody>
                </Table>

              </Card>
              
            </div>
          </Row>
          <div>
              <Button 
              style={{width:"200px", height:"100px", backgroundColor: "#0E3831",color:"#EFEFEF",marginTop:"30px","borderRadius":"5px","borderColor":"white",border:"none"}}
              onClick={async (e) => {
                var user = useUser();
                API.getAcronyms({user}).then(res => {
                  if (res){
                    window.confirm("Generate finished");
                    window.location.reload(true);
                  }else{
                    // 500 error
                    window.confirm("Generate failed.");
                }
                  
                });
                
              }}>Generate Acronyms from all documents
                
              
              </Button>
            </div>
          
        </Container>
      </>
    

  );
};

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
const getServerSideProps = async function ({req}) {
  let { user } = parseCookies({ req });
  let response = await API.getStaticAcronyms({user});
  response = await convertDict({response});
  //console.log("re2",response);
  return {
    props: {response}, // will be passed to the page component as props
  };
}

Acronyms.layout = AdminChild;

export default Acronyms;
export {getServerSideProps}
