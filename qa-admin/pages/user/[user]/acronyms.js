import React, { useEffect } from "react";
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

function Acronyms({response}) {
const router = useRouter()
const {user} = router.query

var trimmed_user = user.split('@')[0]
if (!isEmpty(response)){
  return (
     <>

        {/* Page content */}
        <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
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
          
        </Container>
      </>
    

  );
}else{
  return (
     <>

        {/* Page content */}
        <Container className="mt--7" fluid style={{backgroundColor:"EFEFEF"}}>
          {/* Table */}
          <Row>

                  <row>
                    <h1 style={{marginTop:"120px"}}>No Acronyms at this moment</h1>
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

Acronyms.layout = UserLayout;

export default Acronyms;
export {getServerSideProps}
