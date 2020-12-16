import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga'

import { getCachedCampionato } from '../Cache/CacheCampionato'
import { CaricaCalendario, DueGiornate } from '../API/ApiCalendario'
import { CaricaPartiteInCorsoCampionato } from '../API/ApiInCorso'

import Loader from '../Components/Varie/Loader'
import Navbar from '../Components/Varie/Navbar'
import MarcatoriBox from '../Components/Marcatori/MarcatoriBox'
import ClassificaBox from '../Components/Classifica/ClassificaBox'
import SquadraBox from '../Components/Campionati/SquadraBox'
import PartiteBox from '../Components/Calendario/PartiteBox'
import Partita from '../Components/Calendario/Partita'
import ErroreNotFound from '../Components/Modals/ErroreNotFound'
import { titleCase } from '../API/commons'

export default class Campionato extends Component {

    constructor(props) {
        super();

        this.id_camp = parseInt(props.match.params.id);
        this.path = props.location.pathname;

        // recupero il campionato di appartenenza dalla cache
        this.camp = getCachedCampionato(this.id_camp);
        this.error = (this.camp === undefined);

        this.title = (!this.error ? titleCase(this.camp.name).replace(' E ', ' e ') : "Campionato non trovato");
        document.title = this.title + " - HockeyPista 2.0"

        // imposto lo stato della pagina
        this.state = {
            ultima_giornata: [],
            prox_giornata: [],
            calend_loaded: false,
            incorso: [],
            incorso_load: false
        }

        // google analytics
        ReactGA.initialize('G-QGJ6R11WYD');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if (!this.error) {
            CaricaCalendario(this.id_camp, (cal) => {
                cal = DueGiornate(cal);
                this.setState({
                    ultima_giornata: cal[0],
                    prox_giornata: cal[1],
                    calend_loaded: true
                });
            });
            CaricaPartiteInCorsoCampionato(this.id_camp, (partite) => {
                console.log(partite);
                this.state.incorso = partite;
                this.setState({ incorso_load: true });
            });
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
                                                            this.camp.teams.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0)).map((e, i) => <SquadraBox key={i} {...e} />)
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
                                            <h5 className="d-inline-block">Ultima giornata</h5>
                                            <div>
                                                {(this.state.calend_loaded) ? <PartiteBox giornata={this.state.ultima_giornata} /> : <Loader />}
                                            </div>
                                            <br />
                                            <h5>Prossima giornata</h5>
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
