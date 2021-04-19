import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import GtagInitialize from '../API/ApiAnalytics'
import { titleCase } from '../API/commons'

import { CaricaCalendario } from '../Middleware/MwCalendario'
import { CaricaCampionati } from '../Middleware/MwCampionati'
import { CaricaPartite } from '../Middleware/MwInCorso'

import Loader from '../Components/Varie/Loader'
import Navbar from '../Components/Varie/Navbar'

import MarcatoriBox from '../Components/Marcatori/MarcatoriBox'
import ClassificaBox from '../Components/Classifica/ClassificaBox'
import SquadraBox from '../Components/Campionati/SquadraBox'
import PartiteBox from '../Components/Calendario/PartiteBox'
import Partita from '../Components/Calendario/Partita'
import ErroreNotFound from '../Components/Modals/ErroreNotFound'

export default class Campionato extends Component {

    constructor(props) {
        super();

        // URL PARAMS
        this.id_camp = parseInt(props.match.params.id);

        // CACHED THINGS
        this.camp = CaricaCampionati.GetByID(this.id_camp);

        // COMPONENT PARAMS
        this.path = props.location.pathname;
        this.error = (this.camp === null);
        this.title = (!this.error ? titleCase(this.camp.name).replace(' E ', ' e ') : "Campionato non trovato");
        this.reloaded = false;
        if ((window.performance) && (performance.navigation.type == 1)) {
            this.reloaded = true;
        }

        // TITLE AND ANALYTICS
        document.title = this.title;
        GtagInitialize();

        // SETTING STATE
        this.state = {
            ultima_giornata: undefined,
            prox_giornata: undefined,
            calend_loaded: false,
            incorso: [],
            incorso_load: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = this.title + " - HockeyPista 2.0"

        if (!this.error) {
            CaricaCalendario.DueGiornate(this.id_camp, this.reloaded, (cal) => {
                this.setState({
                    ultima_giornata: cal[0],
                    prox_giornata: cal[1],
                    calend_loaded: true
                });
            });
            CaricaPartite.OraCampionato(this.id_camp, true, (partite) => {
                //console.log(partite);
                this.state.incorso = partite;
                this.setState({ incorso_load: true });
            }, null);
        }
    }

    render() {
        return (
            <>
                {(!this.error) ? null : <ErroreNotFound title="Campionato non trovato" callBack={() => { this.props.history.goBack(); }} />}
                <Navbar title={this.title} canBeSaved={true} path={this.path} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-xl-8 col-lg-7 col-md-12">
                            <div className="row">
                                <div className="col col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">SQUADRE</h5>
                                        </div>
                                        <div className="card-body" style={{ padding: "0.75rem" }}>
                                            <div className="scrollbox" style={{ maxHeight: "45vh" }} >
                                                <div className="row">
                                                    {
                                                        (this.error) ? null :
                                                            this.camp.teams.filter(e => e.name != "")
                                                                .sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0)).map((e, i) => <SquadraBox key={i} {...e} />)
                                                    }
                                                </div>
                                            </div>
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
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="card-title">CALENDARIO</h5>
                                                <Link to={"/calendario/" + this.id_camp}>
                                                    calendario completo
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="d-inline-block">
                                                Ultima giornata
                                                {(this.state.ultima_giornata === undefined) ? "" : ": " + this.state.ultima_giornata.giornata.toLowerCase()}
                                            </h5>
                                            <div>
                                                {(this.state.calend_loaded) ? <PartiteBox giornata={this.state.ultima_giornata} /> : <Loader />}
                                            </div>
                                            <br />
                                            <h5 className="d-inline-block">
                                                Prossima giornata
                                                {(this.state.prox_giornata !== undefined) ? ": " + this.state.prox_giornata.giornata.toLowerCase() : ""}
                                            </h5>
                                            <div>
                                                {(this.state.calend_loaded) ? <PartiteBox giornata={this.state.prox_giornata} /> : <Loader />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-xl-4 col-lg-5 col-md-12">
                            <div className="row">
                                <div className="col col-12">
                                    {
                                        (this.error) ? <ClassificaBox idc={0} /> : <ClassificaBox idc={this.id_camp} />
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col col-12">
                                    {
                                        (this.error) ? <MarcatoriBox idc={0} /> : <MarcatoriBox idc={this.id_camp} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
