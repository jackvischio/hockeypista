import React from 'react'
import Evento from './Evento';
import Labels from './Labels';
import './timeline.css'

export default function TimelineVert(props) {

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
        <div className="card card-body d-block d-md-none" style={{ height: "95vh", paddingBottom: "30px" }}>
            <table className="timeline-vert">
                <tbody>
                    <tr className="head">
                        <td>
                            <img src={teamA.logo} alt={teamA.small} style={{ width: "30px" }} />
                            <h6 style={{ margin: "5px 0 0 0" }}>{teamA.small}</h6>
                        </td>
                        <td style={{ width: "40px" }}></td>
                        <td>
                            <img src={teamB.logo} alt={teamB.small} style={{ width: "30px" }} />
                            <h6 style={{ margin: "5px 0 0 0" }}>{teamB.small}</h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="tl-vert-cont tl-left" id="timeline-vert-A">
                                {actionsA.map((a, i) => <Evento key={i} {...a} dir="vert" minxtempo={tempo} />)}
                            </div>
                        </td>
                        <td>
                            <div className="tl-vert-sep" id="timeline-vert-sep">
                                <div className="tl-line"></div>
                                <Labels tempo={tempo} dir="vert" />
                            </div>
                        </td>
                        <td>
                            <div className="tl-vert-cont tl-right" id="timeline-vert-B">
                                {actionsB.map((a, i) => <Evento key={i} {...a} dir="vert" minxtempo={tempo} />)}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
