import React, { Component } from 'react'

import { caricaClassifica } from "../../API/ApiClassifica"

import Loader from "../Loader"
import { Classifica } from "./Classifica"

export default class ClassificaBox extends Component {
    constructor(props) {
        super();
        this.id_camp = props.idc;

        this.state = {
            classifica: [],
            loaded: false,
            showing: -1
        }
    }

    componentDidMount() {
        caricaClassifica(this.id_camp, (clas) => {
            clas.forEach(c => { this.state.classifica.push(c) });
            this.setState({
                loaded: true
            });
        });
    }

    dettagli = (id) => {
        let showing = this.state.showing;
        if (id == showing)
            this.setState({ showing: -1 });
        else
            this.setState({ showing: id });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">CLASSIFICA</h5>
                    </div>
                </div>
                <div className="card-body">
                    <div id="marcatori" style={{ borderBottom: "1px solid #dee2e6" }}>
                        {
                            (!this.state.loaded) ? <Loader /> : this.state.classifica.map((camp, i) =>
                                <Classifica key={i} {...camp} show={(camp.pos === this.state.showing)} callback={() => this.dettagli(camp.pos)} />
                            )
                        }
                    </div>
                </div>
            </div>

        )
    }
}
