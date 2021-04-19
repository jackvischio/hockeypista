import React, { Component } from 'react'

import { CaricaMarcatori } from '../../Middleware/MwMarcatori';

import Loader from "../Varie/Loader"
import { Marcatore } from "./Marcatore"

export default class MarcatoriBox extends Component {
    constructor(props) {
        super();
        this.id_camp = props.idc;

        this.state = {
            marcatori: [],
            loaded: false,
            mostra_tutti: false,
            showing: -1
        }
    }

    componentDidMount() {
        CaricaMarcatori.Campionato(this.id_camp, false, (lista) => {
            this.state.marcatori = lista;
            this.setState({ loaded: true });
        });
    }

    dettagli = (id) => {
        let showing = this.state.showing;
        if (id === showing)
            this.setState({ showing: -1 });
        else
            this.setState({ showing: id });
    }

    mostraTutti = () => {
        let ms = !this.state.mostra_tutti;
        this.setState({ mostra_tutti: ms });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">MARCATORI</h5>
                        <button className="btn btn-link p-0" onClick={() => this.mostraTutti()}>
                            mostra tutti
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="scrollbox" style={{ maxHeight: "95vh" }} >
                        <div style={{ borderBottom: "1px solid #dee2e6" }}>
                            {
                                (!this.state.loaded) ? <Loader /> : ((this.state.mostra_tutti) ? (this.state.marcatori.map((marc, i) =>
                                    <Marcatore key={i} {...marc} show={(marc.pos === this.state.showing)} callback={() => this.dettagli(marc.pos)} />
                                )) : (this.state.marcatori.slice(0, 5).map((marc, i) =>
                                    <Marcatore key={i} {...marc} show={(marc.pos === this.state.showing)} callback={() => this.dettagli(marc.pos)} />
                                )))
                            }
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
