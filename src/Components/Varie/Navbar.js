import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../assets/logo.png'

const Elem = (i, display, url, active) => {
    return (
        <Link key={i} className={`nav-item nav-link ${active ? 'active' : ''}`} to={url}>{display}</Link>
    );
}


export default class Navbar extends Component {
    constructor(props) {
        super();

        this.title = (props.title !== undefined) ? props.title : "risultati hockey pista";
        this.active = props.active;

        // links on the navbar
        this.links = [
            { display: "Home", url: "/" },
            { display: "Campionati", url: "/campionati" },
            { display: "Società", url: "/societa" },
            { display: "Salvati", url: "/salvati" }
        ];

        this.state = { toggle: false }
    }

    toggleNavbar() {
        let t = this.state.toggle;
        this.setState({ toggle: !t })
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light text-uppercase">
                <div className="navbar-brand p-0">
                    <Link className="navbar-brand p-0" to="/">
                        <img src={logo} alt="home" style={{ width: "40px", margin: "0" }} />
                    </Link>
                    <strong> {this.title} </strong>
                </div>

                <button className="navbar-toggler navbar-toggler-right" onClick={() => this.toggleNavbar()}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={"collapse navbar-collapse" + ((this.state.toggle) ? " show text-center" : "")}>
                    <div className="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
                        {this.links.map((l, i) => Elem(i, l.display, l.url, (l.display === this.active)))}
                    </div>
                </div>
            </nav>
        )
    }
}