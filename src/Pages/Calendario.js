import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import GtagInitialize from '../API/ApiAnalytics';

import { CaricaCalendario } from '../Middleware/MwCalendario';
import { CaricaCampionati } from '../Middleware/MwCampionati';

import Giornata from '../Components/Calendario/Giornata';
import Loader from '../Components/Varie/Loader';
import Navbar from '../Components/Varie/Navbar';
import ErroreNotFound from '../Components/Modals/ErroreNotFound';

export default class Calendario extends Component {
    constructor(props) {
        super();

        // URL PARAMS
        this.id_camp = parseInt(props.match.params.id);

        // CACHED THINGS
        this.camp = CaricaCampionati.GetByID(this.id_camp);

        // COMPONENT PARAMS
        this.path = props.location.pathname;
        this.error = (this.camp === null);
        this.title = (!this.error ? ("Calendario " + this.camp.abbr) : "Calendario");
        this.reloaded = false;
        if ((window.performance) && (performance.navigation.type == 1)) {
            this.reloaded = true;
        }

        // TITLE AND ANALYTICS
        document.title = this.title;
        GtagInitialize();

        // SETTING STATE
        this.state = { calendario: [], loaded: false }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = this.title + " - HockeyPista 2.0"

        if (!this.error) {
            CaricaCalendario.Campionato(this.id_camp, this.reloaded, (cal) => {
                cal.forEach(g => {
                    this.state.calendario.push(g);
                });
                this.setState({
                    loaded: true
                });
            });
        }
    }

    render() {
        return (
            <>
                {(!this.error) ? null : <ErroreNotFound title="Calendario non trovato" callBack={() => { this.props.history.goBack(); }} />}
                <Navbar path={this.path} title={this.title} canBeSaved={true} />
                <div className="container p-2">
                    <div className="card mt-2 mb-2">
                        <div className="card-body">
                            <div className="text-center">
                                <Link to={"/campionato/" + this.id_camp}>
                                    vai al campionato
                                </Link>
                            </div>
                            <div>
                                {(this.state.loaded) ? this.state.calendario.map((g, i) => <Giornata key={i} giornata={g} />) : <Loader />}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

