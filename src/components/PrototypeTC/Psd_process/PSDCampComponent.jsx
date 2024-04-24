import React, { Component , useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FormGroup, FormControl, Dropdown,DropdownButton, Badge, Accordion, Grid, Table, Container,Row,Col } from "react-bootstrap";
import AlertButCustom from '../Alert_but_component/AlertButCustom';
import "react-bootstrap/dist/react-bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import './PSDCampComponent.css';
import Waterfall from '../Spectrogram/Waterfall';
import { io } from "socket.io-client";
import { Link } from 'react-router-dom';


export default class PSDCampComponent extends Component {
    
    constructor(props){
        super(props)
        
        this.state = { 
            
            showToast: false, // Add this line
            toastMessage: 'Connected', // Add this line to customize the message dynamically
            predicted_tech: '--',
            Es_res:'--',
            Tx_res:'--',
            TC_res:'--',
            Total_res:'--',
            FreqStartHz:'--',
            FreqEndHz:'--',
            startf : '--',
            endf : '--',
            ok_req : false,
            ok_show : false,
            use_kafka : false,
            specData:[],
            specLabels :[],
            tx_bin:[],
            spectrum_span : '--'
        }
    }
    render() {
        
        const handleSelectCampaing= (e) => {
            console.log(e)
            if (e=="rangeFreq_80"){ 
                console.log("Selected : set_fstart_80"); 
                let val_fstar='80';
                let val_f_end='120';
                let val_FreqStart='80000000';
                let val_FreqEnd='120000000';
                this.setState( 
                    {startf: val_fstar, endf:val_f_end, FreqStartHz:val_FreqStart, FreqEndHz:val_FreqEnd, ok_req:true}, () => 
                    {console.log(this.state.startf);console.log(this.state.endf);console.log(this.state.FreqStartHz);console.log(this.state.FreqEndHz);
                    })
            }
            else if (e=="rangeFreq_test"){ 
                console.log("Selected : rangeFreq_test"); 
                let val_fstar='20';
                let val_f_end='1500';
                let val_FreqStart='20000000';
                let val_FreqEnd='1500100000';
                this.setState( 
                    {startf: val_fstar, endf:val_f_end, FreqStartHz:val_FreqStart, FreqEndHz:val_FreqEnd, ok_req:true}, () => 
                    {console.log(this.state.startf);console.log(this.state.endf);console.log(this.state.FreqStartHz);console.log(this.state.FreqEndHz);
                    })
            }
            else if (e=="rangeFreq_790"){
                console.log("Selected : set_fstart_790"); 
                let val_fstar='791'
                let val_f_end='821'
                let val_FreqStart='791000000'
                let val_FreqEnd='821000000'

                this.setState( 
                    {startf: val_fstar, endf:val_f_end, FreqStartHz:val_FreqStart, FreqEndHz:val_FreqEnd, ok_req:true}, () => {
                        console.log(this.state.startf);console.log(this.state.endf);console.log(this.state.FreqStartHz);console.log(this.state.FreqEndHz);
                    })
            } 
            else if (e=="rangeFreq_180"){
                console.log("Selected : set_fstart_180"); 
                let val_fstar='180'
                let val_f_end='230'
                let val_FreqStart='180000000'
                let val_FreqEnd='230000000'

                this.setState( 
                    {startf: val_fstar, endf:val_f_end, FreqStartHz:val_FreqStart,FreqEndHz:val_FreqEnd,ok_req:true}, () => {
                        console.log(this.state.startf);console.log(this.state.endf);console.log(this.state.FreqStartHZ);console.log(this.state.FreqEndHz);
                    })
            }
            else{{ console.log("NOSELECT") }};} 
        
        
        return ( 
            <div className="PSDCampComponent">
                <Container fluid>

                    {/* Knobs Request */}
                    <Row>
                        <Col className="mt-4"  > 
                        
                        <Table striped bordered hover className="table-custom-text">
                            <thead>
                                <tr>
                                <th>Selected Sensor</th>
                                <th><DropdownButton alignRight
                                                    title="Frequency Campaign"
                                                    id="dropdown-menu-align-right"
                                                    variant='success'
                                                    onSelect={handleSelectCampaing}> 
                                                    <Dropdown.Item eventKey="rangeFreq_180">180-230 MHz </Dropdown.Item>
                                    </DropdownButton></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td> Imdea adsb1 </td>
                                    <td> 
                                    [ <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.startf}</Badge>-
                                    <Badge style={{color: 'green', fontSize:'15px'}} bg="secondary">{this.state.endf}</Badge> ] MHz
                                    </td>
                                </tr>
                            </tbody>
                            </Table>
                        </Col>
                        
                        <Col className="mt-5">
                        <button type="button" class="btn btn-warning btn-lg btn-warning-custom"  onClick={this.processData} disabled={!this.state.ok_req}> Start Campaign </button>
                        {this.state.showToast && (<div className="toast-notification">{this.state.toastMessage} </div> )}
                        <button type="button" class="btn btn-danger btn-lg rotating-button" style={{borderRadius:'80%', marginTop:'15px' ,marginLeft: '50px'}} onClick={this.injectData}> Attack </button>
                        </Col>

                    </Row>  

                    {/*Spectrogram*/}
                    { <Row>
                        <h2> </h2> 
                    </Row>
                    }
                    <Row>
                        <Waterfall ok_show_butt ={this.state.ok_show} dataSpectrum={this.state.specData} dataLabel={this.state.specLabels} dataBin={this.state.tx_bin} dataSpan={this.state.spectrum_span}  dataCenterF={[this.state.FreqStartHz,this.state.FreqEndHz]}/>
                    </Row>        

                    
                </Container>
            </div>
        )
    }
    
    processData = () => {   
            // socket.emit('tx_metainfo', {snsid : "202481602060659", snsname : "imdea_adsb", month : "Sep",day : "1" , nation : "Esp",technology : "test",startf : "791",endf : "821", freq_start:'791000000'});
            const socket = io("http://localhost:5001")
            let value_fstar=this.state.startf
            let value_f_end=this.state.endf
            let value_FreqStart=this.state.FreqStartHz
            let value_FreqEnd=this.state.FreqEndHz
            let val_kfk = this.state.use_kafka;
            socket.on('connect', function() {
                socket.emit('tx_metainfo', {
                snsid : "202481596708292",
                snsname : "rack_3", 
                month : "May", 
                day : "1" ,
                nation : "Esp",
                technology : "test", 
                startf : value_fstar,
                endf : value_f_end, 
                freq_start : value_FreqStart, 
                freq_end:value_FreqEnd});
            });

            // socket.on('ready_processffts', function() {
            //     console.log(val_kfk)
            //     console.log("Send request transmission detection")
            //     socket.emit('process_raw_ffts')
            // });
            
            socket.on('ready_detect_tx', () => {
                // Show toast here
            this.setState({ showToast: true, toastMessage: 'Connected!!' });
             setTimeout(() => {
            this.setState({ showToast: false });
        }, 10000); // Hide the toast after 5 seconds
                console.log("Emit detect transmissions..")
                console.log(this.state.ok_show)
                socket.emit('tx_detection')
            });

            socket.on('ready_predict', function() {
                socket.emit('predict_pipeline');
                console.log("Send request pipeline")
            });

            socket.on('end_prediction',(data) => {
                this.setState( 
                    {   
                        ok_show : true,
                        predicted_tech: data.pred_labels,        //#Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                        Tx_res: data.TX_res_time,
                        TC_res:data.TC_res_time,
                        Total_res:data.Total_res_time,
                        specData:data.spec_data,                 //#Just to send a portion of the spectrum e.g.[60, 1000]
                        specLabels:data.pred_labels,            //#Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                        spectrum_span : data.spec_span_bins,     //#indicate the number of bins of the spectrum
                        tx_bin:data.tx_array_bins}, () =>        //#indicate the strt and the end of detected Transmissions
                    {
                        console.log("States setted");
                        console.log(this.state.ok_show);
                    })

            });
        
            socket.on("close_connection", () => {
                    console.log("[Client] Request to stop the connection From the server reicived")
                    socket.close()
                })
    }

    injectData = () => {
            const socket = io("http://localhost:5001")
            console.log("Emit inject signals..")
            socket.emit('inject_signals')
            this.setState({ showSuccessBadge: true });
            socket.on('end_prediction',(data) => {
                this.setState( 
                    {   
                        ok_show : true,
                        predicted_tech: data.pred_labels,        //#Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                        Tx_res: data.TX_res_time,
                        TC_res:data.TC_res_time,
                        Total_res:data.Total_res_time,
                        specData:data.spec_data,                 //#Just to send a portion of the spectrum e.g.[60, 1000]
                        specLabels:data.pred_labels,            //#Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                        spectrum_span : data.spec_span_bins,     //#indicate the number of bins of the spectrum
                        tx_bin:data.tx_array_bins}, () =>        //#indicate the strt and the end of detected Transmissions
                    {
                        console.log("States setted -- Data injected");
                        console.log(this.state.ok_show);
                    })

            });

    }



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////// Obsolete functions that doens't need to be used anymore /////////////////////////////////////////////////////////////////////

handleEnableKfk = () => {
    this.setState({use_kafka: !this.state.use_kafka}, () =>{
        console.log(this.state.use_kafka);
    })   
}

hadUpdateText = (event) => {
    this.setState (
        {
            [event.target.name]: event.target.value
        }
    )
}


reset_values = () => {
    this.setState( 
        {Tx_res: '--', TC_res:'--',Total_res:'--', startf : '--',endf : '--', ok_req : false  }, () =>{
            console.log(this.state.Tx_res);
            console.log(this.state.TC_res);
            console.log(this.state.Total_res);
        })
}


framework_test = () => {
        const socket = io("http://localhost:5005")   // 202481598508037 dipolkurz:May_1Swz 202481596708292 rack 3  202481602060659 skap6GHz 202481591141168 Scalessio_Sensor  202481597776599	bcn-L
        let value_fstar=this.state.startf
        let value_f_end=this.state.endf
        let value_FreqStart=this.state.FreqStartHz
        let value_FreqEnd=this.state.FreqEndHz
        socket.on('connect', function() {
            socket.emit('tx_metainfo', {snsid : "202481596708292",
            snsname : "bcn-L", 
            month : "Jun", 
            day : "10" ,
            nation : "Esp",
            technology : "test", 
            startf : value_fstar,
            endf : value_f_end, 
            freq_start:value_FreqStart, 
            freq_end:value_FreqEnd});
        });

        socket.on('ready_processffts', function() {
            console.log("Send request transmission detection")
            socket.emit('process_raw_ffts')
        });

        socket.on('ready_detect_tx', function() {
            socket.emit('api_framework_test');
        });

        socket.on('end_prediction',(data) => {
            this.setState( 
                {   predicted_tech: data.pred_labels,  // Struct that indicate the single Tx Indication  == Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                    Tx_res: data.TX_res_time, // Struct that time elapsed TDS
                    TC_res:data.TC_res_time,// Struct that time elapsed in TCS
                    Total_res:data.Total_res_time, // Struct that Total time elapsed
                    specData:data.spec_data ,   //# Just to send a portion of the spectrum e.g.[60, 1000]
                    specLabels:data.pred_labels, //#Predicted Labels Array --> [4.0, 'lte', 49.32, 51.51]
                    spectrum_span : data.spec_span_bins, // Indicate the number of bins of the spectrum
                    tx_bin:data.tx_array_bins}, () =>  // Indicate the strt and the end of detected Transmissions
                {
                    console.log("States setted") 
                    console.log(this.state.tx_bin)
                    console.log(this.state.predicted_tech)
                    console.log(this.state.Tx_res);
                    console.log(this.state.TC_res);
                    console.log(this.state.Total_res);
                    ;
                })

        });
    
        socket.on("close_connection", () => {
                console.log("[Client] Request to stop the connection From the server reicived")
                socket.close()
            })
        
    }
    baseline_test = () => {
        const socket = io("http://localhost:5005")   // 202481598508037 dipolkurz:May_1Swz 202481596708292 rack 3  202481602060659 skap6GHz 202481591141168 Scalessio_Sensor  202481597776599	bcn-L
        let value_fstar=this.state.startf
        let value_f_end=this.state.endf
        let value_FreqStart=this.state.FreqStartHz
        let value_FreqEnd=this.state.FreqEndHz
        socket.on('connect', function() {
            socket.emit('tx_metainfo', {snsid : "202481602060659",
            snsname : "rack_3", 
            month : "May", 
            day : "1" ,
            nation : "Esp",
            technology : "test", 
            startf : value_fstar,
            endf : value_f_end, 
            freq_start:value_FreqStart, 
            freq_end:value_FreqEnd});
        });

        socket.on('ready_processffts', function() {
            console.log("Send request transmission detection")
            socket.emit('process_raw_ffts')
        });

        socket.on('ready_detect_tx', function() {
            socket.emit('baseline_test');
        });
        
    }

    framework_dev_container = () => {
        //202481596708292 rack 3  202481602060659skap6GHz 202481591141168 Scalessio_Sensor  202481597776599	bcn-L
        let value_fstar=this.state.startf
        let value_f_end=this.state.endf
        let value_FreqStart=this.state.FreqStartHz
        let value_FreqEnd=this.state.FreqEndHz


        fetch("http://localhost:5005/services/api/v1.0/usertc", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
                })
            .then(res => {
                console.log("response: ", res);
            })
            .catch(err => {
                console.log("error:", err);
            });
        
        // fetch("http://localhost:5005/services/api/v1.0/usertc", {
        //         headers: {
        //             "Content-Type": "application/json; charset=utf-8"
        //         },
        //         method: "POST"
        //         })
        //         .then(response => {
        //             if (!response.ok) {
        //                 throw new Error(response.statusText)
        //             }
        //             return response.json()
        //             }).catch(err=>{
        //         console.log(err)
        //         })
        
        // fetch("http://localhost:5005/services/api/v1.0/usertc/test", {
        //         body: "{\"snsid\" : \"202481596708292\", \"snsname\" : \"rack_3\", \"month\" : \"May\", \"day\" : \"1\" , \"nation\" : \"Esp\", \"technology\" : \"test\", \"startf\" : \"20\", \"endf\" : \"1500\", \"freq_start\":\"20000000\", \"freq_end\":\"1500100000\" }",
        //         headers: {
        //             Accept: "application/json",
        //             "Content-Type": "application/json; charset=utf-8",
        //             Token: "sfg999666t673t7t82"
        //         },
        //         method: "POST"
        //         })
    }
    
}

{/* Result: inference time commented*/}
                    {/* <Row style={{marginLeft: '150px',marginRight:'150px'}}>                          
                        <Col className="mt-4"  >    
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>
                                    Electrosense API Response Time
                                </th>
                                <th>
                                    Transmission Detection Response Time
                                </th>
                                <th>
                                    Technology Classification Response time
                                </th>
                                <th>
                                    Total Response Time
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                    <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.Es_res}</Badge>
                                    </td>
                                <td>
                                    <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.Tx_res}</Badge>
                                </td>
                                <td>
                                    <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.TC_res}</Badge>
                                </td>
                                <td> 
                                    <Badge style={{color: 'green' , fontSize:'15px'}} bg="secondary">{this.state.Total_res}</Badge>
                                </td>
                                </tr>
                            </tbody>
                            </Table>
                        </Col>    
</Row>   */}