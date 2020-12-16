import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga'

import { creaSocieta } from '../Cache/CacheSocieta';

import Navbar from '../Components/Varie/Navbar'

export default class SocietaAll extends Component {
    constructor() {
        super();

        document.title = "Società - HockeyPista 2.0";

        // google analytics
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const societa = creaSocieta();
        return (
            <>
                <Navbar title="Società hockey pista" active="Società" />
                <div className="container">
                    <div className="row">
                        {societa.map((s, i) => <SocietaBlock {...s} key={i} />)}
                    </div>
                </div>
            </>
        )
    }
}

function SocietaBlock(props) {

    const colStyle = {
        padding: "10px"
    }

    const cardStyle = {
        borderRadius: "10px",
        height: "100%",
        position: "relative",
        margin: 0,
        cursor: "pointer"
    }

    const logoStyle = {
        margin: "0 auto",
        textAlign: "center",
        width: "50%",
        maxWidth: "120px"
    }

    return (
        <div className="col-lg-3 col-md-6 col-sm-12 p-2" style={colStyle}>
            <div className="card highlight" style={cardStyle} >
                <Link className="link-unstyled" to={"/societa/" + props.id} query={{ nome: props.nome }}>
                    <div className="card-body text-center">
                        <img src={props.logo} style={logoStyle} alt={props.nome} />
                        <h5 className="card-title text-center mt-3"> {props.nome} </h5>
                    </div>
                </Link>
            </div>
        </div>
    )
}
