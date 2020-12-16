import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga'

import { CaricaCalendario } from '../API/ApiCalendario';

import { getCachedCampionato } from '../Cache/CacheCampionato'

import Giornata from '../Components/Calendario/Giornata';
import Loader from '../Components/Varie/Loader';
import Navbar from '../Components/Varie/Navbar';
import ErroreNotFound from '../Components/Modals/ErroreNotFound';

export default class Calendario extends Component {
    constructor(props) {
        super();

        this.path = props.location.pathname;

        this.id_camp = parseInt(props.match.params.id);
        this.camp = getCachedCampionato(this.id_camp);
        this.error = (this.camp === undefined);

        this.title = (!this.error ? ("Calendario " + this.camp.abbr) : "Calendario");
        document.title = this.title + " - HockeyPista 2.0"
        this.state = { calendario: [], loaded: false }

        // google analytics
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if (!this.error) {
            CaricaCalendario(this.id_camp, (cal) => {
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
                    <div className="card card-body mt-2 mb-2 p-2">
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
            </>
        )
    }
}

