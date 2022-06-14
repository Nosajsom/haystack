import  { useEffect} from "react";

import { parseCookies } from 'nookies';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,

  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,

  Table,
  Container,
  Row,

} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import {API} from 'api'
import App from 'pages/upload/upload_file.js'
import Header from "components/Headers/Header.js";

import { useUser } from "../../hooks/user";
import "../../assets/css/rename.css";


function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}


function Tables({response}) {
  var fileNum = response.hits.hits.length;
  var user = useUser();
  var selectedDocument;
  var newName;
    
  response.hits.hits.sort(function (a, b) {
    // console.log("sorted");
    if (a._source.name && b._source.name){
      return a._source.name.localeCompare(b._source.name);
    }
    
  });
  
  
    useEffect(async ()=>{
        var array = Array.prototype.slice.call( document.getElementsByClassName('dropdowns') );
        array.forEach(element => element.style.visibility = 'visible');
    })
  
  


  return (
     <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row  style={{marginTop:"150px"}}>
            <div className="col">

              <Card className="shadow">
                <CardHeader className="border-0" style={{}}>

                  <h4>Total number of files: {fileNum}</h4>
                </CardHeader>
                
                
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" style={{minWidth: 300,backgroundColor: "#0E3831",color:"#EFEFEF" }}>File Name</th>
                      <th scope="col" style={{minWidth: 600 }}>File Content</th>
                      <th scope="col" style={{minWidth: 200,backgroundColor: "#0E3831",color:"#EFEFEF" }}>Upload Time</th>
                      <th scope="col" style={{minWidth: 50 }}>Link</th>
                      
  
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    
                      {response.hits.hits.map(d=>{
                          var source = "/static/"+d._source.file_path
                          return (

                            <tr key={"outerfile"+d._source.name}>
                              <td style={{minWidth: 300,}}>{d._source.name}</td>
                              <td style={{minWidth: 600}}>{d._source.text.slice(0,100)}</td>
                              <td style={{minWidth: 200}}>{d._source.added_time}</td>
                              <td style={{minWidth: 50}}><a href={source} target="_blank" rel="noopener noreferrer">Link</a></td>
                              
                              <td className="text-right">
                              <div
                                className="dropdowns"
                                style = {{"visibility":"hidden"}}
                              >
                              <UncontrolledDropdown 

                              >
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  style={{paddingRight:"0px"}}
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow" right>

                                  <DropdownItem
                                      href="#pablo"
                                      onClick={async (e) => {
                                        e.preventDefault()
                                        API.deleteDocumentByName({name:d._source.name,user})
                                        .then(res => {
                                          //console.log("clident delete",res);
                                          console.log("Delete file "+d._source.name+" success");
                                          wait(1000);
                                          window.location.reload(true);
                                          
                                        })

                                    }}
                                  >
                                    Delete file (All splited documents)
                                  </DropdownItem>
                                  <DropdownItem
                                      href="#pablo"
                                      onClick={async (e) => {
                                        e.preventDefault()
                                        document.getElementById("renameFormContainer").style.display = "block";
                                        selectedDocument = d._source.name;

                                    }}
                                  >
                                    Rename file
                                  </DropdownItem>

                                </DropdownMenu>
                              </UncontrolledDropdown>
                              </div>

                            </td></tr>
                        )})}
                    
                  </tbody>
                </Table>
                
                <div id="renameFormContainer" className="form-popup" style={{display:"none"}}>
                  <button style={{"width":25,"height":25}}onClick={async(e)=>{
                    e.preventDefault()
                    document.getElementById("renameFormContainer").style.display = "none";
                    console.log("hid");
                  }}>x</button>
                  <form id="renameForm" className="form-container">
                   <h1>Rename</h1>

                    <label for="newname"></label>
                    <input type="text" id="renameInput" placeholder="Enter New Name" name="newname" onChange={(e)=>{
                      newName = e.target.value;
                    }} required></input>
                
                    <button onClick={async(e)=>{
                      e.preventDefault()
                      console.log("new name",newName);
                      if (newName && selectedDocument){
                        
                        API.updateFileName({oldname:selectedDocument,newname:newName,user:user}).then(res=>{
                          wait(1000);
                          window.location.reload(true);
                        })
                      }
                      
                      
                      
                    }}>submit</button>
                  </form>
                
                
                
                </div>

              </Card>
              <Button
              style={{width:"200px", height:"100px", backgroundColor: "#0E3831",color:"#EFEFEF",marginTop:"30px","borderRadius":"5px","borderColor":"white",border:"none"}}
              onClick={async (e) => {

                API.updateHTML({user}).then(res => {
                  //console.log("Client response",res);
                  if (Object.keys(res).includes("200")){
                    window.confirm("Update finished");
                    window.location.reload(true);
                  }else{
                    // 500 error
                    window.confirm("Update failed.");

                  }
                });
                }
              }
              >
              Update all HTML files
              </Button>
            </div>
          </Row>
          <App></App>
          
        </Container>
      </>
    

  );
  
}


const getServerSideProps = async function ({req}) {
  const { user } = parseCookies({ req });
  const response = await API.searchDocuments({
      query:{
        "bool":{
          "must":[
            {"match":{"_split_id":0}},
            {"match":{"clientIdentity":user}}]
           }
      },user})
  
  console.log("response in tables",response);


  
  

 return {
    props: {response}, // will be passed to the page component as props
  };
}

Tables.layout = Admin;

export default Tables;
export {getServerSideProps}