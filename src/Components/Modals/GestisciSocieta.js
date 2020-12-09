import React, { Component } from 'react'
import { titleCase } from '../../API/commons';
import { cacheVisCamp, cacheVisSocieta } from '../../Cache/CacheVisualizzazioni';

export default class GestisciSocieta extends Component {

    constructor(props) {
        super();

        this.state = {
            soc: props.soc,
            show: props.show,
            update: true
        }

        this.close = () => props.callback();
    }

    mostra(id) {
        this.state.show[id] = { id: id, show: true };
        this.setState((prev) => {
            return { update: !prev.update }
        });
    }

    nascondi(id) {
        this.state.show[id] = { id: id, show: false };
        this.setState((prev) => {
            return { update: !prev.update }
        });
    }

    save() {
        cacheVisSocieta(this.state.show);
        this.close();
    }

    render() {
        return (

            <div className="modal fade show" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content p-3">
                        <div className="d-flex justify-content-between mb-2">
                            <h5 className="card-title d-inline-block">
                                Seleziona campionati da visualizzare
                            </h5>
                            <a role="button" className="text-secondary" onClick={() => this.close()} title="chiudi">
                                <i className="fas fa-times"></i>
                            </a>
                        </div>
                        <div className="scrollbox mt-2 mb-2" style={{ maxHeight: "80vh", overflow: "auto" }}>
                            {
                                this.state.soc.map((e, i) => {
                                    let show = (this.state.show[e.id].show);
                                    let btnStyle = { padding: "4px 10px", margin: "0 3px" }
                                    return (
                                        <div className="card card-body p-1 pl-3" key={i}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="m-0">
                                                    {titleCase(e.nome).replace(' E ', ' e ')}
                                                </h5>
                                                <div style={{ minWidth: "100px", textAlign: "right" }}>
                                                    <button className={"btn " + ((show) ? "btn-primary" : "btn-light")} style={btnStyle} onClick={() => this.mostra(e.id)}>
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button className={"btn " + ((!show) ? "btn-primary" : "btn-light")} style={btnStyle} onClick={() => this.nascondi(e.id)}>
                                                        <i className="fas fa-eye-slash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success m-1" style={{ width: "125px" }} onClick={() => this.save()} >
                                salva
                            </button>
                            <button className="btn btn-secondary m-1" style={{ width: "125px" }} onClick={() => this.close()} >
                                annulla
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/*
function Elemento(props) {
    const btnStyle = {
        padding: "4px 10px",
        margin: "0 3px"
    }

    return (

    )
}





    this.camp = getCacheArray("vis_h_campionati");
this.camp = expand(camp, "id");
this.state = {
    camp =
        }

const salva = () => {

}

return (
    <>
        <div className="modal fade show" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="card">
                        <div className="card-header">
                            <h5>Seleziona campionati da visualizzare</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
)*/