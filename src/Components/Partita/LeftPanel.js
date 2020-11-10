import React from 'react'
import { Link } from 'react-router-dom'

import Arbitri from './Abitri'

export default function LeftPanel(props) {

    return (
        <>
            <div className="card" style={{ height: "calc(100% - 10px)" }}>
                <div className="card-body text-center">
                    <div className="h-100 d-flex align-items-center">
                        <div className="w-100">
                            <h4>
                                <Link to={"/campionato/" + props.idc} style={{ color: "black" }}>
                                    {props.campionato.nome}
                                </Link>
                            </h4>
                            <h6>
                                {props.campionato.girone}
                            </h6>
                            <h5>
                                {props.date.day} - {props.date.hour}
                            </h5>
                            <h6>
                                {props.place}
                            </h6>
                            <hr />
                            <table className="table m-0 tbl-referees">
                                <tbody>
                                    <Arbitri {...props.referees} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
