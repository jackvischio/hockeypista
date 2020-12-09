import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { caricaCampionati } from '../API/ApiCampionati'
import { CaricaPartiteInCorso, CaricaPartiteRecenti } from '../API/ApiInCorso'

import { creaSocieta } from '../Cache/CacheSocieta'
import { getCachedVisCamp, getCachedVisSocieta } from '../Cache/CacheVisualizzazioni'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampSmall as CampElement } from '../Components/Campionati/CampSmall'
import Partita from '../Components/Calendario/Partita'

import GestisciCampionati from '../Components/Modals/GestisciCampionati'
import GestisciSocieta from '../Components/Modals/GestisciSocieta'

export default class Campionati extends Component {

    constructor() {
        super();

        this.state = {
            campionati: [],
            loaded: false,
            societa: creaSocieta(), societa_ok: (this.societa != []),
            incorso: [], incorso_load: false,
            recenti: [], recenti_load: false,
            showCampionati: getCachedVisCamp(), showCampionati_modal: false,
            showSocieta: getCachedVisSocieta(), showSocieta_modal: false
        };
    }

    componentDidMount() {
        // caricamento dei campionati
        fetch("https://www.server2.sidgad.es/fisr/fisr_ls_1.php", { redirect: 'manual' }).then((res) => {
            return res.text();
        }).then(data => {
            this.state.campionati = caricaCampionati(data);
            this.setState({ loaded: true });

            if (this.state.societa_ok) {
                this.state.societa = creaSocieta();
                this.setState({ societa_ok: true });
            }
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

    updateVisCampionato(arr) {
        this.state.showCampionati = getCachedVisCamp();
        this.setState({ showCampionati_modal: false });
    }

    updateVisSocieta(arr) {
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
                                        <button className="btn btn-link link-title" onClick={() => { this.setState({ showCampionati_modal: true }); }}>
                                            gestisci
                                        </button>
                                        <Link to="/campionati" className="btn btn-link link-title">
                                            espandi
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                        (!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => {
                                            if (this.state.showCampionati[camp.id].show) {
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
                                            if (this.state.showSocieta[s.id].show) {
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
            </>
        )
    }
}

function Societa(props) {
    return (
        <div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
            <Link to={"/societa/" + props.id} className="link-unstyled">
                <div className="card card-body p-2 highlight" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                    <img src={props.logo} style={{ margin: "0 auto", height: "40px" }} alt={props.small} />
                    <h5 className="mb-0 mt-1 text-center">{props.small}</h5>
                </div>
            </Link>
        </div>
    )
}

function HomeCard(props) {
    return (
        <div className="row">
            <div className="col col-12">
                <div className="card">
                    <div className="card-header">
                        {props.children[0]}
                    </div>
                    <div className="card-body">
                        <div className="scrollbox">
                            {props.children[1]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}