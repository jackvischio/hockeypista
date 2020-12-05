import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CaricaCalendario } from '../API/ApiCalendario';

import { getCachedCampionato } from '../Cache/CacheCampionato'

import Giornata from '../Components/Calendario/Giornata';
import Loader from '../Components/Varie/Loader';
import Navbar from '../Components/Varie/Navbar';

export default class Calendario extends Component {
    constructor(props) {
        super();

        this.path = props.location.pathname;

        this.id_camp = parseInt(props.match.params.id);
        this.camp = getCachedCampionato(this.id_camp);
        this.title = "CALENDARIO " + this.camp.abbr;
        this.state = { calendario: [], loaded: false }
    }

    componentDidMount() {
        CaricaCalendario(this.id_camp, (cal) => {
            cal.forEach(g => {
                this.state.calendario.push(g);
            });
            this.setState({
                loaded: true
            });
        })
    }

    render() {
        return (
            <>
                <Navbar path={this.path} title={this.title} canBeSaved={true} />
                <div className="container p-2">
                    <div className="card card-body mt-2 mb-2 p-2">
                        <div className="text-center">
                            <Link to={"/campionato/" + this.id_camp}>
                                vai al campionato
                            </Link>
                        </div>
                        <div>
                            {(this.state.loaded) ? this.state.calendario.map((g, i) => <Giornata key={i} giornata={g} />) : <Loader />}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

