import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import { CaricaClassifica } from '../../Middleware/MwClassifica';

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
            CaricaClassifica.Squadra(sq.camp, sq.abbr, false, (obj) => {
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
                {this.state.classifiche.map((c, i) => <ClassificaElem {...c} key={i} />)}
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
                            <td className="cls-col4 text-right">
                                <b>{props.punti}</b> pti
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </div>
    )
}
