import React, { Component } from 'react'
import { caricaMarcatori } from '../../API/ApiMarcatori';
import Loader from '../Varie/Loader';
import { Marcatore } from './Marcatore';

export default class MarcatoriSquadra extends Component {
    constructor(props) {
        super();

        this.id_team = props.team;
        this.id_camp = props.camp;

        this.state = {
            marcatori: [],
            loaded: false,
            showing: -1
        }
    }

    componentDidMount() {
        caricaMarcatori(this.id_camp, (marc) => {
            marc = marc.filter(e => e.team.idt == this.id_team);
            marc.forEach(m => { this.state.marcatori.push(m) });
            this.setState({
                loaded: true
            });
        });
    }

    dettagli = (id) => {
        let showing = this.state.showing;
        if (id === showing)
            this.setState({ showing: -1 });
        else
            this.setState({ showing: id });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">MARCATORI</h5>
                    </div>
                </div>
                <div className="card-body">
                    <div style={{ borderBottom: "1px solid #dee2e6" }}>
                        {
                            (!this.state.loaded) ? <Loader /> : (this.state.marcatori.map((marc, i) =>
                                <Marcatore key={i} {...marc} show={(marc.pos === this.state.showing)} callback={() => this.dettagli(marc.pos)} />
                            ))
                        }
                    </div>
                </div>
            </div>

        )
    }
}
