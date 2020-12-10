import React, { Component } from 'react'
import '../Components/Squadra/squadra.css'

import { CaricaCalendario, CampionatoSquadra } from '../API/ApiCalendario';
import { CaricaSquadra } from '../API/ApiSquadra'
import { getCachedSquadra } from '../Cache/CacheSquadra';
import { getCachedCampionato } from '../Cache/CacheCampionato';
import { getSocietaByIDT } from '../Cache/CacheSocieta';

import Navbar from '../Components/Varie/Navbar'
import Loader from '../Components/Varie/Loader'
import PartiteBox from '../Components/Calendario/PartiteBox';
import Campionato from '../Components/Squadra/Campionato'
import Societa from '../Components/Squadra/Societa';
import ClassificaSquadra from '../Components/Classifica/ClassificaSquadra';
import MarcatoriSquadra from '../Components/Marcatori/MarcatoriSquadra';
import SquadraBox from '../Components/Squadra/SquadraBox';

export default class Squadra extends Component {

    constructor(props) {
        super();

        this.id_team = props.match.params.id;
        this.path = props.location.pathname;
        this.cached_team = getCachedSquadra(this.id_team);

        // campionato
        this.id_camp = this.cached_team.camp;
        this.cached_camp = getCachedCampionato(this.id_camp);
        //console.log(this.cached_camp);

        // società
        this.societa = getSocietaByIDT(this.id_team);

        this.state = {
            title: "Risultati hockey pista",
            calendario: { partite: [] },
            giocatori: [],
            tecnici: [],
            squadra_loaded: false,
            calend_loaded: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        CaricaCalendario(this.id_camp, (cal) => {
            cal = CampionatoSquadra(cal, this.id_team);
            cal.forEach(g => {
                this.state.calendario.partite.push(g);
            });
            this.setState({
                calend_loaded: true
            });
        });

        CaricaSquadra(this.id_team, this.id_camp, (gioc, tecn) => {
            this.setState({
                giocatori: gioc,
                tecnici: tecn,
                squadra_loaded: true
            })
        });
    }

    render() {
        return (
            <>
                <Navbar title={this.cached_camp.abbr + ": " + this.cached_team.nome} canBeSaved={true} path={this.path} />
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
                                    <div id="playing-parent" className="card d-none">
                                        <div className="card-header">
                                            <h5 className="card-title">PARTITE IN CORSO</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row" id="playing">

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
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
