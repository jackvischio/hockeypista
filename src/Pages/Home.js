import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { caricaCampionati } from '../API/ApiCampionati'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampSmall as CampElement } from '../Components/Campionati/CampSmall'
import { creaSocieta } from '../Cache/CacheSocieta'

export default class Campionati extends Component {

    constructor() {
        super();

        this.societa = creaSocieta();

        this.state = {
            campionati: [],
            loaded: false,
            societa_ok: (this.societa != [])
        };
    }

    componentDidMount() {
        fetch("http://www.server2.sidgad.es/fisr/fisr_ls_1.php").then((res) => {
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
                                <Loader />
                            </HomeCard>

                            <HomeCard>
                                <h5 className="card-title">PARTITE RECENTI</h5>
                                <Loader />
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
            </>
        )
    }
}

function Societa(props) {
    return (
        <div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
            <div className="card card-body p-2" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                <img src={props.logo} style={{ margin: "0 auto", height: "40px" }} alt={props.small} />
                <h5 className="mb-0 mt-1 text-center">{props.small}</h5>
            </div>
        </div>
    )
}

function HomeCard(props) {
    return (
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
    )
}