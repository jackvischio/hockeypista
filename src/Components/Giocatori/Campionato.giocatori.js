import React from 'react';
import { Link } from 'react-router-dom';
import { titleCase } from '../../API/commons';

export default function Campionato(props) {
    return (
        <>
            <Link to={"/campionato/" + props.id} className="link-black">
                <h5 className="text-center">{titleCase(props.nome)}</h5>
            </Link>
            <table className="table table-striped table-bordered table-squadra">
                <thead className="thead-light">
                    <tr style={{ borderBottom: "2px solid rgb(187, 187, 187)" }}>
                        <th className="col1 d-none d-md-table-cell"></th>
                        <th className="col2"></th>
                        <th className="col4">Gol</th>
                        <th className="col4">Ass</th>
                        <th className="col5">Rig</th>
                        <th className="col6">Dir</th>
                        <th className="col7"><i className="fas fa-square" style={{ color: "blue" }}></i></th>
                        <th className="col7"><i className="fas fa-square" style={{ color: "red" }}></i></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.partite.map((e, i) => <Partita {...e} key={i} />)
                    }
                </tbody>
            </table>
        </>
    );
}

function Partita(obj) {
    var intero = (val) => {
        if (val == "0") return <span className="nv">0</span>;
        return val;
    }

    var tiri = (val) => {
        if (val == "0/0") return <span className="nv">0/0</span>;
        return val;
    }

    return (
        <tr>
            <td className="col1 d-none d-md-table-cell px-2">{obj.data}</td>
            <td>
                <div className="d-flex justify-content-between mx-2">
                    <span style={{ width: "30%", textAlign: "left" }}>{obj.squadraA}</span>
                    <span style={{ width: "30%", textAlign: "center" }}>{obj.risultato}</span>
                    <span style={{ width: "30%", textAlign: "right" }}>{obj.squadraB}</span>
                </div>
            </td>
            <td className="col4">{intero(obj.goal)}</td>
            <td className="col5">{intero(obj.assist)}</td>
            <td className="col6">{tiri(obj.rigori)}</td>
            <td className="col7">{tiri(obj.diretti)}</td>
            <td className="col7">{intero(obj.blu)}</td>
            <td className="col7">{intero(obj.rossi)}</td>
        </tr>
    )
}