import { Callbacks } from 'jquery'
import React from 'react'
import { titleCase } from '../../API/commons'

export default function Rigori(props) {
    return (
        <>
            <div className="card w-100">
                <div className="card-body text-center">
                    <h5 className="card-title mb-1">Rigori</h5>
                    <div className="d-block d-md-none">
                        <RigoriSmall {...props} />
                    </div>
                    <div className="d-none d-md-block">
                        <RigoriBig {...props} />
                    </div>
                </div>
            </div>
        </>
    )
}

function RigoriBig(props) {
    return (
        <>
            <div className="d-flex align-items-center w-100 m-0">
                <table className="w-50 m-0">
                    <tbody>
                        <tr>
                            <td style={{ width: "60px" }}>
                                <img src={props.teamA.logo} alt={props.teamA.small} style={{ width: "30px" }} />
                                <h6 style={{ margin: "5px 0 0 0" }}>{props.teamA.small}</h6>
                            </td>
                            <td>
                                <table className="table table-bordered table-match mb-0" style={{ borderBottom: "1px solid #ddd" }}>
                                    <tbody>
                                        {props.rigoriA.map((e, i) => <RigoristaA {...e} key={i} />)}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-50">
                    <tbody>
                        <tr>
                            <td>
                                <table className="table table-bordered table-match mb-0" style={{ borderBottom: "1px solid #ddd" }}>
                                    <tbody>
                                        {props.rigoriB.map((e, i) => <RigoristaB {...e} key={i} />)}
                                    </tbody>
                                </table>
                            </td>
                            <td style={{ width: "60px" }}>
                                <img src={props.teamB.logo} alt={props.teamB.small} style={{ width: "30px" }} />
                                <h6 style={{ margin: "5px 0 0 0" }}>{props.teamB.small}</h6>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

function RigoriSmall(props) {
    return (
        <table className="w-100">
            <tbody>
                <tr>
                    <td>
                        <img src={props.teamA.logo} alt={props.teamA.small} style={{ width: "30px" }} />
                        <h6 style={{ margin: "5px 0 0 0" }}>{props.teamA.small}</h6>
                    </td>
                    <td>
                        <img src={props.teamB.logo} alt={props.teamB.small} style={{ width: "30px" }} />
                        <h6 style={{ margin: "5px 0 0 0" }}>{props.teamB.small}</h6>
                    </td>
                </tr>
                <tr>
                    <td className="w-50">
                        <table className="table table-bordered table-match mb-0 w-100" style={{ borderBottom: "1px solid #ddd" }}>
                            <tbody>
                                {props.rigoriA.map((e, i) => <RigoristaA {...e} key={i} />)}
                            </tbody>
                        </table>
                    </td>
                    <td className="w-50">
                        <table className="table table-bordered table-match mb-0 w-100" style={{ borderBottom: "1px solid #ddd" }}>
                            <tbody>
                                {props.rigoriB.map((e, i) => <RigoristaB {...e} key={i} />)}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

function RigoristaA(props) {
    return (
        <tr>
            <td className="col1">{props.num}</td>
            <td>{titleCase(props.gioc)}</td>
            <td className="col6"><i className="fas fa-square" style={{ color: "#ccc" }}></i></td>
        </tr>
    )
}
function RigoristaB(props) {
    return (
        <tr>
            <td className="col6"><i className="fas fa-square" style={{ color: "#ccc" }}></i></td>
            <td>{titleCase(props.gioc)}</td>
            <td className="col1">{props.num}</td>
        </tr>
    )
}