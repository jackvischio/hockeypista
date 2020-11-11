import React, { Component } from 'react'
import { IsSaved, Salva, DisSalva } from '../../Cache/CachePreferiti'

export default class Preferiti extends Component {

    constructor(props) {
        super();

        this.path = props.path;

        this.state = {
            saved: IsSaved(this.path)
        }
    }

    salvaComePreferito() {
        if (this.state.saved) {
            DisSalva(this.path);
            this.setState({ saved: false });
        }
        else {
            Salva(this.path);
            this.setState({ saved: true });
        }
    }

    render() {
        return (
            <>
                <button className="btn btn-light d-none d-md-block" title={((this.state.saved) ? "Salva nei preferiti" : "Salvato")} onClick={() => this.salvaComePreferito()}>
                    <i className={"fas fa-star " + ((this.state.saved) ? "text-warning" : "")} title="Salva come preferito"></i>
                </button>
                <div className="navbar-nav ml-auto mt-0 mt-lg-0 font-weight-bold d-block d-md-none">
                    <span className="nav-item nav-link" onClick={() => this.salvaComePreferito()}>
                        {((this.state.saved) ? <span className="text-warning">Salvato</span> : "Salva nei preferiti")}
                    </span>
                </div>
            </>
        )
    }
}

const SalvaSM = () => {
    return (
        <i className="fas fa-star" title="Salva come preferito"></i>
    )
}