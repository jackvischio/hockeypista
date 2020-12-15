import React from 'react';
import { Link } from 'react-router-dom';

export default function ErroreAttivazione() {
    return (
        <div className="modal fade show" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog">
                <div className="modal-content p-4 text-center">
                    <h1 className="m-0 text-warning">
                        <i class="fas fa-exclamation"></i>
                    </h1>
                    <h4 className="mt-1">Mmm... sembra che il sito non sia attivo...</h4>
                    <p>Consulta la guida per attivare il sito</p>
                    <Link to="/guida" role="button" className="btn btn-sm btn-primary mt-2" style={{ width: "100%", maxWidth: "200px", margin: "0 auto" }}>
                        guida
                    </Link>
                </div>
            </div>
        </div>
    );
}