import React, { Component } from 'react';
import { io } from "socket.io-client";
import Waterfall from './Spectrogram/Waterfall';
import PSDCampComponent from './Psd_process/PSDCampComponent'
import './TechnologyClassificationComponent.css'

export default class TechnologyClassificationComponent extends Component{

    render() {
        return(
            <div className='TechnologyClassificationComponent'>
                <p/>
                <h2 className='custom-h2 blinking'> Spectrum anomaly detection engine </h2>
                <PSDCampComponent/>
                <p/>
                
            </div>
        )
    }

    //<button type="button" class="btn btn-warning" onClick={this.return_to_wellcome} > Back </button>
    return_to_wellcome = () => {
        console.log("Clicked")
        this.props.history.push('/')
    }
}




