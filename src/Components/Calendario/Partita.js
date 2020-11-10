import React from 'react'
import { Link } from 'react-router-dom'
import './Calendario.css'

export default function Partita(obj) {
    if (obj.idp !== undefined && obj.idp !== "") {
        return <PartitaAttiva {...obj} />
    }
    else {
        return <PartitaDaFare {...obj} />
    }
}

const PartitaDaFare = (obj) => {
    return (
        <div className="card cal-elem-outer">
            <div className="card-body cal-elem-inner">
                <div className="cal-elem-row">
                    <div className="cal-date">
                        {obj.day + " " + obj.hour}
                    </div>
                    <div className="cal-match">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="cal-flex">
                                            <img className="cal-logo" src={obj.teamA.logo} alt={obj.teamA.smallname} />
                                            <div className="cal-team-left d-sm-inline-block d-none">{obj.teamA.fullname}</div>
                                            <div className="cal-team-left d-sm-none d-inline-block">{obj.teamA.smallname}</div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {obj.score}
                                    </td>
                                    <td>
                                        <div className="cal-flex-rev">
                                            <img className="cal-logo" src={obj.teamB.logo} alt={obj.teamB.smallname} />
                                            <div className="cal-team-right d-sm-inline-block d-none">{obj.teamB.fullname}</div>
                                            <div className="cal-team-right d-sm-none d-inline-block">{obj.teamB.smallname}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PartitaAttiva = (obj) => {
    return (
        <div className="card highlight cal-elem-outer">
            <Link to={"/partita/" + obj.idp} className="link-unstyled">
                <div className="card-body cal-elem-inner">
                    <div className="cal-elem-row">
                        <div className="cal-date">
                            {obj.day + " " + obj.hour}
                        </div>
                        <div className="cal-match">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="cal-flex">
                                                <img className="cal-logo" src={obj.teamA.logo} alt={obj.teamA.smallname} />
                                                <div className="cal-team-left d-sm-inline-block d-none">{obj.teamA.fullname}</div>
                                                <div className="cal-team-left d-sm-none d-inline-block">{obj.teamA.smallname}</div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {obj.score}
                                        </td>
                                        <td>
                                            <div className="cal-flex-rev">
                                                <img className="cal-logo" src={obj.teamB.logo} alt={obj.teamB.smallname} />
                                                <div className="cal-team-right d-sm-inline-block d-none">{obj.teamB.fullname}</div>
                                                <div className="cal-team-right d-sm-none d-inline-block">{obj.teamB.smallname}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
