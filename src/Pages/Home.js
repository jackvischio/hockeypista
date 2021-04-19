import React, { Component, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'

// API
import GtagInitialize from '../API/ApiAnalytics'

// MIDDLEWARE
import { CaricaCalendario } from '../Middleware/MwCalendario'
import { CaricaCampionati } from '../Middleware/MwCampionati'

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
import { CaricaPartite } from '../Middleware/MwInCorso'

export default class Home extends Component {

    constructor(props) {
        super();

        // FIRST ACCESS
        if (localStorage.getItem("firstAccess") === null) {
            console.log("primo accesso");
            localStorage.setItem("firstAccess", "nope");
            props.history.push('/primoaccesso');
        }

        // URL PARAMS

        // CACHED THINGS

        // COMPONENT PARAMS
        this.intervalInCorso = null;
        this.intervalRecenti = null;

        // TITLE AND ANALYTICS
        document.title = "Homepage";
        GtagInitialize();

        // SETTING STATE
        this.state = {
            campionati: [],
            loaded: false,
            societa: creaSocieta(), societa_ok: (this.societa != []),
            incorso: [], incorso_load: false,
            recenti: [], recenti_load: false,
            future: [], future_load: false,
            showCampionati: getCachedVisCamp(), showCampionati_modal: false,
            showSocieta: getCachedVisSocieta(), showSocieta_modal: false,
            erroreAttivazione: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = "Homepage - HockeyPista 2.0";

        // caricamento partite
        CaricaPartite.Tutte(false, (array) => {
            this.state.incorso = array.in_corso;
            this.state.recenti = array.recenti;
            this.state.future = array.future;
            this.setState({ incorso_load: true, recenti_load: true, future_load: true });
        }, () => { });

        // caricamento dei campionati
        let camps = CaricaCampionati.GetCached();
        if (camps != null) this.SetCampionati(camps);
        else {
            CaricaCampionati.GetAll(false,
                (c) => { this.SetCampionati(c); },
                () => { this.setState({ erroreAttivazione: true }); }
            );
        }

        // aggiornamenti automatici della home
        this.intervalInCorso = setInterval(this.PartiteInCorso.bind(this), 40000);
        this.intervalRecenti = setInterval(this.PartiteRecenti.bind(this), 120000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalInCorso);
        clearInterval(this.intervalRecenti);
    }

    SetCampionati(camps) {
        this.state.campionati = camps;
        this.setState({ loaded: true });

        if (this.state.societa_ok) {
            this.state.societa = creaSocieta();
            this.setState({ societa_ok: true });
        }

        if (localStorage.getItem("ns_first_time") === null) {
            this.state.campionati.forEach(camp => {
                console.log("calling " + camp.id);
                CaricaCalendario.Campionato(camp.id, true, (a) => { console.log("loaded " + camp.id) });
            })
            localStorage.setItem("ns_first_time", "nope");
        }
    }

    PartiteInCorso() {
        console.log("Refreshing partite in corso");
        CaricaPartite.InCorso(true, (partite) => {
            this.state.incorso = partite;
            this.setState({ incorso_load: true });
        }, () => { });
    }

    PartiteRecenti() {
        console.log("Refreshing partite recenti");
        CaricaPartite.Recenti(true, (partite) => {
            this.state.recenti = partite;
            this.setState({ recenti_load: true });
        }, () => { });
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
        // ordinamento delle partite recenti
        let sortDate = (a, b, rev) => {
            let sign = (rev ? -1 : 1);
            if (a == b) return 0;
            return (parseDate(a) > parseDate(b)) ? -1 * sign : 1 * sign;
        }
        let parseDate = (a) => {
            let x = a.split('/');
            let y = new Date().getFullYear();
            return new Date(y, parseInt(x[1]), parseInt(x[0]));
        }
        let sortCamp = (a, b) => (translateCamp(a) < translateCamp(b)) ? -1 : 1;
        let translateCamp = (a) => {
            switch (a) {
                case "A1": return 1;
                case "A2": return 2;
                case "B": return 3;
                case "FEMM": return 4;
                case "U19": return 5;
                case "U17": return 6;
                case "U15": return 7;
                case "U13": return 8;
                case "U11": return 9;
                default: return 10;
            }
        }
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
                                            this.state.recenti.sort((a, b) => {
                                                let x = sortDate(a.day, b.day, false);
                                                return (x == 0) ? sortCamp(a.campAbbr, b.campAbbr) : x;
                                            }).map((e, i) => <Partita key={i} {...e} />)
                                }
                            </HomeCard>
                            <HomeCard>
                                <h5 className="card-title">PARTITE IN PROGRAMMA</h5>
                                {
                                    (!this.state.future_load) ? <Loader /> :
                                        (this.state.future.length == 0) ? <p className="m-2 text-center"><i>Nessuna partita in programma</i></p> :
                                            this.state.future.sort((a, b) => {
                                                let x = sortDate(a.day, b.day, true);
                                                return (x == 0) ? sortCamp(a.campAbbr, b.campAbbr) : x;
                                            }).map((e, i) => { e.idp = undefined; return <Partita key={i} {...e} /> })
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