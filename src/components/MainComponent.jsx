import React, {Component} from 'react';

import "./MainComponent.css"
import { BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import WellcomeComponent from './WellcomePage/WellcomeComponent';
import TechnologyClassificationComponent from './PrototypeTC/TechnologyClassificationComponent';
import HeaderComponent from './Header/HeaderComponent';
import FooterComponent from './Footer/FooterComponent';

export default class MainComponent extends Component {

    state = {
        contatore : 0,
    }

    
    render () {
        return (
            <div className="MainComponent">
                <Router> 
                 <HeaderComponent/> 
                    <Switch>
                    <Route path='/' exact component={WellcomeComponent}/>
                    {/* <Route path='/technclassif' exact component={TechnologyClassificationComponent}/>/<Route path='/testparl' exact component={MatrixC}/>  */}
                    <Route path='/technclassif' exact component={TechnologyClassificationComponent}/> 
                    </Switch>
                    <p/>
                    <div className="bottom-spectrum-background"></div>

                    
                    <FooterComponent/>
                </Router>


                
                
        </div>

    )
}

}
