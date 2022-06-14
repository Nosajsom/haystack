import React, { useEffect} from "react";
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

// reactstrap components
import {
  Button,
  Col,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Navbar,
  Nav,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavbarText,
  NavItem,
  NavLink
} from "reactstrap";
// layout for this page
import UserLayout from "layouts/User.js";

import kind_logo from "assets/img/brand/KIND Assets-06.svg";
import "assets/css/index.css";

import keywords from "assets/img/brand/KIND Assets-10.svg";
import wordcloud from "assets/img/brand/KIND Assets-11.svg";
import acronyms from "assets/img/brand/KIND Assets-12.svg";
import search from "assets/img/brand/KIND Assets-13.svg";

function Tables() {
  const router = useRouter()
  const {user} = router.query
  var trimmed_user = user.split('@')[0]
  // Collapse isOpen State
    const styles = {
    grid: {
        paddingLeft: 0,
        paddingRight: 0

    },
    row: {
        marginLeft: 0,
        marginRight: 0,
        marginTop:"10px",
        marginBottom:"10px"
        
    },
    col: {
        padding:"10px",
        height:"250px"

    }
};

    

  return (
    <>
    {/* Page content */}
    
    <Container fluid>
      {/* Table */}
      <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
        <img src={kind_logo} style={{height:"200px"}}></img>
      </div>

      
      
      
      <Row style={{marginTop:"10px",marginBottom:"10px",display: "flex", justifyContent: "center", alignItems:"center"}}>
        <h1 style={{fontSize:"16px",textAlign:"center"}}>This is a prototype developed for the real estate market<br></br>based on the condominium courses and contract videos</h1>
      </Row>
      <Container fluid style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
      <Row style={styles.row}>
        <Col style={styles.col}>
          <a className="card_hyperlink" href={`/admin/user/${user}/keywords`} >

          <div className="block-example border border-light card_index" style={{height:"250px",width:"180px"}}>
            
            <div className="grad">
              <img src={keywords} style={{width:"80px"}}></img>
            
            </div>
            <div style={{justifyContent: "center", alignItems:"center"}}>
              <h3 className="header3" style={{}}>KEYWORDS</h3>
              <p style={{fontSize:"12px",textAlign: 'center',padding:"6px"}}>The equivalent of an index of a book. It's a quick way to find what you are looking for based on keywords.</p>
            </div>

          </div>
          </a>
        
        </Col>
        <Col style={styles.col}>
          <a className="card_hyperlink" href={`/admin/user/${user}/wordCloud`}>
          <div className="block-example border border-light card_index" style={{height:"250px",width:"180px"}}>
            
            <div className="grad">
              <img src={wordcloud} style={{width:"80px"}}></img>
            
            </div>
            <div style={{justifyContent: "center", alignItems:"center"}}>
              <h3 className="header3">WORD CLOUD</h3>
              <p style={{fontSize:"12px",textAlign: 'center',padding:"6px"}}>What are the most common words used in the material? And how are they weighted through the KIND?</p>
            </div>
          
          </div>
        </a>
        </Col>
          <Col style={styles.col}>
          <a className="card_hyperlink" href={`/admin/user/${user}/acronyms`}>
          <div className="block-example border border-light card_index" style={{height:"250px",width:"180px"}}>
            
            <div className="grad">
              <img src={acronyms} style={{width:"80px"}}></img>
            
            </div>
            <div style={{justifyContent: "center", alignItems:"center"}}>
              <h3 className="header3">ACRONYMS</h3>
              <p style={{fontSize:"12px",textAlign: 'center',padding:"6px"}}>Don't recall what short word representing a name or phrase means? FWIW, we can decode it.</p>
            </div>

          </div></a>
        
        </Col>
        <Col style={styles.col}>
          <a className="card_hyperlink" href={`/demo/${trimmed_user}/`}>
          <div className="block-example border border-light card_index" style={{height:"250px",width:"180px"}}>
            
            <div className="grad">
              <img src={search} style={{width:"80px"}}></img>
            
            </div>
            <div style={{justifyContent: "center", alignItems:"center"}}>
              <h3 className="header3">SEARCH</h3>
              <p style={{fontSize:"12px",textAlign: 'center',padding:"6px"}}>Forgot where to find a specific concept in a course you took? We have a tool for that.</p>
            </div>

          </div>
          </a>
        </Col>
      
        <Col style={styles.col}>
          <a className="card_hyperlink" href={`/admin/user/${user}/flashCards`}>
          <div className="block-example border border-light card_index" style={{height:"250px",width:"180px"}}>
            
            <div className="grad">
             
            
            </div>
            <div style={{justifyContent: "center", alignItems:"center"}}>
              <h3 className="header3">FLASH CARDS</h3>
              <p style={{fontSize:"12px",textAlign: 'center',padding:"6px"}}>Access automatically-generated studying materials!</p>
            </div>
          
          </div>
        </a>
        </Col>
        
      </Row>

      </Container>
      <Row style={{marginTop:"10px", justifyContent: "center", alignItems:"center"}}>
        <div>
        <p style={{fontSize:"12px",marginTop:"30px",marginBottom:"10px",textAlign: 'center',width:"600px"}}>How does it work? Behind the sences we have used a tool to upload the real estate market specific content to a private and curated knowledge base. The tool has then automatically indexed the content in order to facilitate different ways to navigate through this KIND.<br></br><br></br>Use cases: A new learner practicing for the licensing exam. A professional refreshing their memory.<br></br> A subject matter expert identifying strengths and gaps in the current offerings.</p></div>

      </Row>


    </Container>
  </>
  );
  
}

Tables.layout = UserLayout;

export default Tables;