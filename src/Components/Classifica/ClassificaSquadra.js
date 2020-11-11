import React, { Component } from 'react'
import { caricaClassifica } from '../../API/ApiClassifica';
import { getCachedSquadra } from '../../Cache/CacheSquadra';
import Loader from '../Varie/Loader';

export default class ClassificaSquadra extends Component {
    constructor(props) {
        super();

        this.id_team = props.team;
        this.id_camp = props.camp;
        this.logo = getCachedSquadra(this.id_team).logo;

        this.state = {
            classifica: {},
            loaded: false
        }
    }

    componentDidMount() {
        caricaClassifica(this.id_camp, (clas) => {
            let obj = clas.filter(e => e.logo.substr(e.logo.lastIndexOf("/")) == this.logo.substr(this.logo.lastIndexOf("/")))[0];
            this.setState({
                classifica: obj,
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
            <p style={{ fontSize: "1.4em" }}>punti: <strong>{clas.punti}</strong></p>
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