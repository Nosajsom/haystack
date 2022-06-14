
import React,{Component} from 'react';
import {API} from 'api';
import { useUser } from "../../hooks/user";

import {
  Button, 
  Card,
  Table
} from "reactstrap";
//const File = require('fetch-file'); // creates a FIle-like IDL wrapper around fs

const fileType = ["text/plain", "application/pdf","text/html" , "image/jpeg", "image/gif", "image/png","video/mp4", "video/quicktime", "video/webm"]

// From https://stackoverflow.com/a/57272491/3558475
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
class App extends Component {
    
    state = {
 
      // Initially, no file is selected
      file: null,
      processedList : []
    };
    
    // On file select (from the pop up)
    onFileChange = event => {
    
    
      if (this.state.file && this.state.processedList){
        this.setState({ file: this.state.file.concat(Array.from(event.target.files)), processedList: this.state.processedList.concat(Array.from(event.target.files))});
      }
      // Update the state
      else{
        this.setState({ file: Array.from(event.target.files), processedList: Array.from(event.target.files)});
      }
      
    };

    
    // On file upload (click the upload button)
    onFileUpload = async () => {
        window.confirm("You will be posting "+this.state.processedList.length+" file(s) to the server.");
        const files = this.state.processedList;

        if (!files.length){
          window.confirm("Please choose at least one file to upload")
          return
        }

        try{
          const user = useUser();
          // TODO: Show progress (Easiest with axios https://stackoverflow.com/a/50479326/3558475)
          // Upload in parallel
          await Promise.all(files.map(async (file)=>{
            const formData = new FormData();
            formData.append('file', file);
            return fetch("/haystack/file-upload", 
              {
              "headers": {
                "Cookie": new URLSearchParams({"user":user}).toString(),
              },
              "body": formData,
              "method": "POST"
            })
          }))
          window.confirm("Upload finished")
        } catch(err){
          window.confirm("Upload error")
          console.log(err)
        } finally{
          window.location.reload();
        }
    };
    
    // File content to be displayed after
    // file upload is complete
    fileData = () => {
      if (this.state.file) {
        return (
            <div style={{backgroundColor:"white"}}>
                <h2>File Details:</h2>

                {
                    this.state.file.map((file,index) => {
                        if (fileType.includes(file.type)){
                            return (

                                <div key={"file"+file.name}>
                                    <p key={"name"+file.name}>File Name: {file.name}</p>
                            
                                        
                                    <p key={"type"+file.type}>File Type: {file.type}</p>
                                    
                                          
                                    <hr></hr>
                                </div>
                            );
                        }else{
                            let name = file.name;
                            let type = file.type
                            this.state.processedList.splice(index, 1);
                            return (
                                <div key={"file"+name}>
                                    <p>File Type {type} is not supported</p>
                                    <hr></hr>
                                </div>
                            );

                        }
                        
                    })             
                }
             

 
            </div>
        );
      } else {
        return (
          <div>
            <br/>
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        );
      }
    };
    
    render() {
    
      return (
        <Card style={{marginTop:"20px","borderRadius":"5px"}}>
        <div style={{margin:"10px",backgroundColor:"white"}}>
            <h3 style={{marginBottom:"20px"}}>
              Upload your files to our server!
            </h3>
            <div>
                
                <Table>
                <tr>
                  <td><h3>Upload individual files:</h3></td>
                  <td><input type="file" id="file" multiple name="file" onChange={this.onFileChange} style={{}}/></td>
                </tr>
                
                <tr>
                  <td><h3>Upload a folder:</h3></td>
                  <td><input webkitdirectory="" type="file" id="file" multiple name="file" onChange={this.onFileChange} style={{}}/></td>
                </tr>
                
                </Table>
                
                <Button onClick={this.onFileUpload} style={{backgroundColor: "#0E3831",color:"#EFEFEF"}}>
                  Upload!
                </Button>
            </div>
          {this.fileData()}
        </div></Card>
      );
    }
  }
 
  export default App;