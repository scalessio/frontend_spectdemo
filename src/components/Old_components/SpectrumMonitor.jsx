import React, {Component} from 'react';

import "./SpectrumMonitor.css"
import { BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import WellcomeComponent from './WellcomePage/WellcomeComponent';
import TechnologyClassificationComponent from './TechnologyClassification/TechnologyClassificationComponent'

export default class SpectrumMonitor extends Component {
    //Definire la variabile all'interno del componente clase se vogliamo aggiungere un altra variabile
    // dobbiamo inserire una virgola
    state = {
        contatore : 0,
    }

    // nel metodo render non dobbiamo passare niente (props) perche ci viene in automatico utilizzando "this" 
    // e utilizziamo this props per accedere ai valoriç
    //<button onClick={this.startSock}>Start Demo</button>


    
    render () {
        return (
            <div className="SpectrumMonitor">
                <Router> 
                    <Switch>
                    <Route path='/' exact component={WellcomeComponent}/>
                    <Route path='/technclassif' exact component={TechnologyClassificationComponent}/>
                    
                    </Switch>
                </Router>


                
                
        </div>

    )
}

}
