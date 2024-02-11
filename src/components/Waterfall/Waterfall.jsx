import React, {Component, useState, useEffect, useRef} from 'react'
import Spectrum from './spectrum.js'
import { io } from "socket.io-client";
import './Waterfall.css'

export default class Waterfall extends Component{

    componentDidMount() {
        var spect = new Spectrum(
            "waterfall", {
        });
        spect.setCenterHz(207000000);
        spect.setSpanHz(26000000);
    }

    render(){

        return(
            <div className='LiveWaterfall'>
                    <header class="section-heading">
                        
                    </header>                    
                    <body>
                        
                        <canvas id="waterfall" style={{ border: "8px solid #d3d3a3" }}></canvas>
                        <script src="colormap.js"></script>
                        <script src="spectrum.js"></script>
                        <p/>
                        <div class="container">
                            <div class="row"> 
                                
                                <div class="col">
                                    <button type="button" class="btn btn-warning" onClick={this.processData} > Classification Engine </button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-warning" onClick={this.refreshPlot} > Reset </button>
                                </div>
                            </div>
                        </div>
                        
                        <canvas id="myCanvas" width="400" height="10" style={{color:"white"}} ></canvas>
                    </body>
            </div>
        )
    }

    refreshPlot = () =>{
        var spectrum = new Spectrum(
            "waterfall", {
        });
    }
    
    sensorProcess = () =>{
        const socket = io("http://")  //Call the Controller

        socket.on("connect", () => {
            console.log("[ Client ] Attempt to request from the Frontend: Trigger Extraction Layer");
            socket.emit("trigger_el")
            //socket.emit("send_processed_data")
        })

        socket.on("ack_connect", () => {
            console.log("[ Client ] Reicived the ack connection from the Yago");
            //socket.emit("send_processed_data")
        })


    }
    
    //<script src="script.js"></script>
    processData = () => {
        var spectrum = new Spectrum(
            "waterfall", {
        });
        
        spectrum.setCenterHz(207000000);
        spectrum.setSpanHz(26000000);
        const socket = io("http://localhost:5000")

        socket.on("connect", () => {
            console.log("[ Client ] Attempt to request from the Frontend: Trigger Extraction Layer");
            //socket.emit("trigger_el")
            socket.emit("send_processed_data")
        })

        socket.on("ack_el", () => {
            console.log("[ Client ] Request to active the Pipeline");
            socket.emit("send_processed_data")
        })

        socket.on("data processed", (data) => {

            //console.log("Tuple_Anomaly")
            //console.log(data.Tuple_Anomaly)
            //console.log("data.Tuple_signals")
            //console.log(data.Tuple_signals)

            if (data.s) {
                spectrum.addData(data.s);
            }

            // Draw box on the waterfall for signal detection
            if (data.Widths.length > 0) {
                spectrum.addBoxPlot(data.Widths, data.Tuple_signals)
                //Call function to draw the boxes
            }
        })

        socket.on("closeCon", () => {
            console.log("[Client] Request to stop the connection From the server reicived")
            socket.close()
        })
        /*
        if (data.s) {
            spectrum.addData(data.s);
        } else {
            if (data.center) {
                spectrum.setCenterHz(data.center);
            }
            if (data.span) {
                spectrum.setSpanHz(data.span);
            }*/
        }
}

