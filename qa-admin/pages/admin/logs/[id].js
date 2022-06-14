

// reactstrap components
import {
  Badge,
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




function Tables({response}) {
  const feedbackMap ={
    '-1':<img style={{ width: '3rem'}} src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f626.svg"></img>,
    '0':<img style={{ width: '3rem'}} src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f610.svg"></img>,
    '1':<img style={{ width: '3rem'}} src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f600.svg"></img>,
  }

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
                  <h2 className="mb-0">Session Chat Log</h2>
                </CardHeader>
                
                
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" style={{minWidth: 200,backgroundColor: "#0E3831" }}>User</th>
                      <th scope="col" style={{minWidth: 500 }}>Message</th>
                      <th scope="col" style={{minWidth: 100,backgroundColor: "#0E3831" }}>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {response.hits.hits.map(hit=>{
                          return (
                            <tr>
                              <td style={{minWidth: 200}}>
                                {hit._source.userId==="aibot"?<><img style={{ width: '2rem'}} src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f920.svg"></img> (AI)</>:'User'
                                }</td>
                              <td style={{minWidth: 500}}>{hit._source.message}</td>
                              <td style={{minWidth: 100}}>{feedbackMap[hit._source.feedback]}</td>
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


const getServerSideProps = async function ({req,query}) {
  const { id } = query;
  const response = await API.searchDocuments({
      index:'message-log',
      sort: {'date':{'type':'long','direction':'asc'}},
      query:{
		"match_phrase_prefix": {
			"chatId": {
				"query": id
			},
		}
  }})
  return {
    props: {response}, // will be passed to the page component as props
  };
}

Tables.layout = Admin;

export default Tables;
export {getServerSideProps}