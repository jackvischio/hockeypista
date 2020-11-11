import React from 'react'

import Giocatori from './Giocatori'
import Tecnici from './Tecnici'

export default function Squadra(props) {

    return (
        <div className="col col-12 col-md-6">
            <div className="card">
                <div className="card-header text-center">
                    <h5 className="card-title text-uppercase">
                        {props.nome}
                    </h5>
                </div>
                <div className="card-body">
                    <Giocatori giocatori={props.giocatori} />
                    <br />
                    <Tecnici tecnici={props.tecnici} />
                </div>
            </div>
        </div>
    )
}