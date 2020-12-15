import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { getCachedCampionati } from '../Cache/CacheCampionato';
import { creaSocieta } from '../Cache/CacheSocieta';
import { getCachedVisCamp, getCachedVisSocieta } from '../Cache/CacheVisualizzazioni';

import GestisciCampionati from '../Components/Modals/GestisciCampionati';
import GestisciSocieta from '../Components/Modals/GestisciSocieta';

import Navbar from '../Components/Varie/Navbar'

export default class Impostazioni extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campionati: getCachedCampionati(),
            societa: creaSocieta(),
            showCampionati: getCachedVisCamp(),
            showSocieta: getCachedVisSocieta(),
            showCampionati_modal: false,
            showSocieta_modal: false
        }
    }

    componentDidMount() {

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
                                        <i class="fas fa-tools"></i>
                                    </h1>
                                    <h4>
                                        Attivazione del sito
                                    </h4>
                                    <span>Per attivare completamente il sito, è necessario eseguire un paio di passaggi</span>
                                    <br />
                                    <Link to="/guida" className="btn btn-primary btn-sm mt-2">
                                        consulta la guida
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h1 className="m-0 text-primary">
                                        <i class="fas fa-paint-brush"></i>
                                    </h1>
                                    <h4>
                                        Personalizza Homepage
                                        </h4>
                                    <span>Permette di selezionare gli elementi da visualizzare nella schermata home</span>
                                    <br />
                                    <button className="btn btn-primary btn-sm d-inline-block mr-1 mt-2" onClick={() => { this.setState({ showCampionati_modal: true }) }}>
                                        campionati
                                    </button>
                                    <button className="btn btn-primary btn-sm d-inline-block ml-1 mt-2" onClick={() => { this.setState({ showSocieta_modal: true }) }}>
                                        società
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h1 className="m-0 text-primary">
                                        <i class="fas fa-calendar-minus"></i>
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