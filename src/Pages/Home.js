import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { caricaCampionati } from '../API/ApiCampionati'

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import { CampSmall as CampElement } from '../Components/Campionati/CampSmall'

const Card = (props) => {
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title text-uppercase">
                    {props.title}
                </h5>
            </div>
            <div className="card-body" id={props.id}>
                {props.children}
            </div>
        </div>
    );
}

export default class Campionati extends Component {

    constructor() {
        super();

        this.state = {
            campionati: [],
            loaded: false
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
        });
    }
    render() {
        return (
            <>
                <Navbar title={"Risultati hockey pista"} active={"Home"} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-12 col-lg-6">
                            <Card title="partite in corso">
                                <Loader />
                            </Card>

                            <Card title="partite recenti">
                                <Loader />
                            </Card>
                        </div>
                        <div className="col col-12 col-lg-6">

                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="m-0">CAMPIONATI</h5>
                                        <div>
                                            <button className="btn btn-link" style={{ padding: "0 5px" }}> gestisci </button>
                                            <Link to="/campionati" className="btn btn-link" style={{ padding: "0 5px" }}>
                                                espandi
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body" style={{ maxHeight: "45vh", position: "relative", padding: "0.75rem", overflow: "auto" }} >
                                    <div style={{ height: "100%", overflow: "auto" }}>
                                        <div className="row" id="card-campionati">
                                            {(!this.state.loaded) ? <Loader /> : this.state.campionati.map((camp, i) => <CampElement key={i} {...camp} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        SOCIETA'
                        </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" >
                                            <div className="card card-body highlight" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                                                <img src="https://ns3104249.ip-54-37-85.eu/fisr/images//logos_clubes/149.png"
                                                    style={{ margin: "0 auto", height: "40px" }} />
                                                <h5 className="mb-0">BRE</h5>
                                            </div>
                                        </div>
                                        <div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
                                            <div className="card card-body" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                                                <img src="https://ns3104249.ip-54-37-85.eu/fisr/images//logos_clubes/149.png"
                                                    style={{ margin: "0 auto", height: "40px" }} />
                                                <h5 className="mb-0">BRE</h5>
                                            </div>
                                        </div><div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
                                            <div className="card card-body" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                                                <img src="https://ns3104249.ip-54-37-85.eu/fisr/images//logos_clubes/149.png"
                                                    style={{ margin: "0 auto", height: "40px" }} />
                                                <h5 className="mb-0">BRE</h5>
                                            </div>
                                        </div><div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
                                            <div className="card card-body" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                                                <img src="https://ns3104249.ip-54-37-85.eu/fisr/images//logos_clubes/149.png"
                                                    style={{ margin: "0 auto", height: "40px" }} />
                                                <h5 className="mb-0">BRE</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
