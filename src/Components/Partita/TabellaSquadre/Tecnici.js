import React from 'react'

export default function Tecnici(props) {
    return (
        <table className="table table-striped table-bordered table-match" width="100%">
            <thead className="thead-light">
                <tr style={{ borderBottom: "2px solid #BBB" }}>
                    <th colSpan="7">Ruoli tecnici</th>
                </tr>
            </thead>
            <tbody>
                {props.tecnici.map((t, i) => <Tecnico key={i} {...t} />)}
            </tbody>
        </table>
    )
}

function Tecnico(obj) {
    return (
        <tr>
            <td className="col1"></td>
            <td className="col2">
                <span>{obj.ruolo}</span>
            </td>
            <td className="col3"> </td>
            <td className="col4" colSpan="2">{obj.nome}</td>
            <td className="col6">{obj.blu}</td>
            <td className="col7">{obj.rossi}</td>
        </tr>
    )
}