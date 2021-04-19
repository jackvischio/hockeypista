import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import GtagInitialize from '../API/ApiAnalytics';

import { CaricaCampionati } from '../Middleware/MwCampionati';

import { creaSocieta } from '../Cache/CacheSocieta';
import { getCachedVisCamp, getCachedVisSocieta } from '../Cache/CacheVisualizzazioni';

import GestisciCampionati from '../Components/Modals/GestisciCampionati';
import GestisciSocieta from '../Components/Modals/GestisciSocieta';

import Navbar from '../Components/Varie/Navbar'

export default class Impostazioni extends Component {
    constructor(props) {
        super(props);

        // URL PARAMS

        // CACHED THINGS

        // COMPONENT PARAMS

        // TITLE AND ANALYTICS
        document.title = "Impostazioni";
        GtagInitialize();

        // SETTING STATE
        this.state = {
            campionati: CaricaCampionati.GetCached(),
            societa: creaSocieta(),
            showCampionati: getCachedVisCamp(),
            showSocieta: getCachedVisSocieta(),
            showCampionati_modal: false,
            showSocieta_modal: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = "Impostazioni - HockeyPista 2.0";
    }

    updateVisCampionato() {
        this.state.showCampionati = getCachedVisCamp();
        this.setState({ showCampionati_modal: false });
    }

    updateVisSocieta() {
        this.state.showSocieta = getCachedVisSocieta();
        this.setState({ showSocieta_modal: false });
    }

    render() {
        return (
            <>
                <Navbar title={"Risultati Hockey pista"} />
                <div className="container">
                    <div className="row">
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h1 className="m-0 text-primary">
                                        <i className="fas fa-tools"></i>
                                    </h1>
                                    <h4>
                                        Attivazione del sito
                                    </h4>
                                    <span>Per attivare completamente il sito, è necessario eseguire un paio di passaggi</span>
                                    <br />
                                    <Link to="/guida" className="btn btn-primary btn-sm mt-3">
                                        consulta la guida
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h1 className="m-0 text-primary">
                                        <i className="fas fa-paint-brush"></i>
                                    </h1>
                                    <h4>
                                        Personalizza Homepage
                                        </h4>
                                    <span>Permette di selezionare gli elementi da visualizzare nella schermata home</span>
                                    <br />
                                    <button className="btn btn-primary btn-sm d-inline-block mr-1 mt-3" onClick={() => { this.setState({ showCampionati_modal: true }) }}>
                                        campionati
                                    </button>
                                    <button className="btn btn-primary btn-sm d-inline-block ml-1 mt-3" onClick={() => { this.setState({ showSocieta_modal: true }) }}>
                                        società
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h1 className="m-0 text-primary">
                                        <i className="fas fa-calendar-minus"></i>
                                    </h1>
                                    <h4>
                                        Seleziona stagione
                                        </h4>
                                    <span><i>Funzionalità in arrivo</i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (this.state.showCampionati_modal) ?
                        <GestisciCampionati callback={() => this.updateVisCampionato()} camp={this.state.campionati} show={this.state.showCampionati} /> : null
                }
                {
                    (this.state.showSocieta_modal) ?
                        <GestisciSocieta callback={() => this.updateVisSocieta()} soc={this.state.societa} show={this.state.showSocieta} /> : null
                }
            </>
        )
    }
}