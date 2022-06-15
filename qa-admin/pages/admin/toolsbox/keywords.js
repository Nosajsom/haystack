import {API, TimeoutError} from 'api';
import { parseCookies } from "nookies";

import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
// node.js library that concatenates classes (strings)

import Collapsible from 'react-collapsible';
import { useUser } from "../../../hooks/user";
import {
    Button,
  Container,
  Row,
  Card,
  Table,Input
} from "reactstrap";

import AdminChild from "layouts/AdminChild.js";
import Header from "components/Headers/Header.js";
import "assets/css/keywords.css";
import search from "assets/img/brand/search.png";
import plus from "assets/img/icons/icons8-plus-96.png";
import minus from "assets/img/icons/icons8-minus-96.png";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const unique = (elem, pos, array)=> {
    return array.indexOf(elem) == pos;
}

const getTimeFromSeconds = (seconds)=> {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

const compareRange = ( a, b ) => {
  if ( parseInt(a.split('-')[0],10) > parseInt(b.split('-')[0],10) ){
    return 1;
  }
  return -1;
}

const generateKeywords = async (e) => {
  var user = useUser();

  window.alert("Generation started in background");
  
  API.getKeywords({user}).then(res => {
    if (res){
      window.alert("Generation finished");
      window.location.reload();
    } else{
      // 500 error
      window.alert("Generation error.");
  }
  }).catch((err)=>{
    if(err instanceof TimeoutError){
      window.alert("Timed out waiting for generation to finish. It is still runnning. Please check back later");
    } else{
      window.alert("Unknown Generation error.");
      console.log(err)
    }
  });
  
}

function Keywords({response,keyword_first_letter,user}) {

  console.log("user",user);
  if (!isEmpty(response)){
  const allExtensions = Array.from(Object.values(response).reduce((acc,{links})=>{
      Object.keys(links).forEach((fileName)=>{
        const extension = fileName.split('.').pop()
        if (extension.length<=6){
          acc.add(extension)
        }
      });
      return acc;
    },new Set())).sort();

  const [selectedExtensions,setSelectedExtensions] = useState(new Set());
  const [selectedKeywordFilter,setselectedKeywordFilter] = useState('');
  const [selectedNotFound,setselectedNotFound] = useState(0);
  
  function handleChange(event) {
    setselectedKeywordFilter(event.target.value);

  }
  var display = false
  var key_letter_dict = {};
  var trimmed_user = user.split('@')[0]
  var letter_miss_count = 0;

  return (
    <>
    <Header />
    {/* Page content */}
    <Container className="mt--7" fluid >
      {/* Table */}
      <Row>
        <div className="col"style={{marginTop:"100px"}}>
            <Button 
              style={{
                width:"200px", 
                height:"100px", 
                backgroundColor: "#0E3831",
                color:"white",
                margin:"30px",
                borderRadius:"5px",
                borderColor:"white",
                border:"none"
              }}
              onClick={generateKeywords}>Generate Keywords from all documents
            </Button>
            
          <div className="col" style={{marginTop:"20px",color:"#0E3831"}}>


          
            <Table className="align-items-center table-flush" responsive style={{ tableLayout: "fixed"}}>
              <thead className="thead-light" >
                <tr >
                  <th scope="col" style={{backgroundColor: "#0E3831" }}>
                    <div style={{display: "grid",gridTemplateColumns: "80% 20%"}}>
                      <div>
                        <p style={{color:"white",padding:"10px"}}>Browse alphabetically or use the filter to search out specific words</p>
                      </div>
                      <div>
                      <div style={{color:"#EFEFEF"}}>
                        Keyword
                      </div>
                      <Input style={{width:  "200px" }} type="text" name="Keyword Filter" placeholder="Keyword Filter" onChange={handleChange}/>
                      </div>
                    </div>
                    </th>
  
                </tr>
              </thead>
              
             <tbody style={{width:"100%"}}>
              {(()=>{
              
              return (
              
              Object.entries(keyword_first_letter).map(([first_letter,array])=>{
                  var each;
                  var miss_count=0;
                  for(each of Object.keys(array)){
                    if (each.indexOf(selectedKeywordFilter) != 0){
                      miss_count+=1
                      var new_length = Object.keys(array).length;
                      if (miss_count == new_length){
                        letter_miss_count +=1
                         
                        if (Object.keys(keyword_first_letter).indexOf(first_letter) == new_length-1 && letter_miss_count == new_length){
                          //console.log("no match case");
                          return (<h1 style={{marginTop:"20px",color:"#0E3831"}}>No keywords were matched</h1>)
                        }
                        
                        return null
                      }
                    }
                    
                  }
               
                  

                  return(<div id={"collapsible".concat(first_letter)} style={{border:"10px",width:"100%"}}>
                    <Collapsible  trigger={<div style={{display: "grid",gridTemplateColumns: "20fr 1fr", padding: "0px 0",height:"38px"}}><p style={{ padding: "0px 0",fontSize:"20px"}}>{first_letter}</p><img className="image_file" src={plus} style={{ padding: "0px 0",height:"35px"}}></img></div>} triggerStyle={{width:"100%",background:"#FFFFFF", padding:"10px",paddingLeft:"20px",color:"#0E3831",backgroundColor:"#8accc7",marginTop:"2px"}} 
                    easing="ease-in"
                    triggerTagName="div"
                    transitionTime="500"

                    triggerWhenOpen={<div style={{display: "grid",gridTemplateColumns: "20fr 1fr", padding: "0px 0",height:"38px"}}><p style={{ padding: "0px 0",fontSize:"20px"}}>{first_letter}</p><img className="image_file" src={minus} style={{ padding: "0px 0",height:"30px"}}></img></div>}
                    
                    >
                    {Object.entries(array).map(([keyword,{links,keyword_counts,count}])=>{
                        return (<tr key={"outerfile-"+keyword}>{(()=>{
    
                                if (!keyword.includes(selectedKeywordFilter)){
                                  return null
  
                                }else{
                                  return(<>
  
                            <td style={{minWidth:"300px"}}>
                              <b>{keyword}</b>
                              {(()=>{
                                
                                const variants = Object.entries(keyword_counts)
                                if(variants.length<2){
                                  return null
                                }
                                return <>
                                <br/>
                                Variants:
                                {Object.entries(keyword_counts).sort().map(([sub_keyword,sub_count])=>{
                                  return <>
                                    <br/>
                                    {sub_keyword}
                                  </>
                                })}
                                </>
                              })()}
                            </td>
                            <td >
                            {Object.entries(links).sort().map(([file,file_data])=>{
                                const extension = file.split('.').pop()
                                if(selectedExtensions.size && !selectedExtensions.has(extension)){
                                  return undefined;
                                }
                                return (<>{(()=>{
                                    if (file_data.type==='page'){
                                      return (<>
                                          {file} Page {file_data.data.map(([page,data])=>{
                                              return <><a href={data.url} target="_blank" rel="noopener noreferrer">{page} </a></>
                                          })}
                                      </>)
                                    }
                                    else if(file_data.type==='audio_video'){
                                      return (<>
                                          {file} Time {file_data.data.map(([time,data])=>{
                                  
                                            return <><a href={data.url} target="_blank" rel="noopener noreferrer">{time} </a></>
  
                                          
                                              //return <><a href={data.url} target="_blank" rel="noopener noreferrer">{time} </a></>
                                          })}
                                      </>)
                                    }
                                    else{
                                      return <a href={file_data.data[''].url} target="_blank" rel="noopener noreferrer">{file}</a>
                                    }
                                })()}
                                <br/>
                                </>)
                              })}
                            </td></>)
                            }
                                
                                
                              })()}</tr>)})
                      
                    }</Collapsible>
                    </div>
                  )
              }
              ))})()}
                
              </tbody>
            </Table>


          
        </div>
          
        </div>
      </Row>
      
    </Container>
    </>
        

      );
    }else{
        return (
            <>
            <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                  {/* Table */}
                  <row>
                    <h1 style={{marginTop:"120px"}}>No keywords have been generated yet.</h1>
                  </row>
                    <Button 
                      style={{
                        width:"200px", 
                        height:"100px", 
                        backgroundColor:"white",
                        margin:"30px",
                        borderRadius:"5px",
                        borderColor:"white",
                        border:"none"
                      }}
                      onClick={generateKeywords}>Generate Keywords from all documents
                    </Button>
                </Container>
              </>
        

      );
  }

};




const getServerSideProps = async function ({req}) {
  const { user } = parseCookies({ req });
  console.log("server user",user);
  
  var response = await API.getStaticKeywords({user});
  //console.log("response",Object.keys(response));
  

  
  
  
  var keyword_first_letter = {}
  var each;
  for( each of Object.keys(response)){

    //console.log("keys",Object.keys(keyword_first_letter));
    let new_key = each[0];
    if (isNaN(each[0])){
      new_key = each[0].toUpperCase();
    }
    
    if (Object.keys(keyword_first_letter).includes(new_key)){
  
      keyword_first_letter[new_key][each] = response[each];
    }else{

      keyword_first_letter[new_key] = {}
      keyword_first_letter[new_key][each] = response[each];

    }
  }
  return {
    props: {response,keyword_first_letter,user}, // will be passed to the page component as props
  };
}

Keywords.layout = AdminChild;

export default Keywords;
export {getServerSideProps}