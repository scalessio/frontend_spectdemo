import React, {Component} from 'react';

import "./MainComponent.css"
import { BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import WellcomeComponent from './WellcomePage/WellcomeComponent';
import TechnologyClassificationComponent from './PrototypeTC/TechnologyClassificationComponent';
import HeaderComponent from './Header/HeaderComponent';
import FooterComponent from './Footer/FooterComponent';
import Localization from './LocalizationComponent/Localization';
//import MatrixC from './Parking_test/MatrixC';



export default class MainComponent extends Component {
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
            <div className="MainComponent">
                <Router> 
                 <HeaderComponent/> 
                    <Switch>
                    <Route path='/' exact component={WellcomeComponent}/>
                    {/* <Route path='/technclassif' exact component={TechnologyClassificationComponent}/>/<Route path='/testparl' exact component={MatrixC}/>  */}
                    <Route path='/technclassif' exact component={TechnologyClassificationComponent}/> 
                    
                    <Route path='/localization' exact component={Localization}/>
                    </Switch>
                    <p/>
                    {/* <FooterComponent/> */}
                </Router>


                
                
        </div>

    )
}

}
