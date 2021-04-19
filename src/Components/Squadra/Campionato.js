import React from 'react'
import { Link } from 'react-router-dom'

import { titleCase } from '../../API/commons'

export default function Campionato(props) {
    console.log(props);
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">CAMPIONATO</h5>
            </div>
            <div className="card-body text-center">
                <img src={props.logo} style={{ width: "50%", maxWidth: "120px" }} alt={props.abbr} />
                <div style={{ height: "66px", marginTop: "10px" }} className="d-flex align-items-center justify-content-center">
                    <Link className="pb-0" to={"/campionato/" + props.id} style={{ color: "black" }}>
                        <h3>{titleCase(props.name).replace(' E ', ' e ')}</h3>
                    </Link>
                </div>
            </div>
        </div>
    )
}
