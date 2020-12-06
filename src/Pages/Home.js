import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { caricaCampionati } from '../API/ApiCampionati'
import { CaricaPartiteInCorso, CaricaPartiteRecenti } from '../API/ApiInCorso'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampSmall as CampElement } from '../Components/Campionati/CampSmall'
import { creaSocieta } from '../Cache/CacheSocieta'
import Partita from '../Components/Calendario/Partita'
import GestisciCampionati from '../Components/Modals/GestisciCampionati'

export default class Campionati extends Component {

    constructor() {
        super();

        this.societa = creaSocieta();

        this.state = {
            campionati: [],
            loaded: false,
            societa_ok: (this.societa != []),
            incorso: [], incorso_load: false,
            recenti: [], recenti_load: false
        };
    }

    componentDidMount() {
        fetch("https://www.server2.sidgad.es/fisr/fisr_ls_1.php", { redirect: 'manual' }).then((res) => {
            return res.text();
        }).then(data => {
            let camp = caricaCampionati(data);

            camp.forEach(c => this.state.campionati.push(c));

            this.setState({
                loaded: true
            });

            if (this.state.societa_ok) {
                this.societa = creaSocieta();
                this.setState({
                    societa_ok: true
                });
            }
        });
        CaricaPartiteInCorso((x) => {
            this.state.incorso = x;
            this.setState({ incorso_load: true });
        });
        CaricaPartiteRecenti((x) => {
            this.state.recenti = x;
            this.setState({ recenti_load: true });
        });
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
                                        <button className="btn btn-link link-title"> gestisci </button>
                                        <Link to="/campionati" className="btn btn-link link-title">
                                            espandi
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    {(!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => <CampElement key={i} {...camp} />)}
                                </div>
                            </HomeCard>
                            <HomeCard>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">SOCIET&Agrave;</h5>
                                    <div>
                                        <button className="btn btn-link link-title"> gestisci </button>
                                        <Link to="/campionati" className="btn btn-link link-title">
                                            espandi
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    {(this.state.societa_ok) ? this.societa.map((s, i) => <Societa key={i} {...s} />) : <Loader />}
                                </div>
                            </HomeCard>
                        </div>
                    </div>
                </div>
                <GestisciCampionati />
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