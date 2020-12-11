import React, { Component } from 'react'
import '../Components/Calendario/Calendario.css'

// CACHE
import { getCacheArray } from '../Cache/CacheCommons'
import { getSocieta } from '../Cache/CacheSocieta'
import { getCachedCampionato } from '../Cache/CacheCampionato'
import { getCachedSquadra } from '../Cache/CacheSquadra'

// API
import { CaricaPartita } from '../API/ApiPartita'

// COMPONENTS
import Navbar from '../Components/Varie/Navbar'
import { CampSmall as Campionato } from '../Components/Campionati/CampSmall'
import Partita from '../Components/Calendario/Partita'
import HomeCard from '../Components/Salvati/HomeCard'
import Squadra from '../Components/Salvati/Squadra'
import Societa from '../Components/Salvati/Societa'

export default class Salvati extends Component {

    constructor() {
        super();

        this.salvati = getCacheArray("ns_salvati");

        this.state = {
            societa: this.salvati.filter(e => (e.indexOf("/societa/") === 0)).map(e => { return parseInt(e.replace("/societa/", "")); }),
            squadre: this.salvati.filter(e => (e.indexOf("/squadra/") === 0)).map(e => { return parseInt(e.replace("/squadra/", "")); }),
            partiteID: this.salvati.filter(e => (e.indexOf("/partita/") === 0)).map(e => { return parseInt(e.replace("/partita/", "")); }),
            partite: [],
            campionati: this.salvati.filter(e => (e.indexOf("/campionato/") === 0)).map(e => { return parseInt(e.replace("/campionato/", "")); })
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        // caricamento partite
        this.state.partiteID.forEach(id => {
            CaricaPartita(id, (partita) => {
                this.setState(prev => {
                    return { partite: prev.partite.concat(partita) }
                });
            }, () => { });
        });
    }

    render() {
        return (
            <>
                <Navbar title="ELEMENTI SALVATI" active={"Salvati"} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-12 col-lg-6">
                            <HomeCard>
                                <h5 className="card-title">PARTITE</h5>
                                {
                                    (this.state.partite.length == 0) ? <p className="m-2 text-center"><i>Nessuna partita salvata</i></p> :
                                        this.state.partite.map((e, i) => {
                                            let p = {
                                                idp: e.id,
                                                day: e.date.day, hour: e.date.hour,
                                                campAbbr: e.campionato.abbr,
                                                score: ("" + e.goalsA + " - " + e.goalsB),
                                                teamA: { logo: e.teamA.logo, smallname: e.teamA.small, fullname: e.teamA.nome.toUpperCase() },
                                                teamB: { logo: e.teamB.logo, smallname: e.teamB.small, fullname: e.teamB.nome.toUpperCase() }
                                            }
                                            return <Partita key={i} {...p} />
                                        })
                                }
                            </HomeCard>

                            <HomeCard>
                                <h5 className="card-title">SQUADRE</h5>
                                <div className="row">
                                    {
                                        this.state.squadre.map((id, i) => {
                                            let obj = getCachedSquadra(id);
                                            return <Squadra key={i} {...obj} />
                                        })
                                    }
                                </div>
                            </HomeCard>
                        </div>
                        <div className="col col-12 col-lg-6">
                            <HomeCard>
                                <h5 className="card-title">CAMPIONATI</h5>
                                <div className="row">
                                    {
                                        this.state.campionati.map((id, i) => {
                                            let obj = getCachedCampionato(id);
                                            return <Campionato key={i} {...obj} />
                                        })
                                    }
                                </div>
                            </HomeCard>
                            <HomeCard>
                                <h5 className="card-title">SOCIET&Agrave;</h5>
                                <div className="row">
                                    {
                                        this.state.societa.map((id, i) => {
                                            let obj = getSocieta(id);
                                            return <Societa key={i} {...obj} />
                                        })
                                    }
                                </div>
                            </HomeCard>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}