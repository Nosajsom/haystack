import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import {

  Container,
  Row,
} from "reactstrap";
// layout for this page

// core components

import {API} from 'api';


function videoPlayer({query}) {

  return (
     <>

        {/* Page content */}
        <Container className="mt--7" fluid >
          {/* Table */}
          <Row>
            <div className="col"style={{marginTop:"150px"}}>

              <video onContextMenu={(event)=>{event.preventDefault();}} width="960" height="540" autoPlay="" controls controlsList="nodownload" name="media" >
                <source src={"/static/file-upload/"+query.link} type="video/mp4"></source>
              </video>
              
            </div>
          </Row>
          
        </Container>
      </>
    

  );


};

const getServerSideProps = async function ({req,query}) {
  const { user } = query;

  console.log("re2",query);
  return {

    props: {"query":query}, // will be passed to the page component as props
  };
}



export default videoPlayer;
export {getServerSideProps}
