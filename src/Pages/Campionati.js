import React, { Component } from 'react'
import ReactGA from 'react-ga'

import { caricaCampionati } from '../API/ApiCampionati'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampLarge as CampElement } from '../Components/Campionati/CampLarge'

class Campionati extends Component {

    constructor(props) {
        super();

        this.state = {
            campionati: [],
            loaded: false
        };

        document.title = "Campionati - HockeyPista 2.0"

        // google analytics
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        caricaCampionati(false, (camps) => {
            this.state.campionati = camps;
            this.setState({ loaded: true });
        });
    }

    render() {
        return (
            <>
                <Navbar title={"Campionati"} active={"Campionati"} active={"Campionati"}  />
                <div className="container">
                    <div className="row">
                        {(!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => <CampElement key={i} {...camp} />)}
                    </div>
                </div>
            </>
        )
    }
}

export default Campionati;
