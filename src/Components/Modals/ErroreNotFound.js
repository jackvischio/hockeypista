import React from 'react';
import { Link } from 'react-router-dom';

export default function ErroreNotFound(props) {
    return (
        <div className="modal fade show" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog">
                <div className="modal-content p-4 text-center">
                    <h1 className="m-0 text-danger">
                        <i className="fas fa-bug"></i>
                    </h1>
                    <h4 className="mt-1">{props.title}</h4>
                    <br />
                    <button onClick={props.callBack} className="btn btn-primary" style={{ width: "100%", maxWidth: "200px", margin: "0 auto" }}>
                        indietro
                    </button>
                </div>
            </div>
        </div>
    );
}