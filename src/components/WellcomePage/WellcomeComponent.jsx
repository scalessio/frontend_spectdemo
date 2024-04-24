import React, { Component } from 'react';
import LeaftComponent from './LeaftComponent/LeaftComponent';
import './WellcomeComponent.css'
export default class WellcomeComponent extends Component {
    render() {
        return(
            <div className='WellcomeComponent'>
                <section class="section-content bg padding-y">
                    <header class="section-heading">
                    </header>
                <div class="container">
                    <div class="row">
                        <div class="col-7">
                            <h2>Crowdsensing Network </h2>
                            <p/><LeaftComponent/>
                        </div>
                        <div class="col">
                            <div class="row">
                                <br/><h3>Spectrum Anomaly Detection Engine</h3>
                            </div>
                            <div class="btn-groups">
                            <p/><button type="button" class="btn btn-lg btn-primary mt-5 mb-5" onClick={this.routeToTC}> Spectrum Detection </button>
                            </div>
                        </div>
                    </div>
                </div>
                </section>
            </div>

        )
    }
    routeToTC = () => {
        console.log("Clicked")
        this.props.history.push('/technclassif')
    }

    routeToTest = () => {
        console.log("Clicked")
        this.props.history.push('/testparl')
    }


}

    //<img src={logo} className="App-logo" alt="logo"/>

