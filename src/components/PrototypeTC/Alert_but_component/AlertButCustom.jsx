import React, { Component , useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FormGroup, FormControl, Dropdown,DropdownButton, Badge, Accordion, Grid, Table, Container,Row,Col } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert'
import "react-bootstrap/dist/react-bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { io } from "socket.io-client";
import { Link } from 'react-router-dom';




export default class AlertButCustom extends Component{
    constructor(props){
        super(props)
        this.state = { 
            show: true,
            setShow:true
        }
    }

    

    render(){
        return (
            <>
            <Alert show={this.state.show} variant="success">
                <Alert.Heading>How's it going?!</Alert.Heading>
                <p>
                    Select The Frequencies!!
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={this.close_warning} variant="outline-success">
                    Close
                    </Button>
                </div>
                </Alert>
        
                {!this.state.show && <button type="button" class="btn btn-warning" onClick={this.processData}> Send Request XX</button>}
            </>
        );
    }

    close_warning = () => {
        this.setState( {setShow: false}, () => {})
    }

    processData = () => {   

        console.log("SENDSHIT")

        
        }
    

}