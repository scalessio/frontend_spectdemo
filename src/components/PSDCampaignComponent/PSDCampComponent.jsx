import React, { Component , useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FormGroup, FormControl, Dropdown,DropdownButton, Badge, Accordion, Grid, Table, Container,Row,Col } from "react-bootstrap";
import "react-bootstrap/dist/react-bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import './PSDCampComponent.css';
import { Link } from 'react-router-dom';



export default class PSDCampComponent extends Component {
    
    constructor(props){
        super(props)
        this.state = { 
            techology: '',Freq1:'',Freq2:'',FreqStart:'',FreqEnd:''
        }
    }


    

    render() {
        const handleSelect = (e) => {
            console.log('Tasto cliccato');
            this.setState(
                {
                    techology: e
                }
            )
        };

        const handleSelect2 = (e) => {
            console.log('Tasto cliccato');
            this.setState(
                {
                    Freq1: '195.01',
                    Freq2: '218.90'
                }
            )
        };
        const handleSelectCampaign = (e) => {
            console.log('Tasto cliccato');
            this.setState(
                {
                    FreqStart: '194.00',
                    FreqEnd: '220.00'
                }
            )
        };

        return ( 
            <div className="PSDCampComponent">
                <Container fluid>
                    <Row sm={1} md={2}>
                        <Col className="mt-4 mr-5" align="left" style={{marginLeft: '55px'}}> 
                            <h2>PSD Campaign & Target Spectrum</h2> 
                        </Col>
                        <Col></Col>
                    </Row>

                    <Row>
                        <Col className="mt-4 mr-5" align="left" style={{marginLeft: '55px'}}> 
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Selected Sensor</th>
                                <th><DropdownButton alignRight
                                                    title="Frequency Campaign"
                                                    id="dropdown-menu-align-right"
                                                    variant='success'
                                                    onSelect={handleSelectCampaign}> 
                                                    <Dropdown.Item eventKey="rangeFreq"> 194 - 220 MHz </Dropdown.Item>
                                                    
                                    </DropdownButton></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>Madrid Rack 1</td>

                                    <td> 
                                    Start Freq <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.FreqStart}</Badge> - End Freq
                                    <Badge style={{color: 'green', fontSize:'15px'}} bg="secondary"> {this.state.FreqEnd}</Badge> MHz
                                    </td>
                                </tr>
                                
                            </tbody>
                            </Table>
                        </Col>
                        <Col align="left" style={{marginTop: '20.2px', marginLeft: '55px'}}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th><DropdownButton alignRight
                                                    title="Target Technology"
                                                    id="dropdown-menu-align-right"
                                                    variant='success'
                                                    onSelect={handleSelect}> 
                                                    <Dropdown.Item eventKey="DAB"> DAB </Dropdown.Item>
                                                    
                                    </DropdownButton></th>
                                <th><DropdownButton alignRight
                                                    title="Target Frequencies"
                                                    id="dropdown-menu-align-right"
                                                    variant='success'
                                                    onSelect={handleSelect2}> 
                                                    <Dropdown.Item eventKey="targetfreq"> 195.01 -  218.90 </Dropdown.Item>
                                    </DropdownButton></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                    {this.state.techology}
                                    </td>
                                    
                                <td>
                                <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.Freq1}</Badge>
                                <Badge style={{color: 'green', fontSize:'15px'}} bg="secondary"> {this.state.Freq2}</Badge></td>
                                </tr>
                                
                            </tbody>
                            </Table>
                            
                        </Col>
                        <Col align="left" style={{marginTop: '50px', marginLeft: '55px'}}>
                            <button type="button" class="btn btn-warning" disabled> Monitoring Campaign </button>
                        </Col>
                        
                    </Row>

                    <Row sm={1} md={2}>
                        <Col className="mt-4 mr-5" align="left" style={{marginLeft: '55px'}}> 
                        <h2>Waterfall Plot</h2> </Col>
                        <Col></Col>
                    </Row>
                    
                </Container>
            </div>
        )
    }


    
}