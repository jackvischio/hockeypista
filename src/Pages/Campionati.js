import React, { Component } from 'react'

import GtagInitialize from '../API/ApiAnalytics'

import { CaricaCampionati } from '../Middleware/MwCampionati'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampLarge as CampElement } from '../Components/Campionati/CampLarge'

class Campionati extends Component {

    constructor(props) {
        super();

        // URL PARAMS

        // CACHED THINGS

        // COMPONENT PARAMS
        this.reloaded = false;
        if ((window.performance) && (performance.navigation.type == 1)) {
            this.reloaded = true;
        }

        // TITLE AND ANALYTICS
        document.title = "Campionati";
        GtagInitialize();

        // SETTING STATE
        this.state = {
            campionati: [],
            loaded: false
        };

        document.title = "Campionati - HockeyPista 2.0"

        // google analytics
        GtagInitialize();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = "Campionati - HockeyPista 2.0"

        CaricaCampionati.GetAll(this.reloaded, (camps) => {
            this.state.campionati = camps;
            this.setState({ loaded: true });
        }, () => { });
    }

    render() {
        return (
            <>
                <Navbar title={"Campionati"} active={"Campionati"} active={"Campionati"} />
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
