import React, { Component } from 'react'

import '../Components/Partita/TabellaSquadre/match.css'
import ProvaPartita from '../Components/Partita/ProvaPartita'

import GtagInitialize from '../API/ApiAnalytics'
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

        // URL PARAMS
        this.id_partita = props.match.params.id;

        // CACHED THINGS

        // COMPONENT PARAMS
        this.path = props.location.pathname;
        this.intervalID = null;
        this.reloaded = false;
        if ((window.performance) && (performance.navigation.type == 1)) {
            this.reloaded = true;
        }

        // TITLE AND ANALYTICS
        document.title = "Partita " + this.id_partita;
        GtagInitialize();

        // SETTING STATE
        this.state = {
            partita: ProvaPartita(),
            loaded: false,
            error: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.CaricaDati();
        this.intervalID = setInterval(this.CaricaDati.bind(this), 20000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    getTitle() {
        return "" + this.state.partita.campionato.abbr + ": " + this.state.partita.teamA.small + " vs " + this.state.partita.teamB.small;
    }

    CaricaDati() {
        CaricaPartita(this.id_partita, this.reloaded, (partita) => {
            if (partita.currentTime === "FINALE") clearInterval(this.intervalID);
            this.setState({
                partita: partita,
                loaded: true
            });
            document.title = this.getTitle() + " - HockeyPista 2.0";
        }, () => {
            this.setState({
                loaded: true,
                error: true
            });
            console.log("partita non iniziata");
            document.title = "Partita non trovata - HockeyPista 2.0";
        });
    }

    render() {
        return (
            <>
                {(this.state.loaded) ? null : <ModalLoader />}
                {(!this.state.error) ? null : <ErrorePartita callBack={() => { this.props.history.goBack(); }} />}
                <Navbar titleFun={() => this.getTitle()} canBeSaved={true} path={this.path} />
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
