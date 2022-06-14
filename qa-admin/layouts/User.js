
import React, { useEffect } from "react";
// reactstrap components
import { Container, Row, Col,
  Navbar,
  Nav,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavbarText,
  NavItem,
  NavLink
  
  
  
  
} from "reactstrap";
import { useRouter } from 'next/router';

import keywords from "assets/img/brand/keywords.png";
import wordcloud from "assets/img/brand/wordcloud.png";
import search from "assets/img/brand/search.png";
import acronyms from "assets/img/brand/acronyms.png";
import kind_logo from "assets/img/brand/KIND Assets-15.svg";

function main2(){
  const router = useRouter();
  useEffect(async ()=>{

    //router.push("/user");
    
  })
}
function User(props) {
  const router = useRouter()
  const {user} = router.query
  var trimmed_user = user.split('@')[0]
  const [isOpen, setIsOpen] = React.useState(false);
  //         


  return (
    <>
        <div>
          <>
        
       <Navbar light expand="md" style={{background:"#0E3831",marginBottom:"20px"}} >
            <a class="navbar-brand" href={`/admin/user/${user}`}><img src={kind_logo} style={{height:"40px",marginRight:"100px"}} alt="Logo"></img></a>

            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
            <Collapse isOpen={isOpen} navbar fluid>
                <Nav className="mr-auto" navbar>

                    <NavItem>
                        
                        <NavLink href={`/admin/user/${user}/keywords`}><div style={{display: "inline-block",whiteSpace: "nowrap"}}><img src={keywords} style={{height:"30px",marginRight:"5px"}} alt="Logo"></img><NavbarText style={{color:"white"}}>Keywords</NavbarText></div></NavLink>
                    </NavItem>

                    <NavItem >
                       <NavLink href={`/admin/user/${user}/wordCloud`}><div style={{display: "inline-block",whiteSpace: "nowrap"}}><img src={wordcloud} style={{height:"30px",marginRight:"5px"}} alt="Logo"></img><NavbarText style={{color:"white"}}>Word Cloud</NavbarText></div></NavLink>
                    </NavItem>

                    <NavItem >
                        <NavLink href={`/admin/user/${user}/acronyms`}><div style={{display: "inline-block",whiteSpace: "nowrap"}}><img src={acronyms} style={{height:"30px",marginRight:"5px"}} alt="Logo"></img><NavbarText style={{color:"white"}}>Acronyms</NavbarText></div></NavLink>
                    </NavItem>
                    
                    <NavItem >
                        <NavLink href={`/admin/user/${user}/flashCards`}><div style={{display: "inline-block",whiteSpace: "nowrap"}}><NavbarText style={{color:"white"}}>Flash Cards</NavbarText></div></NavLink>
                    </NavItem>

                    <NavItem >
                        <NavLink href={`/demo/${trimmed_user}/`}><div style={{display: "inline-block",whiteSpace: "nowrap"}}><img src={search} style={{height:"30px",marginRight:"5px"}} alt="Logo"></img><NavbarText style={{color:"white"}}>Search</NavbarText></div></NavLink>
                    </NavItem>

                </Nav>
            </Collapse>

          </Navbar>
          
      </>
      
          {props.children}
        </div>
    </>
  );
}

export default User;
