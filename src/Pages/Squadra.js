import React, { Component } from 'react'

import '../Components/Squadra/squadra.css'

import { titleCase } from '../API/commons';
import GtagInitialize from '../API/ApiAnalytics';

import { CaricaCalendario } from '../Middleware/MwCalendario';
import { CaricaCampionati } from '../Middleware/MwCampionati';
import { CaricaPartite } from '../Middleware/MwInCorso';
import { CaricaSquadra } from '../Middleware/MwSquadra';

import { getCachedSquadra } from '../Cache/CacheSquadra';
import { getSocietaByIDT } from '../Cache/CacheSocieta';

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import ErroreNotFound from '../Components/Modals/ErroreNotFound';

import PartiteBox from '../Components/Calendario/PartiteBox';
import Campionato from '../Components/Squadra/Campionato'
import Societa from '../Components/Squadra/Societa';
import ClassificaSquadra from '../Components/Classifica/ClassificaSquadra';
import MarcatoriSquadra from '../Components/Marcatori/MarcatoriSquadra';
import SquadraBox from '../Components/Squadra/SquadraBox';
import Partita from '../Components/Calendario/Partita';

export default class Squadra extends Component {

    constructor(props) {
        super();

        // URL PARAMS
        this.id_team = props.match.params.id;

        // CACHED THINGS
        this.cached_team = getCachedSquadra(this.id_team);
        console.log(this.cached_team);
        this.title = "Squadra";
        this.error = (this.cached_team === null);
        this.reloaded = false;
        if ((window.performance) && (performance.navigation.type == 1)) {
            this.reloaded = true;
        }
        if (!this.error) {
            // campionato
            this.id_camp = this.cached_team.camp[0];
            this.cached_camp = CaricaCampionati.GetByID(this.id_camp);
            console.log(this.cached_camp);

            // società
            this.societa = getSocietaByIDT(this.id_team);

            // titolo
            this.title = this.cached_camp.abbr + ": " + this.cached_team.nome;
        }

        // COMPONENT PARAMS
        this.path = props.location.pathname;

        // TITLE AND ANALYTICS
        document.title = this.title;
        GtagInitialize();

        // SETTING STATE
        this.state = {
            title: "Risultati hockey pista",
            calendario: { partite: [] },
            giocatori: [],
            tecnici: [],
            squadra_loaded: false,
            calend_loaded: false,
            incorso: [],
            incorso_load: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = titleCase(this.title) + " - HockeyPista 2.0";

        if (!this.error) {
            CaricaCalendario.Squadra(this.id_camp, this.id_team, this.reloaded, (cal) => {
                cal.forEach(g => {
                    this.state.calendario.partite.push(g);
                });
                this.setState({
                    calend_loaded: true
                });
            });

            CaricaSquadra.Squadra(this.id_team, this.id_camp, false, (obj) => {
                this.setState({
                    giocatori: obj.giocatori,
                    tecnici: obj.tecnici,
                    squadra_loaded: true
                })
            });

            CaricaPartite.OraSquadra(this.id_camp, true, (partite) => {
                //console.log(partite);
                this.state.incorso = partite;
                this.setState({ incorso_load: true });
            });
        }
    }

    render() {
        return (
            <>
                {(!this.error) ? null : <ErroreNotFound title="Squadra non trovata" callBack={() => { this.props.history.goBack(); }} />}
                <Navbar title={this.title} canBeSaved={true} path={this.path} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-12 col-lg-7 col-xl-8 order-2 order-lg-1">
                            <div className="row">
                                <div className="col col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">SQUADRA</h5>
                                        </div>
                                        <div className="card-body">
                                            {(this.state.squadra_loaded) ? <SquadraBox {...this.state} /> : <Loader />}
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-12">
                                    <div className={"card " + ((this.state.incorso_load && this.state.incorso.length !== 0) ? "" : "d-none")} >
                                        <div className="card-header">
                                            <h5 className="card-title">PARTITE IN CORSO</h5>
                                        </div>
                                        <div className="card-body">
                                            <div>
                                                {this.state.incorso.map((e, i) => <Partita key={i} {...e} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">CALENDARIO</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="scrollbox" style={{ maxHeight: "70vh" }} >
                                                {(this.state.calend_loaded) ? <PartiteBox giornata={this.state.calendario} /> : <Loader />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-lg-5 col-xl-4 order-1 order-lg-2">
                            {
                                (this.error) ? null :
                                    <div className="row">
                                        <div className="col col-12">
                                            <ClassificaSquadra team={this.id_team} camp={this.id_camp} />
                                        </div>
                                        <div className="col col-12 col-md-6 col-lg-12 col-xl-6">
                                            <Societa {...this.societa} />
                                        </div>
                                        <div className="col col-12 col-md-6 col-lg-12 col-xl-6">
                                            <Campionato {...this.cached_camp} />
                                        </div>
                                        <div className="col col-12">
                                            <MarcatoriSquadra team={this.id_team} camp={this.id_camp} />
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
