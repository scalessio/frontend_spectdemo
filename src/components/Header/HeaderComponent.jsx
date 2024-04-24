import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './HeaderComponent.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
//import '../../resources/css/responsive.css';
//import '../../resources/css/ui.css'
//import './assets/css/style.css';
import Logo from './resources/D_Zx-zGz_400x400.png';

//"export default" viene eliminato e sostituito in basso con with router per fare in modo che viene fatto il refresh e rende 
// dinamico questo HEADER.

class HeaderComponent extends Component{
    render(){
        return(
            <div className='HeaderComponent'>
                <nav className="navbar navbar-expand-md bg-dark fw-normal">
                    <Menu />
                </nav>

            </div>
        )
    }
}

export default withRouter(HeaderComponent);

const Menu = () => {
    return (
        // I want the items at the center of the page
        
        <div className="container-fluid">
          <div className="collapse navbar-collapse " id="navcol-1">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className='navbar-brand' to='/'> </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/'>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/technclassif'>Spectrum Detection</Link>
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