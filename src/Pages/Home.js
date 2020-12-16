import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga'

// API
import { caricaCampionati } from '../API/ApiCampionati'
import { CaricaPartiteInCorso, CaricaPartiteRecenti } from '../API/ApiInCorso'

// CACHE
import { creaSocieta } from '../Cache/CacheSocieta'
import { getCachedVisCamp, getCachedVisSocieta } from '../Cache/CacheVisualizzazioni'

// COMPONENTS
import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampSmall as CampElement } from '../Components/Campionati/CampSmall'
import Partita from '../Components/Calendario/Partita'
import HomeCard from '../Components/Salvati/HomeCard'
import Societa from '../Components/Salvati/Societa'

// MODALS
import GestisciCampionati from '../Components/Modals/GestisciCampionati'
import GestisciSocieta from '../Components/Modals/GestisciSocieta'
import ErroreAttivazione from '../Components/Modals/ErroreAttivazione'
import { CaricaCalendario } from '../API/ApiCalendario'

export default class Home extends Component {

    constructor() {
        super();

        this.state = {
            campionati: [],
            loaded: false,
            societa: creaSocieta(), societa_ok: (this.societa != []),
            incorso: [], incorso_load: false,
            recenti: [], recenti_load: false,
            showCampionati: getCachedVisCamp(), showCampionati_modal: false,
            showSocieta: getCachedVisSocieta(), showSocieta_modal: false,
            erroreAttivazione: false
        };

        // google analytics
        document.title = "Home - HockeyPista 2.0"
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        // caricamento dei campionati
        caricaCampionati(true, (camps) => {
            this.state.campionati = camps;
            this.setState({ loaded: true });

            if (this.state.societa_ok) {
                this.state.societa = creaSocieta();
                this.setState({ societa_ok: true });
            }

            if (localStorage.getItem("ns_first_time") === null) {
                this.state.campionati.forEach(camp => {
                    console.log(camp);
                    console.log("calling " + camp.id);
                    CaricaCalendario(camp.id, (a) => { console.log("loaded " + camp.id) })
                })
                localStorage.setItem("ns_first_time", "nope");
            }
        }, () => {
            this.setState({ erroreAttivazione: true })
        });
        // caricamento partite in corso
        CaricaPartiteInCorso((x) => {
            this.state.incorso = x;
            this.setState({ incorso_load: true });
        });
        // caricamento partite recenti
        CaricaPartiteRecenti((x) => {
            this.state.recenti = x;
            this.setState({ recenti_load: true });
        });
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
                <Navbar title="RISULTATI HOCKEY PISTA" active={"Home"} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-12 col-lg-6">
                            <HomeCard>
                                <h5 className="card-title">PARTITE IN CORSO</h5>
                                {
                                    (!this.state.incorso_load) ? <Loader /> :
                                        (this.state.incorso.length == 0) ? <p className="m-2 text-center"><i>Nessuna partita in corso</i></p> :
                                            this.state.incorso.map((e, i) => <Partita key={i} {...e} />)
                                }
                            </HomeCard>

                            <HomeCard>
                                <h5 className="card-title">PARTITE RECENTI</h5>
                                {
                                    (!this.state.recenti_load) ? <Loader /> :
                                        (this.state.recenti.length == 0) ? <p className="m-2 text-center"><i>Nessuna partita recente</i></p> :
                                            this.state.recenti.map((e, i) => <Partita key={i} {...e} />)
                                }
                            </HomeCard>
                        </div>
                        <div className="col col-12 col-lg-6">
                            <HomeCard>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">CAMPIONATI</h5>
                                    <div>
                                        <button className="btn btn-link link-title m-0" onClick={() => { this.setState({ showCampionati_modal: true }); }}>
                                            gestisci
                                        </button>
                                        <Link to="/campionati" className="btn btn-link link-title m-0">
                                            espandi
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                        (!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => {
                                            try {
                                                if (this.state.showCampionati[camp.id].show) {
                                                    return <CampElement key={i} {...camp} />
                                                }
                                            }
                                            catch (e) {
                                                return <CampElement key={i} {...camp} />
                                            }
                                        })
                                    }
                                </div>
                            </HomeCard>
                            <HomeCard>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">SOCIET&Agrave;</h5>
                                    <div>
                                        <button className="btn btn-link link-title" onClick={() => { this.setState({ showSocieta_modal: true }); }}>
                                            gestisci
                                        </button>
                                        <Link to="/societa" className="btn btn-link link-title">
                                            espandi
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    {(this.state.societa_ok) ?
                                        this.state.societa.map((s, i) => {
                                            try {
                                                if (this.state.showSocieta[s.id].show) {
                                                    return <Societa key={i} {...s} />
                                                }
                                            }
                                            catch (e) {
                                                return <Societa key={i} {...s} />
                                            }
                                        }) : <Loader />}
                                </div>
                            </HomeCard>
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
                {
                    (this.state.erroreAttivazione) ?
                        <ErroreAttivazione /> : null
                }
            </>
        )
    }
}