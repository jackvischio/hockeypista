import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GtagInitialize from '../API/ApiAnalytics';
import { CaricaDettagliGiocatore } from '../API/ApiGiocatore';
import { titleCase } from '../API/commons';
import { getCachedGiocatore } from '../Cache/CacheGiocatori';
import Campionato from '../Components/Giocatori/Campionato.giocatori';

import Navbar from '../Components/Varie/Navbar';

export default class Giocatore extends Component {

    constructor(props) {
        super();

        // URL PARAMS
        this.id_gioc = parseInt(props.match.params.id);

        // CACHED THINGS
        this.cached = getCachedGiocatore(this.id_gioc);

        // COMPONENT PARAMS
        this.path = props.location.pathname;
        this.pastSeasons = [
            { year: "2019/2020", value: 27 },
            { year: "2018/2019", value: 25 }
        ]
        this.title = (this.cached !== undefined ? titleCase(this.cached.nome) : "Giocatore");

        // TITLE AND ANALYTICS
        document.title = this.title;
        GtagInitialize();

        // SETTING STATE
        this.state = {
            giocatore: {
                nome: "",
                foto: "",
                id: 0,
                nazione: { img: "", testo: "" },
                data_nascita: "",
                eta: 0,
                societa: { nome: "", logo: "" },
                campionati: []
            },
            countSeason: -1,
            past: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = this.title + " - HockeyPista 2.0";

        CaricaDettagliGiocatore(this.id_gioc, 0, 0, 29, (obj) => {
            this.setState({
                giocatore: obj
            });
        });
        this.pastSeasons.map((e, i) => {
            CaricaDettagliGiocatore(this.id_gioc, 0, 0, e.value, (obj) => {
                this.state.past.push({
                    societa: obj.societa.nome,
                    logo: obj.societa.logo,
                    stagione: e.year,
                    ids: obj.societa.ids
                });
                this.setState({ countSeason: i });
            })
        });
    }

    render() {
        return (
            <>
                <Navbar title={this.title} canBeSaved={true} path={this.path} />
                <div className="container-fluid">
                    <div className="row">
                        <Col>
                            <Card>
                                <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                                    <div className="p-2 text-center">
                                        <img src={this.state.giocatore.foto} style={{ height: "150px", borderRadius: "5px" }} alt={"giocatore"} />
                                    </div>
                                    <div className="p-2 d-none d-sm-block text-left">
                                        <h3><b>{this.state.giocatore.nome.toUpperCase()}</b></h3>
                                        <h5>Data di nascita: {this.state.giocatore.data_nascita} ({this.state.giocatore.eta})</h5>
                                        <h5 className="m-0">Nazionalità: {this.state.giocatore.nazione.testo}</h5>
                                    </div>
                                    <div className="d-block d-sm-none text-center">
                                        <h3><b>{this.state.giocatore.nome.toUpperCase()}</b></h3>
                                        <h5>Data di nascita: {this.state.giocatore.data_nascita} ({this.state.giocatore.eta})</h5>
                                        <h5 className="m-0">Nazionalità: {this.state.giocatore.nazione.testo}</h5>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                                    <div className="p-2 text-center">
                                        <img src={this.state.giocatore.societa.logo} style={{ height: "80px" }} alt={this.state.giocatore.societa.nome} />
                                    </div>
                                    <div className="p-2 d-none d-sm-block text-left">
                                        <Link to={"/societa/" + this.state.giocatore.societa.ids} className="link-black">
                                            <h4 className="font-weight-bold m-0 ml-2">{this.state.giocatore.societa.nome}</h4>
                                        </Link>
                                    </div>
                                    <div className="d-block d-sm-none text-center">
                                        <Link to={"/societa/" + this.state.giocatore.societa.ids} className="link-black">
                                            <h4 className="font-weight-bold m-0">{this.state.giocatore.societa.nome}</h4>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <h4>Stagioni precedenti</h4>
                                {
                                    this.state.past.sort((a, b) => (a.stagione > b.stagione) ? -1 : 1).map((e, i) => <PastSeason {...e} key={i} />)
                                }
                            </Card>
                        </Col>
                        <Col>
                            {
                                this.state.giocatore.campionati.sort((a, b) => (a.id > b.id ? 1 : -1))
                                    .map((c, i) => <Card key={i}><Campionato {...c} /></Card>)
                            }
                        </Col>
                    </div>
                </div>
            </>
        );
    }
}

function Col(props) {
    return (
        <div className="col col-12 col-lg-6">
            <div className="row">
                {props.children}
            </div>
        </div>
    )
}

function Card(props) {
    return (
        <div className="col col-12">
            <div className="card">
                <div className="card-body">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

function PastSeason(props) {
    if (props.ids !== 0 && props.ids !== undefined) {
        return (
            <div className="d-flex align-items-center justify-content-start p-2">
                <img src={props.logo} style={{ height: "45px", width: "auto" }} alt="" />
                <div className="ml-3">
                    <Link to={"/societa/" + props.ids} className="link-black">
                        <h5 className="m-0">{props.societa.toUpperCase()}</h5>
                    </Link>
                    <span className="text-muted">{props.stagione}</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="d-flex align-items-center justify-content-start p-2">
                <img src={props.logo} style={{ height: "45px", width: "auto" }} alt="" />
                <div className="ml-3">
                    <h5 className="m-0">{props.societa.toUpperCase()}</h5>
                    <span className="text-muted">{props.stagione}</span>
                </div>
            </div>
        )
    }
}