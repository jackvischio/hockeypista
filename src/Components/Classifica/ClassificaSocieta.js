import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { caricaClassifica, caricaClassificaSquadra } from '../../API/ApiClassifica';

export default class ClassificaSocieta extends Component {

    constructor(props) {
        super();

        this.state = {
            squadre: props.squadre,
            classifiche: []
        }
    }

    componentDidMount() {
        this.state.squadre.forEach(sq => {
            caricaClassificaSquadra(sq.camp, sq.abbr, (obj) => {
                obj = (obj === undefined) ? { pos: "?", punti: "?" } : obj;
                this.setState((prevState) => {
                    return { classifiche: prevState.classifiche.concat({ ...obj, ...sq }).sort((a, b) => (a.camp > b.camp) ? 1 : -1) };
                })
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.classifiche.map(c => <ClassificaElem {...c} />)}
            </div>
        )
    }
}

function ClassificaElem(props) {
    return (
        <div className="card card-body highlight cls-card">
            <Link to={"/squadra/" + props.id} className="link-unstyled">
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td className="cls-col1">{props.camp_abb}</td>
                            <td className="cls-col2">{props.nome}</td>
                            <td className="cls-col3">
                                <b>{props.pos} <sup>o</sup></b>
                            </td>
                            <td className="cls-col4">
                                <b>{props.punti}</b> pti
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </div>
    )
}
