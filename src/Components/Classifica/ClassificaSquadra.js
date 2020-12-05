import React, { Component } from 'react'
import { caricaClassificaSquadra } from '../../API/ApiClassifica';
import { getCachedSquadra } from '../../Cache/CacheSquadra';
import Loader from '../Varie/Loader';

export default class ClassificaSquadra extends Component {
    constructor(props) {
        super();

        this.id_team = props.team;
        this.id_camp = props.camp;
        this.nome = getCachedSquadra(this.id_team).nome;
        this.abbr = getCachedSquadra(this.id_team).abbr;

        this.state = {
            classifica: {},
            loaded: false
        }
    }

    componentDidMount() {
        caricaClassificaSquadra(this.id_camp, this.abbr, (clas) => {
            this.setState({
                classifica: clas,
                loaded: true
            })
        });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">CLASSIFICA</h5>
                </div>
                <div className="card-body">
                    {(this.state.loaded) ? <ActualClassifica {...this.state.classifica} /> : <Loader />}
                </div>
            </div>
        )
    }
}

function ActualClassifica(clas) {
    return (
        <div className="text-center">
            <h1 className="m-0">{clas.pos}<sup>o</sup></h1>
            <h3>POSTO</h3>
            <p style={{ fontSize: "1.4em" }}><strong>{clas.punti}</strong> {clas.punti == 1 ? "punto" : "punti"}</p>
            <div className="row text-center m-0" style={{ fontSize: "0.8em" }}>
                <div className="col"> <strong>GTE </strong> {clas.gte} </div>
                <div className="col"> <strong>VTE </strong> {clas.vte} </div>
                <div className="col"> <strong>PTE </strong> {clas.pte} </div>
                <div className="col"> <strong>PSE </strong> {clas.pse} </div>
                <div className="w-100"></div>
                <div className="col"> <strong>RFT </strong> {clas.rft} </div>
                <div className="col"> <strong>RST </strong> {clas.pos} </div>
                <div className="col"> <strong>DIFF</strong> {clas.diff} </div>
                <div className="col"> <strong>PEN </strong> {clas.pen} </div>
            </div>
        </div>
    )
}