import React, { useEffect} from "react";

import { parseCookies } from 'nookies';

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,

} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import {API} from 'api'

import Header from "components/Headers/Header.js";

import { useUser } from "../../hooks/user";

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}


function Tables({response}) {

  var length = response.aggregations.langs.buckets.length;
  console.log("lengthe312321. ",length)
  if (Object.keys(response).length == 0){
    return (
     <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid >
          {/* Table */}
          <Row>
            <div className="col">

              <Card className="shadow">
                <CardHeader className="border-0">
                  <h2 className="mb-0">Sessions</h2>
                </CardHeader>
                <div><h1>No sessions at this moment</h1></div>

              </Card>
            </div>
          </Row>

          
        </Container>
      </>
    

  );
  }
    
  else{
    return (
     <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid >
          {/* Table */}
          <Row>
            <div className="col">

              <Card className="shadow">
                <CardHeader className="border-0">
                  <h2 className="mb-0">Sessions</h2>
                  <h3 className="mb-0">Number of sessions in total {length}</h3>
                </CardHeader>
                
                
                <Table className="align-items-center table-flush" responsive>

                  <thead className="thead-light">
                    <tr>
                      <th scope="col" style={{minWidth: 500,backgroundColor: "#0E3831",color:"#EFEFEF" }}>Session</th>
                      <th scope="col" style={{minWidth: 500 }}>Message Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {response.aggregations.langs.buckets.map(bucket=>{
                          console.log("bucket",bucket);
                          return (
                            <tr>
                              <td style={{minWidth: 500}}>
                                <a href={`./logs/${bucket.key}`}>{bucket.key}</a>
                                </td>
                              <td style={{minWidth: 500}}>{bucket.doc_count}</td>
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
  }
  
  
}


const getServerSideProps = async function ({req}) {
  const { user } = parseCookies({ req });
  console.log("user",user);
  const exist = await API.checkLogIndexExists();
  var response = {};
  console.log("exist",exist);
  if (exist){
    response = await API.getMessageSessions({
      query:{
        "bool":{
          "must":[
            {"match":{"_split_id":0}},
            {"match":{"clientIdentity":user}}]
           }
      },user});
  
  }
 
  
 //console.log("response",response);
 return {
    props: {response}, // will be passed to the page component as props
  };
}

Tables.layout = Admin;

export default Tables;
export {getServerSideProps}