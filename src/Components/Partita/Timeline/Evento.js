import React from 'react'

export default function Evento(elem) {

    // posizione
    let minxtempo = parseInt(elem.minxtempo);
    let time = elem.time.split(':');
    let min = (elem.period === 'P1' || elem.period === 'P2') ? (minxtempo - parseInt(time[0]) - 1) + (elem.period === 'P2' ? minxtempo : 0) : minxtempo * 2;
    let sec = (60 - parseInt(time[1]));
    let poss = ((min * 60 + sec) / (minxtempo * 2 * 60)) * 100;
    let pos = (elem.dir === "vert") ? { top: poss + "%" } : { left: poss + "%" };

    if (elem.action === "fallo") {
        return (
            <EventoBlock row="tl-row2" pos={pos}>
                <Fallo />
            </EventoBlock>
        )
    }
    else if (elem.action === "timeout") {
        return (
            <EventoBlock row="tl-row5" pos={pos}>
                <Timeout />
            </EventoBlock>
        )
    }
    else if (elem.action === "gol") {
        return (
            <EventoBlock row="tl-row1" pos={pos}>
                <Gol />
            </EventoBlock>
        )
    }
    else if (elem.action === "blu") {
        return (
            <EventoBlock row="tl-row3" pos={pos}>
                <Blu />
            </EventoBlock>
        )
    }
    else if (elem.action === "rosso") {
        return (
            <EventoBlock row="tl-row3" pos={pos}>
                <Rosso />
            </EventoBlock>
        )
    }
    else if (elem.action === "ammonizione") {
        return (
            <EventoBlock row="tl-row3" pos={pos}>
                <Ammonizione />
            </EventoBlock>
        )
    }
    else if (elem.action === "diretto") {
        return (
            <EventoBlock row="tl-row4" pos={pos}>
                <Diretto />
            </EventoBlock>
        )
    }
    else if (elem.action === "rigore") {
        return (
            <EventoBlock row="tl-row4" pos={pos}>
                <Rigore />
            </EventoBlock>
        )
    }
    return null
}

function EventoBlock(props) {
    return (
        <div className={"tl-elem " + props.row} style={props.pos}>
            {props.children}
        </div>
    )
}

function Fallo() { return (<span className="fa fa-circle text-warning"></span>) }
function Timeout() { return (<span className="badge badge-secondary">T</span>) }
function Gol() { return (<span className="fa fa-circle text-success"></span>) }
function Blu() { return (<span className="fa fa-square" style={{ color: "blue" }}></span>) }
function Rosso() { return (<span className="fa fa-square" style={{ color: "red" }}></span>) }
function Ammonizione() { return (<span className="fa fa-square" style={{ color: "#FF8000" }}></span>) }
function Diretto() { return (<span className="badge badge-secondary">D</span>) }
function Rigore() { return (<span className="badge badge-secondary">R</span>) }
