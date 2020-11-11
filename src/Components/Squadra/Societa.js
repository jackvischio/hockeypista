import React from 'react'
import { Link } from 'react-router-dom'

import { titleCase } from '../../API/commons'

export default function Campionato(props) {
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">SOCIET&Agrave;</h5>
            </div>
            <div className="card-body text-center">
                <img src={props.logo} style={{ width: "50%", maxWidth: "120px" }} alt={props.small} />
                <div style={{ height: "66px", marginTop: "10px" }} className="d-flex align-items-center justify-content-center">
                    <Link className="pb-0" to={"/societa/" + props.small} style={{ color: "black" }}>
                        <h3>{titleCase(props.nome)}</h3>
                    </Link>
                </div>
            </div>
        </div>
    )
}
