import React from 'react'

const Arbitro = (props) => {
    return (
        <tr>
            <td>{props.ruolo}</td>
            <td>{props.nome}</td>
        </tr>
    )
}

export default function Abitri(props) {

    let show12 = false, show2 = false, showa = false;

    if (props.ref1 !== "" && props.ref2 === "") show12 = false;
    if (props.ref1 !== "" && props.ref2 !== "") show12 = true;
    if (props.ref2 !== "") show2 = true;
    if (props.aus !== "") showa = true;

    return (
        <>
            { (show12) ? <Arbitro ruolo="Arbitro 1" nome={props.ref1} /> : <Arbitro ruolo="Arbitro" nome={props.ref1} />}
            { (show2) ? <Arbitro ruolo="Arbitro 2" nome={props.ref2} /> : null}
            { (showa) ? <Arbitro ruolo="Ausiliario" nome={props.aus} /> : null}
        </>
    )
}
