
import React, { useEffect} from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import UserHeader from "components/Headers/UserHeader.js";
//import AppDAO from "../../db.js";
//var path = "/user-data/user.db";
import {API} from 'api';


function updateUserInfo(email, name){
  console.log("Updating");
  
     fetch('/admin/api/updateInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"email":email,"name":name}),

    })
    .then(response => response.json())
    .then(data => {
        console.log("rescv",data);
        window.confirm("You change will be in effect next time you login in to your account.")
    })
     
   
    
    
     
   
  
}
function Profile() {
  
   useEffect(async ()=>{
     fetch('/admin/api/user', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
       let userInfo = data.user;
       document.getElementById('profileEdiableUserName').defaultValue = userInfo.name;
       document.getElementById('profileEdiableUserEmail').innerText = userInfo.email;
     

    })
     
   })
  
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>

          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow" style={{marginBottom:"100px"}}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      style={{background:"#0E3831"}}
                      
                      onClick={(e) => {e.preventDefault();
                      var email = document.getElementById("profileEdiableUserEmail").innerText;
                      var name = document.getElementById("profileEdiableUserName").value;
        
                      updateUserInfo(email, name);}}
                      size="sm"
                    >
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                            
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue=""
                            id="profileEdiableUserName"
                            placeholder="Username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            User ID (Not modifiable)
                          </label>
                          <p
                            style={{marginTop:"10px"}}
                            id="profileEdiableUserEmail"

                          ></p>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>
              
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Profile.layout = Admin;

export default Profile;
