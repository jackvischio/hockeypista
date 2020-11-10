import React from 'react'

export default function Giocatori(props) {
    return (
        <table className="table table-striped table-bordered" width="100%">
            <thead className="thead-light">
                <tr style={{ borderBottom: "2px solid #BBB" }}>
                    <th className="col1">N°</th>
                    <th className="col2">R</th>
                    <th className="col3">5 I</th>
                    <th className="col4">Nome</th>
                    <th className="col5">Gol</th>
                    <th className="col6">
                        <i className="fas fa-square" style={{ color: "blue" }}></i>
                    </th>
                    <th className="col7">
                        <i className="fas fa-square" style={{ color: "red" }}></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.giocatori.map((g, i) => <Giocatore key={i} {...g} />)}
            </tbody>
        </table>
    )
}

function Giocatore(obj) {
    return (
        <tr>
            <td className="col1">{obj.num}</td>
            <td className="col2">
                <span>{obj.ruolo}</span>
            </td>
            <td className="col3">
                {(obj.i5) ? <span className="fa fa fa-circle" style={{ color: "#18B", fontSize: "0.8em" }} aria-hidden="true"></span> : ""}
            </td>
            <td className="col4">{obj.nome}</td>
            <td className="col5">{obj.gol}</td>
            <td className="col6">{obj.blu}</td>
            <td className="col7">{obj.rossi}</td>
        </tr>
    )
}