import React from "react";
// reactstrap components
import { Container, Row, Col} from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";
import kind_logo from "assets/img/brand/KIND Assets-06.svg";
function Auth(props) {
  React.useEffect(() => {

  }, []);
  return (
    <>
      <div style={{backgroundColor:"white",height:"100%"}}>
        <AuthNavbar />
        <div className="header" style={{marginTop:"60px"}}>
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                
                <Col lg="5" md="6">
                  <img src={kind_logo} style={{height:"200px",marginBottom:"60px"}}></img>

                </Col>
              </Row>
            </div>
          </Container>
          
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">{props.children}</Row>
        </Container>
        <AuthFooter />
      </div>

    </>
  );
}

export default Auth;
