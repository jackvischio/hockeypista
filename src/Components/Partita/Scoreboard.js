import React from 'react'
import { Link } from 'react-router-dom'

export default function Scoreboard(props) {
    return (
        <div className="card" style={{ height: "calc(100% - 10px)" }}>
            <div className="card-body text-center">
                <div className="h-100 d-flex align-items-center">
                    <ScoreboardSmall {...props} />
                    <ScoreboardLarge {...props} />
                </div>
            </div>
        </div>
    )
}

function ScoreboardSmall(props) {
    return (
        <div className="w-100 d-sm-none">
            <div className="row">
                <SquadraSmall style={{ paddingRight: "5px" }} team={props.teamA} />
                <SquadraSmall style={{ paddingLeft: "5px" }} team={props.teamB} />
            </div>
            <br />
            <div className="w-100">
                <h1 className="title-badge badge-success">
                    {props.goalsA + " - " + props.goalsB}
                </h1>
                <br />
                <h5 className="title-badge badge-secondary mt-2">
                    {props.currentTime}
                </h5> &nbsp;
                {
                    (props.currentTimestamp !== undefined && props.currentTimestamp !== "") ?
                        <h5 className="title-badge badge-secondary mt-2"> {props.currentTimestamp} </h5> : ""
                }
            </div>
            <br />
            <table className="w-100 mb-0">
                <tbody>
                    <Falli {...props} />
                </tbody>
            </table>
        </div>
    )
}

function ScoreboardLarge(props) {
    return (
        <div className="d-none d-sm-block w-100">
            <table className="w-100">
                <tbody>
                    <tr>
                        <td width="35%">
                            <SquadraLarge team={props.teamA} />
                        </td>
                        <td width="30%">
                            <h1 className="title-badge badge-success">
                                {props.goalsA + " - " + props.goalsB}
                            </h1>
                            <br />
                            <h5 className="title-badge badge-secondary" style={{ marginTop: "10px", fontWeight: "400" }}>
                                {props.currentTime.replace("PENALTIS", "RIGORI")}
                            </h5>
                            <br />
                            {
                                (props.currentTimestamp !== undefined && props.currentTimestamp !== "") ?
                                    <h6 className="title-badge badge-secondary" style={{ marginTop: "10px", fontWeight: "400" }}> {props.currentTimestamp} </h6> : ""
                            }
                        </td>
                        <td width="35%">
                            <SquadraLarge team={props.teamB} />
                        </td>
                    </tr>
                    <tr height="20px">
                        <td></td>
                    </tr>
                    <Falli {...props} />
                </tbody>
            </table>
        </div>
    )
}

function SquadraSmall(props) {
    return (
        <div className="col col-6" style={props.style}>
            <img src={props.team.logo} alt={props.team.small} width="80px" />
            <Link style={{ color: "black" }} to={"/squadra/" + props.team.idt} >
                <h3 className="SquadraName">
                    {props.team.nome}
                </h3>
            </Link>
        </div>
    )
}

function SquadraLarge(props) {
    return (
        <>
            <img src={props.team.logo} alt={props.team.small} width="90px" />
            <Link style={{ color: "black" }} to={"/squadra/" + props.team.idt} >
                <h3 className="SquadraName">
                    {props.team.nome}
                </h3>
            </Link>
        </>
    )
}

function Falli(props) {
    return (
        <tr>
            <td width="35%">
                <h4 className="sora"> {props.falliA} </h4>
            </td>
            <td width="30%"> falli </td>
            <td width="35%">
                <h4 className="sora"> {props.falliB} </h4>
            </td>
        </tr>
    )
}