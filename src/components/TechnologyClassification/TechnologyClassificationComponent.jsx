import React, { Component } from 'react';
import { io } from "socket.io-client";
import Waterfall from '../Waterfall/Waterfall';
import PSDCampComponent from '../PSDCampaignComponent/PSDCampComponent'
import './TechnologyClassificationComponent.css'

export default class TechnologyClassificationComponent extends Component{

    render() {
        return(
            <div className='TechnologyClassificationComponent'>
                <p/>
                <h2> Radio Technology Classification and Anomaly Detection </h2>
                <PSDCampComponent/>
                <Waterfall/>
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




