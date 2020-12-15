import React, { Component } from 'react'
import ReactGA from 'react-ga'

import '../Components/Partita/TabellaSquadre/match.css'

import ProvaPartita from '../Components/Partita/ProvaPartita'
import { CaricaPartita } from '../API/ApiPartita'

import Navbar from '../Components/Varie/Navbar'
import ErrorePartita from '../Components/Modals/ErrorePartita'

import Azione from '../Components/Partita/Azione'
import LeftPanel from '../Components/Partita/LeftPanel'
import ModalLoader from '../Components/Varie/ModalLoader'
import Scoreboard from '../Components/Partita/Scoreboard'
import Squadra from '../Components/Partita/TabellaSquadre/Squadra'
import TimelineOrizz from '../Components/Partita/Timeline/TimelineOrizz'
import TimelineVert from '../Components/Partita/Timeline/TimelineVert'

export default class Partita extends Component {

    constructor(props) {
        super();

        this.id_partita = props.match.params.id;
        this.path = props.location.pathname;
        this.intervalID = null;

        this.state = {
            partita: ProvaPartita(),
            loaded: false,
            title: "Risultati hockey pista",
            error: false
        }

        // google analytics
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview("partita_" + this.id_partita);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.CaricaDati();
        this.intervalID = setInterval(this.CaricaDati.bind(this), 20000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    CaricaDati() {
        CaricaPartita(this.id_partita, (partita) => {
            if (partita.currentTime === "FINALE") clearInterval(this.intervalID);
            this.setState({
                partita: partita,
                loaded: true,
                title: ("" + partita.campionato.abbr + ": " + partita.teamA.small + " vs " + partita.teamB.small)
            });
        }, () => {
            this.setState({
                loaded: true,
                error: true
            });
            console.log("partita non iniziata");
        });
    }

    render() {
        return (
            <>
                {(this.state.loaded) ? null : <ModalLoader />}
                {(!this.state.error) ? null : <ErrorePartita callBack={() => { this.props.history.goBack(); }} />}
                <Navbar title={this.state.title} canBeSaved={true} path={this.path} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-12 col-lg-9">
                            <div className="row">
                                <div className="col col-12 col-xl-3 col-lg-4 col-md-12 order-2 order-lg-1">
                                    <LeftPanel {...this.state.partita} />
                                </div>
                                <div className="col col-12 col-xl-9 col-lg-8 col-md-12 order-1 order-lg-2">
                                    <Scoreboard {...this.state.partita} />
                                </div>
                            </div>
                            <div className="row d-none d-md-block">
                                <TimelineOrizz {...this.state.partita} />
                            </div>
                            <div className="row">
                                <Squadra {...this.state.partita.teamA} />
                                <Squadra {...this.state.partita.teamB} />
                            </div>
                        </div>
                        <div className="col col-12 col-lg-3">
                            <div className="row justify-content-md-center">
                                <div className="col col-12 col-sm-6 col-lg-12 order-2 order-md-1 ">
                                    <div className="card">
                                        <div className="card-body actions-div">
                                            {this.state.partita.actions.map((a, i) => <Azione key={i} {...a} minxtempo={this.state.partita.campionato.tempo} />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-12 col-sm-6 col-lg-12 order-1 order-md-2 d-md-none">
                                    <TimelineVert {...this.state.partita} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
