import { useEffect } from "react";
import { useRouter } from 'next/router';

// reactstrap components
import {
  Button,
  Container
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import Header from "components/Headers/Header.js";

const Toolsbox = (props) => {

  const router = useRouter();
  useEffect(async ()=>{

  fetch('../api/user', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    var body = data.user;
    if(body != 'Not found'){
      let user = body;
    }else{
      console.log("body",body);
      router.push('../auth/login');
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
      <div style={{marginTop:"120px"}}>
        <Button href="/admin/admin/toolsbox/acronyms" style={{padding:"50px", margin:"10px",backgroundColor: "#0E3831",color:"#EFEFEF",fontSize:"16px"}}>Generate<br/>Acronyms</Button>
        <Button href="/admin/admin/toolsbox/faq"style={{padding:"50px", margin:"10px",backgroundColor: "#0E3831",color:"#EFEFEF",fontSize:"16px"}}>Generate<br/>FAQs</Button>
        <Button href="/admin/admin/toolsbox/keywords"style={{padding:"50px", margin:"10px",backgroundColor: "#0E3831",color:"#EFEFEF",fontSize:"16px"}}>Generate<br/>Keywords</Button>
        <Button href="/admin/admin/toolsbox/wordcloud"style={{padding:"50px", margin:"10px",backgroundColor: "#0E3831",color:"#EFEFEF",fontSize:"16px"}}>Generate<br/>Word Cloud</Button>
      </div>
      </Container>
    </>
  );
};

Toolsbox.layout = Admin;

export default Toolsbox;
