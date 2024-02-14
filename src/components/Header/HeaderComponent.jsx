import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './HeaderComponent.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
import '../../resources/css/responsive.css';
import '../../resources/css/ui.css'
import Logo from './resources/esense_logo.png';

//"export default" viene eliminato e sostituito in basso con with router per fare in modo che viene fatto il refresh e rende 
// dinamico questo HEADER.

class HeaderComponent extends Component{

    
    render(){
        return(
            <div className='HeaderComponent'>
                {/* <header className="section-header">
                    <section className="header-main border-bottom">
                        <div className="container">
                            <div className="row align-items-center" >
                                
                                <div className="col">
                                    <Link className='brand-wrap' to='/'>
                                        <img className="logo" src={Logo} />
                                    </Link>
                                </div>
                                <div className="col">
                                <h3>Electrosense Demo</h3>
                                </div>
                                <div className="col">
                                <User/>
                                </div>
                                
                                
                            </div>
                        </div>
                    </section>
                </header> */}

                <nav className="navbar navbar-main navbar-expand-lg border-bottom">
                    <Menu />
                </nav>

            </div>
        )
    }
}

export default withRouter(HeaderComponent);

const Menu = () => {
    return (
        <div className="container d-flex justify-content-center" style={{ width: '55%' }}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main_nav3"
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="main_nav3">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className='brand-wrap' to='/'>
                  <img className="logo" src={Logo} alt="Logo" />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/'>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/technclassif'>Anomaly Detection</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/localization'>Localization</Link>
              </li>
            </ul>
          </div>
        </div>
      )
}

const Search = () => {
    return (
        <div className="col-lg-4 col-xl-5 col-sm-8 col-md-4 d-none d-md-block">
            <form action="#" className="search">
                <div className="input-group w-100">
                    <input type="text" className="form-control" style={{width:'55%'}} placeholder="Cerca" />
                    <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                    </div>
                </div>
            </form>
        </div>
        )
    }

const User = () => {
    return (
        <div className="col-lg-5 col-xl-4 col-sm-8 col-md-4 col-7">
            <div className="d-flex justify-content-end">
                <Link className="widget-header mr-3" to='/'>
                    <div className="icon icon-sm rounded-circle border ">
                        <i className="fa fa-user"></i>
                    </div>
                </Link>


                
            </div>
        </div>
        )
    }


const InfoUser = () => {
    var bk = true
    if (bk){
        return(
        <div className="text">
            <div>  
                <Link to='/logout'> Logout</Link>
                <Link to='/Registra'> Registra</Link>
            </div>
        </div>
        )
    }else{
        return(
            <Link className="widget-header mr-3" to='/registra'>
            <div className="icon icon-sm rounded-circle border ">
                <i className="fa fa-users"></i>
            </div>
        </Link>
        )
    }
}