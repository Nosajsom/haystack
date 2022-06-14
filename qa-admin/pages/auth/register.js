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
import {API} from 'api';
import Auth from "layouts/Auth.js";
function Register() {
  const router = useRouter()
  var bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);
  
  var email, password, name,adminCode;
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  function usernameIsValid(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
  }
  
  function validateForm() {
    console.log("validate",email, password, name);
    if (email && password && name){
      var letter = document.getElementById("letter");
      var capital = document.getElementById("capital");
      var number = document.getElementById("number");
      var length = document.getElementById("length");
      var passvalid = false;
      if (letter.classList.contains("valid") && 
          capital.classList.contains("valid") &&
          number.classList.contains("valid") &&
          length.classList.contains("valid") ){
            passvalid = true;
      }
      return passvalid //&& usernameIsValid(name);
    }else{
      return false;
    }
    
  }


          // When the user starts to type something inside the password field
       function validate() {
          console.log("validating");
          var myInput = document.getElementById("psw");
          var letter = document.getElementById("letter");
          var capital = document.getElementById("capital");
          var number = document.getElementById("number");
          var length = document.getElementById("length");
          // Validate lowercase letters
          var lowerCaseLetters = /[a-z]/g;
          if(myInput.value.match(lowerCaseLetters)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
          } else {
            console.log("Invalid lowerCase")
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }
        
          // Validate capital letters
          var upperCaseLetters = /[A-Z]/g;
          if(myInput.value.match(upperCaseLetters)) {
            capital.classList.remove("invalid");
            capital.classList.add("valid");
          } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
          }
        
          // Validate numbers
          var numbers = /[0-9]/g;
          if(myInput.value.match(numbers)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
          } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
          }
        
          // Validate length
          if(myInput.value.length >= 8) {
            length.classList.remove("invalid");
            length.classList.add("valid");
          } else {
            console.log("Invalid length");
            length.classList.remove("valid");
            length.classList.add("invalid");
            console.log("length",length);
          }
        }
      
      
  
  

  function submitInfo(){
    if (!validateForm()){
      console.log("not valid");
      window.confirm("Information invalid, please try again.");
    }else{

      var admin = false;

      // if (adminCode == "123"){
        admin = true;
      // }
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            var data = {
              "name":name,
              "password":hash,
              "email":email,
              "admin":admin
      
            }
            //console.log("data",data);
            fetch('/admin/api/register', {
              method: 'POST', // or 'PUT'
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data2 => {
              console.log('Success:', data2);
              var email = data.email;
              console.log('email2:', email);
              API.addAvailableUser({email}).then(res3 => {console.log("res3",res3);})
              
              
              
              

              router.push('/auth/login');
              document.getElementById("registerSubmitButton").submit();
      
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
      });
      
      
      
    }
  }

  return (

    <div>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0" style={{width:"fit-content"}}>

          <CardBody className="px-lg-5 py-lg-5" style={{minWidth:"400px"}}>
            <div className="text-center text-muted mb-4">
              <small>Sign up with credentials</small>
            </div>
            <Form role="form" >
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Display name" type="text" onChange={(e)=>name = e.target.value} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="User defined ID"
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
                  
                    id="psw" name="psw"
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e)=>password = e.target.value}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
                    onFocus={(e)=> document.getElementById("message").style.display = "block"}
                    onBlur={(e)=>document.getElementById("message").style.display = "none"}
                    onKeyUp={(e)=>validate()}
                    
                    required 
                  />
                </InputGroup>
              </FormGroup>
              {/* <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Admin code (Optional)"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e)=>adminCode = e.target.value}
                  />
                </InputGroup>
              </FormGroup> */}


              <div className="text-center">
                <Button id="registerSubmitButton" className="mt-4" style={{background:"#0E3831",color:"white"}} type="button" onClick={submitInfo}>
                  Create account
                </Button>
              </div>
            </Form>
            <div id="message">
              <h3>Password must contain the following:</h3>
              <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
              <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
              <p id="number" className="invalid">A <b>number</b></p>
              <p id="length" className="invalid">Minimum <b>8 characters</b></p>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}


Register.layout = Auth;

export default Register;
