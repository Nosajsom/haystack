import React from "react";
import { useRouter } from 'next/router';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
//import AppDAO from "../../db.js";

function Login() {
  var email, password;
  var bcrypt = require('bcryptjs');
  var path = "/user-data/user.db";
  const router = useRouter();

  
  function loginSubmit() {
    
    // Load hash from your password DB.
    
    if (email && password) {
      
      try{

        var data = {"email":email};
        fetch('/admin/api/db', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          
          if (data && data != {} && Object.keys(data).length != 0){
            console.log("This user exists");
            var user = data.hash
            var hash = user.password;
            bcrypt.compare(password, hash, function(err, res) {
              console.log("result",res);
              if(res === true){
                fetch('/admin/api/login', {
                  method: 'POST', // or 'PUT'
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({"name":user.name, "email":email, "admin":user.admin}),
                })
                .then(response => response.json())
                .then(data => {
                  console.log('Success:', data);
                  router.push('/admin/dashboard');
          
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
              }
            });
          }
          else{
            window.confirm("Password not correct or user does not exist. Try again.")
          }
          
  
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        
      
        


      } catch(e){
          // means the table exists
          console.error(e);
          
      }


      
    }
  }
  return (
    <>

      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-20">

          <CardBody className="px-lg-5 py-lg-5" >
            <div className="text-center text-muted mb-4" >
              <h3>SIGN IN</h3>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="User"
                    type="email"
                    autoComplete="new-email"
                    onChange={(e)=>email = e.target.value}

                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e)=>password = e.target.value}

                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center" >
                <Button  style={{background:"#0E3831",color:"white"}} type="button" onClick={loginSubmit}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Login.layout = Auth;

export default Login;
