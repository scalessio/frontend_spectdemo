import React, { Component } from 'react';
import logo from './logo.svg';
import LeaftComponent from '../LeaftComponent/LeaftComponent';
import './WellcomeComponent.css'
export default class WellcomeComponent extends Component {
    render() {
        return(
            <div className='WellcomeComponent'>
                <section class="section-content bg padding-y">
                    <header class="section-heading">
                    </header>
                    <p>
                    </p>
                <div class="container">
                    <div class="row">
                        
                        <div class="col-7">
                            <h2>Electrosense Network </h2>
                            <p/><LeaftComponent/>
                        </div>
                        
                        <div class="col">
                            <div class="row">
                                <br/><h3>Spectrum Anomaly Detection & Transmitter Localization Engines</h3>
                            </div>
                            <div class="btn-groups">
                            <p/><button type="button" class="btn btn-lg btn-primary mt-5 mb-5" onClick={this.routeToTC}> Anomaly Detection </button>
                            {/* <p/><button type="button" class="btn btn-lg btn-primary mt-5 mb-5" onClick={this.routeToTest}> Test park </button> */}
                            
                            <p/><button type="button" class="btn btn-lg btn-primary mt-5" disabled> Localization  </button>
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

