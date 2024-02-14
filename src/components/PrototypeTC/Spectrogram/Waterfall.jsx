import React, {Component, useState, useEffect, useRef} from 'react'
import Spectrum from './spectrum';
import './colormap';
import { io } from "socket.io-client";
import './Waterfall.css'

export default class Waterfall extends Component{

    constructor(props){
        super(props);
        //this.handleChangeData = this.handleChangeData.bind(this);
        this.state = { // Not necessary to keep the other states as they are passed down from the parent component
             isDrawing: false,}
    }

    // handleChangeData(e){ // Not needed, because this component(waterfall) does not need to modify or manage the state directly but instead uses the props passed down from the parent component.
    //     this.props.dataProps(e.target.id, e.target.value);
    //     this.props.dataLabel(e.target.id, e.target.value);
    //     this.props.dataBin(e.target.id, e.target.value);
    //     this.props.dataSpan(e.target.id, e.target.value);
    //     this.props.dataCenterF(e.target.id, e.target.value);
    // } , why:
    // One-way Data Flow: React components typically follow a unidirectional
    // (one-way) data flow, where state is managed in parent components and passed 
    // down to child components via props. In your case, PSDCampComponent.jsx acts as
    // the parent component managing and receiving state from the backend, and Waterfall.jsx 
    // is the child component that visualizes this data. The child component does not need to
    // modify or manage the state directly but instead uses the props passed down from the
    // parent component.

    //componentDidMount() {
        // var spect = new Spectrum(
        //     "waterfall", {
        // });
        //spect.setCenterHz(100000000); //--> THE CENTER DEPENDS ON THE SPECTRUM THAT WE ARE ANALYZING, DEPENDS ON THE SPECTRUM DATA
        //spect.setSpanHz(37470000);  //--> THE SPAN DEPENDS ON THE SPECTRUM THAT WE ARE ANALYZING, DEPENDS ON THE SPECTRUM DATA
    //}
    
    render(){
        return(
            <div className='LiveWaterfall'>
                    <header class="section-heading">
                        <h4></h4>
                        <div class='container'>
                            <div class="row">  
                                <div class="col">
                                <button type="button" className="btn btn-warning" onClick={this.startDrawing}>Show Spectrum</button>
                                </div>
                                <div className="col">
                                    <button type="button" className="btn btn-warning" onClick={this.stopDrawing}>Stop Drawing</button>
                                </div>
                            </div>
                        </div>
                    </header>                    
                    <body>
                        <canvas id="waterfall" style={{ border: "8px solid #d3d3a3" }}></canvas>
                        <p/>
                    </body>
            </div>
        )
    }

    
    resetSpecPlot = () =>{
        var spectrum = new Spectrum(
            "waterfall", {
        });
    }

    startDrawing = () => {
        this.setState({ isDrawing: true }, this.showSpectrum);
    }

    stopDrawing = () => {
        this.setState({ isDrawing: false });
    }
    showSpectrum = () => {
        if (!this.state.isDrawing) return;

        const { dataSpectrum, dataLabel, dataBin, dataSpan, dataCenterF} = this.props;
        let a = dataCenterF[0]; 
        let b = dataCenterF[1];
        let cf = (parseInt(a,10) + parseInt(b,10)) / 2;
        let span = dataSpan * 10000;
        var spectrum = new Spectrum("waterfall", { spanHz: parseInt(dataSpan,10) });
        spectrum.setCenterHz(cf);
        spectrum.setSpanHz(span);
    
        // auxiliar function to add data with delay
        const addDataWithDelay = (index) => {
            if (!this.state.isDrawing) return;

            if (index < dataSpectrum.length && this.state.isDrawing) {
                spectrum.addData(dataSpectrum[index]);
                spectrum.addBoxPlot(dataLabel, dataBin);
                if (index === dataSpectrum.length - 1) {
                    index = -1;
                }
                
                setTimeout(() => addDataWithDelay(index + 1), 50); // use setTimeout to add data with delay
            }
        };
    
        
        addDataWithDelay(0); // Start adding data with delay from index 0


        // this.setState({
        //     spectrum_data:this.props.dataProps, 
        //     transmissions:this.props.dataLabel, 
        //     tx_bin:this.props.dataBin, 
        //     SpectCenterF:this.props.dataCenterF, 
        //     SpanHz:this.props.dataSpan}, () => {
        //     // Spectrum initialization and related operations 
        //     // into the setState callback is to ensure that 
        //     // these actions are performed after the state has 
        //     // been updated and the component has potentially 
        //     // re-rendered. This ensures that the calculations 
        //     // and operations that depend on the updated state 
        //     // values are executed with the most current data


        //     // console.log(dataCenterF)
        //     // console.log(SpanHz)
        //     let a = this.state.SpectCenterF[0]; 
        //     let b = this.state.SpectCenterF[1];
        //     let cf = (parseInt(a,10)+parseInt(b,10))/2;
        //     let span=this.state.SpanHz*10000;
        //     var spectrum = new Spectrum(
        //         "waterfall", {spanHz:parseInt(this.state.SpanHz,10)
        //         });
        //     spectrum.setCenterHz(cf) 
        //     spectrum.setSpanHz(span); 
        //     if (this.state.spectrum_data.length > 0 ) {
        //             for (var i = 0; i < this.state.spectrum_data.length ; i += 1) {
        //                 spectrum.addData(this.state.spectrum_data[i]);
        //             }
        //             spectrum.addBoxPlot(this.state.transmissions,this.state.tx_bin)
        //         } 
        //     }) 
    }
}

