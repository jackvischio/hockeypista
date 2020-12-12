import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { Preferiti, PreferitiFake } from './Preferiti';

export default class Navbar extends Component {
    constructor(props) {
        super();

        this.active = props.active;
        this.path = props.path;

        // links on the navbar
        this.links = [
            { display: "Home", url: "/" },
            { display: "Campionati", url: "/campionati" },
            { display: "Società", url: "/societa" },
            { display: "Salvati", url: "/salvati" }
        ];

        this.state = {
            toggle: false,
            title: props.title,
            canBeSaved: ((props.canBeSaved) ? true : false)
        }
    }

    toggleNavbar() {
        let t = this.state.toggle;
        this.setState({ toggle: !t })
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light text-uppercase" style={{ padding: "10px" }}>
                <div className="navbar-brand p-0 m-0">
                    <Link className="navbar-brand p-0 mr-2" to="/">
                        <img src={logo} alt="home" style={{ width: "40px", margin: "0" }} />
                    </Link>
                    <strong> {this.state.title} </strong>
                </div>

                <button className="navbar-toggler navbar-toggler-right ml-auto" onClick={() => this.toggleNavbar()}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={"collapse navbar-collapse " + ((this.state.toggle) ? " show text-center" : "")}>
                    <div className="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
                        {this.links.map((l, i) => Elem(i, l.display, l.url, (l.display === this.active)))}
                    </div>
                    {((this.state.canBeSaved) ? <Preferiti path={this.path} /> : <PreferitiFake />)}
                    <Config />
                </div>
            </nav >
        )
    }
}

const Elem = (i, display, url, active) => {
    return (
        <Link key={i} className={"nav-item nav-link " + (active ? 'active' : '')} to={url}>{display}</Link>
    );
}

const Config = () => {
    return (
        <>
            <Link to="/configura" className="btn btn-light d-none d-md-block" title="Impostazioni" >
                <i className={"fas fa-cog"}></i>
            </Link>
            <div className="navbar-nav ml-auto mt-0 mt-lg-0 font-weight-bold d-block d-md-none">
                <Link to="/configura" className="nav-item nav-link" >
                    Impostazioni
                </Link>
            </div>
        </>
    )
}