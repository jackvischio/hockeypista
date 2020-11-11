import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { getCachedCampionato } from '../Cache/CacheCampionato'
import { CaricaCalendario, DueGiornate } from '../API/ApiCalendario'

import Loader from '../Components/Varie/Loader'
import Navbar from '../Components/Varie/Navbar'
import MarcatoriBox from '../Components/Marcatori/MarcatoriBox'
import ClassificaBox from '../Components/Classifica/ClassificaBox'
import SquadraBox from '../Components/Campionati/SquadraBox'
import PartiteBox from '../Components/Calendario/PartiteBox'
import { timers } from 'jquery'

export default class Campionato extends Component {

    constructor(props) {
        super();

        this.id_camp = props.match.params.id;
        this.path = props.location.pathname;

        // recupero il campionato di appartenenza dalla cache
        this.camp = getCachedCampionato(this.id_camp);
        console.log(this.id_camp);

        // imposto lo stato della pagina
        this.state = {
            ultima_giornata: [],
            prox_giornata: [],
            calend_loaded: false
        }
    }

    componentDidMount() {
        CaricaCalendario(this.id_camp, (cal) => {
            cal = DueGiornate(cal);
            this.setState({
                ultima_giornata: cal[0],
                prox_giornata: cal[1],
                calend_loaded: true
            });
        })
    }

    render() {
        return (
            <>
                <Navbar title={this.camp.name} canBeSaved={true} path={this.path} />
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
                                            <div className="row">
                                                {
                                                    this.camp.teams.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0)).map((e, i) => <SquadraBox key={i} {...e} />)
                                                }
                                            </div>
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
                                    <ClassificaBox idc={this.id_camp} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col col-12">
                                    <MarcatoriBox idc={this.id_camp} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
