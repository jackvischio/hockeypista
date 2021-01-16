import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { Preferiti, PreferitiFake } from './Preferiti';

export default class Navbar extends Component {
    constructor(props) {
        super();

        this.active = props.active;
        this.path = props.path;
        this.title = (props.title !== undefined) ? props.title : "Risultati hockey pista"
        this.titleFun = props.titleFun;

        this.state = {
            toggle: false,
            canBeSaved: ((props.canBeSaved) ? true : false)
        }
    }

    toggleNavbar() {
        let t = this.state.toggle;
        this.setState({ toggle: !t })
    }

    render() {
        const links = [
            { display: "Home", url: "/" },
            { display: "Campionati", url: "/campionati" },
            { display: "Società", url: "/societa" },
            { display: "Salvati", url: "/salvati" }
        ];

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light text-uppercase" style={{ padding: "10px" }}>
                <div className="navbar-brand p-0 m-0">
                    <button className="navbar-toggler navbar-toggler-right ml-auto mr-2" onClick={() => this.toggleNavbar()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand p-0 mr-2 d-none d-md-inline-block" to="/">
                        <img src={logo} alt="Torna alla home" style={{ width: "40px", margin: "0" }} />
                    </Link>
                    <strong> {(this.titleFun !== undefined) ? this.titleFun() : this.title} </strong>
                </div>

                <div className={"collapse navbar-collapse " + ((this.state.toggle) ? " show text-center" : "")}>
                    <div className="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
                        {links.map((l, i) => Elem(i, l.display, l.url, (l.display === this.active)))}
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
            <Link to="/impostazioni" className="btn btn-light d-none d-md-block" title="Impostazioni" >
                <i className={"fas fa-cog"}></i>
            </Link>
            <div className="navbar-nav ml-auto mt-0 mt-lg-0 font-weight-bold d-block d-md-none">
                <Link to="/impostazioni" className="nav-item nav-link">
                    Impostazioni
                </Link>
            </div>
        </>
    )
}