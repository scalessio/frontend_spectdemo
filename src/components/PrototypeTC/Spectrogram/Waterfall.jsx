import React, {Component, useState, useEffect, useRef} from 'react'
import Spectrum from './spectrum';
import './colormap';
import { io } from "socket.io-client";
import './Waterfall.css'

export default class Waterfall extends Component{

    constructor(props) {
        super(props);
        this.spectrum = null; // Inizializza qui l'istanza di Spectrum come null
        this.timeoutIDs = []; // Per tracciare i timeout
        this.currentIndex = 0; // Inizializza la variabile index a 0
        this.firstTime = true;
        //this.canvasRef = React.createRef(); // Aggiungi questa linea
        //this.handleChangeData = this.handleChangeData.bind(this);
        this.state = {// Not necessary to keep the other states as they are passed down from the parent component
            isDrawing: false,
            //canvasWidth: window.innerWidth // initialize with a predefined width
        };
    }

    componentDidUpdate(prevProps) {
        // Controlla se i dati rilevanti sono cambiati
        if (this.props.dataLabel.length !== prevProps.dataLabel.length || this.props.dataBin.length !== prevProps.dataBin.length ) {
            this.currentIndex = 0;
            console.log("I dati dello spettro sono cambiati, riavvio il disegno...");
            this.stopDrawing(); // Stop drawing if it's already started
            const { dataSpectrum, dataLabel, dataBin, dataSpan, dataCenterF} = this.props; 
            if (this.firstTime===true) {
                console.log("First time drawing the spectrum...");
                this.spectrum = new Spectrum("waterfall", { spanHz: parseInt(dataSpan, 10) });
                let CenterHz = (parseInt(dataCenterF[0], 10) + parseInt(dataCenterF[1], 10)) / 2;
                let spanHz = dataSpan * 10000; 
                this.spectrum.setCenterHz(CenterHz);
                this.spectrum.setSpanHz(spanHz); //(100, 5377)r
                this.firstTime = false;}
            this.startDrawing()
        }
    }

    render(){
        const { ok_show_butt } = this.props;
        return(
            <div className='LiveWaterfall'>
                    <header className="section-heading">
                        <h4></h4>
                        <div class='container'>
                            <div class="row">  
                                <div className="col">
                                <button type="button" className="btn btn-warning" disabled={!ok_show_butt} onClick={this.startDrawing}>Show Spectrum</button>
                                </div>
                                <div className="col">
                                    <button type="button" className="btn btn-warning" onClick={this.stopDrawing}>Stop Drawing</button>
                                </div>
                            </div>
                        </div>
                    </header>                    
                    <body>
                    {/* ref={this.canvasRef} */}
                    <canvas id="waterfall" style={{border: "8px solid #d3d3a3" } }></canvas>
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
        // Clear all the timeout
        this.timeoutIDs.forEach((id) => clearTimeout(id));
        this.timeoutIDs = []; // Reset dell'array di ID dopo la cancellazione
        this.setState({ isDrawing: false });
    }

    showSpectrum = () => {
        if (!this.state.isDrawing || !this.spectrum) return; // Controlla che il disegno sia attivo e che spectrum esista
        const { dataSpectrum, dataLabel, dataBin, dataSpan, dataCenterF} = this.props; 
        this.addDataWithDelay(this.currentIndex); // Start adding data with delay from index 0
    }

    addDataWithDelay = (index) => {
        if (!this.state.isDrawing) return;
        const { dataSpectrum, dataLabel, dataBin } = this.props;
        if (index < dataSpectrum.length) {
            this.spectrum.addData(dataSpectrum[index]);
            this.spectrum.addBoxPlot(dataLabel, dataBin, 'dab');
            this.currentIndex = index + 1; // Aggiorna currentIndex per la prossima iterazione
            if (this.currentIndex === dataSpectrum.length) {
                this.currentIndex = 0; // Ripeti dal primo indice se necessario
            }

            let timeoutID = setTimeout(() => this.addDataWithDelay(this.currentIndex), 50);
            this.timeoutIDs.push(timeoutID);
        }
    };
}



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