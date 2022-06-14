import fs from 'fs';
import lodash from 'lodash'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import {sync as writeFileAtomicSync } from 'write-file-atomic'

import { useUser } from "../../hooks/user";

// reactstrap components
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
  } from "reactstrap";
// layout for this page
import {API} from 'api'
import Admin from "layouts/Admin.js";
import Header from "components/Headers/Header.js";
import { parseCookies } from 'nookies';

const loadJSON = (path)=>{
  try{
    const rawdata = fs.readFileSync(path,{encoding:'utf8'});
    return JSON.parse(rawdata);
  } catch(e){
    return {} // Default return empty
  }
}

const loadSettings = ({user})=>{
    const defaultData = loadJSON('/home/shared/default-settings.json')
    const userData = loadJSON(`/home/shared/${user}/settings.json`)
    return lodash.merge({},defaultData,userData)
}

const saveSettings = async ({data,user}) => {
  await API.saveSettings({data,user})
  location.reload();
}

const Settings = ({originalData}) => {
  const user = useUser();

  const [data,setData] = useState(originalData);
 
  const updateData = (updates)=>{
    // Create new object via deep merge
    setData(lodash.merge({},data,updates))
  }

  const changes = !lodash.isEqual(originalData, data)

  return (
    <>
    <Header />
    {/* Page content */}
    <Container className="mt--7" fluid>
        <Row>
            <Card className="bg-secondary shadow" style={{flexGrow: 1}}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account settings</h3>
                    {changes?
                      <>
                        <br/>
                        <Alert color="warning" style={{
                          backgroundColor: '#fff9a3',
                          border: '0px',
                          color: '#000',
                        }}>
                          Unsaved Changes!
                        </Alert>
                      </>:''
                    }
                  </Col>
                  <Col className="text-right" xs="4">

                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Message Config
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Greeting Message
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.messages.greeting}
                            onChange={(e)=>{
                              updateData({
                                'messages':{
                                  'greeting': e.target.value,
                                }
                              })
                            }}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Unsure Message
                          </label>
                          <Input
                            className="form-control-alternative"

                            defaultValue={data.messages.unsure}
                            onChange={(e)=>{
                              updateData({
                                'messages':{
                                  'unsure': e.target.value,
                                }
                              })
                            }}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    UI Config
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="8">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            AI Icon
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.ui.aiIcon}
                            onChange={(e)=>{
                              updateData({
                                'ui':{
                                  'aiIcon': e.target.value,
                                }
                              })
                            }}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4" style={{
                          display: 'flex',
                          alignitems: 'center',
                          flexDirection: 'column-reverse'
                      }}>
                        <FormGroup style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                            <img src={data.ui.aiIcon} style={{height:'4rem'}}></img>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    AI Config
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Minimum Answer Relevance
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.ai.minimumAnswerRelevance}
                            onChange={(e)=>{
                              updateData({
                                'ai':{
                                  'minimumAnswerRelevance': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Minimum Link Relevance
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.ai.minimumLinkRelevance}
                            onChange={(e)=>{
                              updateData({
                                'ai':{
                                  'minimumLinkRelevance': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Minimum Confidence
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.ai.minimumConfidence}
                            onChange={(e)=>{
                              updateData({
                                'ai':{
                                  'minimumConfidence': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">Keyword Generation</h6>
                  <div className="pl-lg-4">
                  <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Maximum Keyword Length
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.keywords.maximumKeywordLength}
                            onChange={(e)=>{
                              updateData({
                                'keywords':{
                                  'maximumKeywordLength': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Minimum Score Threshold
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.keywords.minimumScoreThreshold}
                            onChange={(e)=>{
                              updateData({
                                'keywords':{
                                  'minimumScoreThreshold': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          >
                            Minimum Count Above Score Threshold
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={data.keywords.minimumCountAboveScoreThreshold}
                            onChange={(e)=>{
                              updateData({
                                'keywords':{
                                  'minimumCountAboveScoreThreshold': e.target.valueAsNumber,
                                }
                              })
                            }}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <Row style={{    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Button
                      color="primary"
                      style={{background:"#0E3831"}}
                      onClick={async () => {
                        const result = confirm("Are you sure you want to reset all settings to default?");
                        if (result) {
                          await saveSettings({user,data:await API.loadDefaultSettings()})
                        }
                      }}
                      size="md"
                    >
                      Reset all to defaults
                    </Button>
                                      <Button 
                    style={{background:"#0E3831", marginLeft:"20px"}}
                    color="primary"
                    onClick={async () => {
                        await saveSettings({user,data})
                    }}
                  >
                    Save Changes
                  </Button>
                  </Row>
                </Form>
              </CardBody>
            </Card>
        </Row>
      </Container>
  </>
  );
};

const getServerSideProps = async function ({req}) {
  const { user } = parseCookies({ req });
  
  const originalData = loadSettings({user})
 return {
    props: {originalData},
  };
}

Settings.layout = Admin;

export default Settings;
export {getServerSideProps};