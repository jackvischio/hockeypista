import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorePartita(props) {
    return (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog" style={{ marginTop: "120px" }}>
                <div className="modal-content">
                    <div className="card card-body text-center">
                        <h1 className="m-0 text-danger">
                            <i class="fas fa-hourglass-start"></i>
                        </h1>
                        <h4 className="mt-1">Partita non iniziata</h4>
                        <br />
                        <button onClick={props.callBack} className="btn btn-primary" style={{ width: "100%", maxWidth: "200px", margin: "0 auto" }}>
                            indietro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
