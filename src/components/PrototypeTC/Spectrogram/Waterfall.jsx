import React, {Component, useState, useEffect, useRef} from 'react'
import Spectrum from './spectrum.js'
import { io } from "socket.io-client";
import './Waterfall.css'

export default class Waterfall extends Component{

    constructor(props){
        super(props);
        this.handleChangeData = this.handleChangeData.bind(this);
        this.state = { spectrum_data: [] , transmissions :[], tx_bin:[], SpanHz:0 , SpectCenterF :[]}
    }

    handleChangeData(e){ 
        this.props.dataProps(e.target.id, e.target.value);
        this.props.dataLabel(e.target.id, e.target.value);
        this.props.dataBin(e.target.id, e.target.value);
        this.props.dataSpan(e.target.id, e.target.value);
        this.props.dataCenterF(e.target.id, e.target.value);
    }

    componentDidMount() {
        // var spect = new Spectrum(
        //     "waterfall", {
        // });
        //spect.setCenterHz(100000000); //--> THE CENTER DEPENDS ON THE SPECTRUM THAT WE ARE ANALYZING, DEPENDS ON THE SPECTRUM DATA
        //spect.setSpanHz(37470000);  //--> THE SPAN DEPENDS ON THE SPECTRUM THAT WE ARE ANALYZING, DEPENDS ON THE SPECTRUM DATA
    }
    
    render(){
        return(
            <div className='LiveWaterfall'>
                    <header class="section-heading">
                        <h4></h4>
                        <div class='container'>
                            <div class="row">  
                                <div class="col">
                                    <button type="button" class="btn btn-warning" onClick={this.showSpectrum} > Show Spectrum </button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-warning" onClick={this.resetSpecPlot} >  Reset Spectrum </button>
                                </div>
                            </div>
                        </div>
                    </header>                    
                    <body>
                        
                        <canvas id="waterfall" style={{ border: "8px solid #d3d3a3" }}></canvas>
                        <script src="colormap.js"></script>
                        <script src="spectrum.js"></script>
                        <p/>
                        <div class="container">
                            <div class="row"> 
                            <div class="col">
                                    
                            </div> 
                                {/* 
                                <div class="col">
                                    <button type="button" class="btn btn-warning" onClick={this.refreshPlot} > Reset </button>
                                </div>*/}
                            </div>
                        </div>
                        
                        <canvas id="myCanvas" width="400" height="10" style={{color:"white"}} ></canvas>
                    </body>
            </div>
        )
    }

    
    resetSpecPlot = () =>{
        var spectrum = new Spectrum(
            "waterfall", {
        });
    }
    showSpectrum = () => {
            
            this.setState({spectrum_data:this.props.dataProps, transmissions:this.props.dataLabel, tx_bin:this.props.dataBin, 
                SpectCenterF:this.props.dataCenterF, SpanHz:this.props.dataSpan}, () => {
            
            // console.log(dataCenterF)
            // console.log(SpanHz)
            
            }) 
            let a = this.state.SpectCenterF[0]; 
            let b = this.state.SpectCenterF[1];
            let cf = (parseInt(a,10)+parseInt(b,10))/2;
            let span=this.state.SpanHz*10000;
            console.log(cf)
            console.log(span)
            var spectrum = new Spectrum(
                "waterfall", {spanHz:parseInt(this.state.SpanHz,10)
                });

            
            spectrum.setCenterHz(cf) 
            spectrum.setSpanHz(span); 

            if (this.state.spectrum_data.length > 0 ) {
                    for (var i = 0; i < this.state.spectrum_data.length ; i += 1) {
                        spectrum.addData(this.state.spectrum_data[i]);
                    }
                    
                    spectrum.addBoxPlot(this.state.transmissions,this.state.tx_bin)
                } 

    }

        
}

