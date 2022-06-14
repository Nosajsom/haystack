import React from "react";
import { useRouter } from "next/router";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminChildNavbar from "components/Navbars/AdminChildNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";


import routes from "routes.js";
var url = 'http://localhost:3000';
function AdminChild(props) {
  // used for checking current route

  const router = useRouter();
  var user;
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);


  const getBrandText = () => {
    let name = props.children.type.name;
    if (name){
        return name;
    }
    return "Onlea";
  };
  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "../admin/index",
          imgSrc: '../../onlea_small.png',
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminChildNavbar {...props} brandText={getBrandText()} />
        {props.children}

      </div>
    </>
  );
}
export default AdminChild;
