import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorePartita(props) {
    return (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog" style={{ marginTop: "120px" }}>
                <div className="modal-content">
                    <div className="card card-body text-center">
                        <h5 className="text-bold">Partita non iniziata</h5>
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
