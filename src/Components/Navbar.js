import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'

const Elem = (i, display, url, active) => {
    return (
        <Link key={i} className={`nav-item nav-link ${active ? 'active' : ''}`} to={url}>{display}</Link>
    );
}

const Navbar = (props) => {

    const links = [
        { display: "Home", url: "/" },
        { display: "Campionati", url: "/campionati" },
        { display: "Società", url: "/societa" },
        { display: "Salvati", url: "/salvati" }
    ];

    const str = links.map((l, i) => Elem(i, l.display, l.url, (l.display == props.active)));

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light text-uppercase">
            <div className="navbar-brand p-0">
                <Link className="navbar-brand p-0" to="/">
                    <img src={logo} alt="home" style={{ width: "40px", margin: "0" }} />
                </Link>
                <strong className="pl-2">RISULTATI HOCKEY PISTA</strong>
            </div>

            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarResponsive">
                <div className="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
                    {str}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;