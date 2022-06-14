import { useEffect } from "react";
import Link from "next/link";
//import withIronSession from "../../pages/api/user"
// reactstrap components
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies'
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

  function AdminNavbar({ brandText}) {
    const router = useRouter();
    var user;
    // Use effect will only run on client
    useEffect(async()=>{
      fetch('/admin/api/user', {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {
        var body = data.user;
        if(body != 'Not found'){
          user = body;
          console.log(user);
          document.getElementById('iconName').innerText = user.name;
          if (user.admin){
            // This is an admin user
            document.getElementById('userStatus').innerText = "Administrator";
          }
          else{
            document.getElementById('userStatus').innerText = "User";
          }
          
          
        }else{
          console.log("body",body);
          router.push('../auth/login');
        }
        
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  })
  function handleLogout(){
    fetch('/admin/api/logout', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      destroyCookie(null, 'user');
      router.push('../auth/login');

      
    })
    .catch((error) => {
      console.error('Error:', error);
  });
    
  }
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid >
          <Link href="/admin/dashboard">
            <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
              {brandText}
            </a>
          </Link>
          
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src="/admin/onlea_small.png"
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span id="iconName" className="mb-0 text-sm font-weight-bold">
                      undefined
                    </span>
                    <div id="userStatus" className="mb-0 text-sm font-weight-bold">
                      undefined
                    </div>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <Link href="/admin/profile">
                  <DropdownItem>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                </Link>
                <Link href="/admin/settings">
                  <DropdownItem>
                    <i className="ni ni-settings-gear-65" />
                    <span>Settings</span>
                  </DropdownItem>
                </Link>

                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
