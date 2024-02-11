import React, { Component } from 'react';
import './FooterComponent.css';
import { Link } from 'react-router-dom';
import LogoEs from './resources/esense_logo.png';
import LogoNato from './resources/nato.jpg';
import LogoImdea from './resources/imdea-networks-white-background.png'
import Logotwitt from './resources/logo-rond-twitter.png'
export default class FooterComponent extends Component {

    render() {
        return ( 
            <div className="FooterComponent">
                <section className="footer-main border">
                    <div className="container">
                            <div className="row align-items-center" >
                                <div className="col">
                                <Link className='brand-wrap'>
                                        <img className="logo" src={LogoImdea} />
                                </Link>
                                </div>
                                
                                <div className="col">
                                    <Link className='brand-wrap'>
                                            <img className="logo" src={LogoNato} />
                                    </Link>
                                </div>
                                
                                <div className="col">
                                    <Link className='brand-wrap'>
                                            <img className="logo" src={LogoEs} />
                                    </Link>
                                </div>
                            </div>
                    </div>
                </section>




                    <p className="text-muted">
                        <small>&copy; 2021 by Electrosense</small> | <Link className='brand-wrap' href='https://twitter.com/electrosensenet'><img className="logo" src={Logotwitt} /></Link>
                    </p>
                
            </div>
        )
    }
}