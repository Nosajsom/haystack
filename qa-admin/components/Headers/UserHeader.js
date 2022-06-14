import { useEffect} from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

function UserHeader() {
   useEffect(async ()=>{
   fetch('/admin/api/user', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
       let userInfo = data.user;
       document.getElementById('profilePageUserName').innerText = userInfo.name;

    })
     
   })
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "200px",
          background:"#0E3831",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white" id="profilePageUserName">Hello User</h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. <br/>You can see and modify your personal information here.
              </p>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}


export default UserHeader;
