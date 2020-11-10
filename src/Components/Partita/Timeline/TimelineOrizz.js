import React from 'react'
import Evento from './Evento';
import Labels from './Labels';
import './timeline.css'

export default function TimelineOrizz(props) {

    const tempo = props.campionato.tempo;
    const teamA = props.teamA;
    const teamB = props.teamB;
    let actions = props.actions;
    const actionsA = actions.filter(a => a.team.logo === teamA.logo);
    const actionsB = actions.filter(a => a.team.logo === teamB.logo);

    try {
        teamA.small = actionsA[0].team.small;
        teamB.small = actionsB[0].team.small;
    } catch (e) { }

    return (
        <>
            <div className="row d-none d-md-block">
                <div className="col col-12">
                    <div className="card" style={{ paddingRight: "1em" }}>
                        <div className="card-body">
                            <table className="timeline-oriz">
                                <tbody>
                                    <tr>
                                        <td className="head">
                                            <img src={teamA.logo} alt={teamA.small} style={{ width: "30px" }} />
                                            <h6 style={{ margin: "5px 0 0 0" }}>{teamA.small}</h6>
                                        </td>
                                        <td>
                                            <div className="tl-oriz-cont tl-top">
                                                {actionsA.map((a, i) => <Evento key={i} {...a} dir="oriz" minxtempo={tempo} />)}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div className="tl-oriz-sep" id="timeline-oriz-sep">
                                                <hr />
                                                <Labels tempo={tempo} dir="oriz" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="head">
                                            <img src={teamB.logo} alt={teamB.small} style={{ width: "30px" }} />
                                            <h6 style={{ margin: "5px 0 0 0" }}>{teamB.small}</h6>
                                        </td>
                                        <td>
                                            <div className="tl-oriz-cont tl-bottom">
                                                {actionsB.map((a, i) => <Evento key={i} {...a} dir="oriz" minxtempo={tempo} />)}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
