import React from 'react';
import { Link } from 'react-router-dom';
import { titleCase } from '../../API/commons';

export default function Campionato(props) {

    // statistiche cumulative
    var tot = { presenze: 0, goal: 0, assist: 0, direttiA: 0, direttiB: 0, rigoriA: 0, rigoriB: 0, blu: 0, rossi: 0 };
    props.partite.map(p => {
        tot.presenze++;
        tot.goal += parseInt(p.goal);
        tot.assist += parseInt(p.assist);
        let rig = p.rigori.split('/');
        tot.rigoriA += parseInt(rig[0]);
        tot.rigoriB += parseInt(rig[1]);
        let dir = p.diretti.split('/');
        tot.direttiA += parseInt(dir[0]);
        tot.direttiB += parseInt(dir[1]);
        tot.blu += parseInt(p.blu);
        tot.rossi += parseInt(p.rossi);
    });

    // rendering
    return (
        <>
            <Link to={"/campionato/" + props.id} className="link-black">
                <h5 className="text-center">{titleCase(props.nome).replace(/ E /g, " e ")}</h5>
            </Link>
            <table className="table table-striped table-bordered table-squadra">
                <thead className="thead-light">
                    <tr style={{ borderBottom: "2px solid rgb(187, 187, 187)" }}>
                        <th className="col1 d-none d-md-table-cell"></th>
                        <th className="col2"></th>
                        <th className="col3">Gol</th>
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
                <thead className="thead-light">
                    <tr style={{ borderBottom: "2px solid rgb(187, 187, 187)" }}>
                        <th className="col1 d-none d-md-table-cell"></th>
                        <th className="col2 text-center">{tot.presenze + " presenz" + (tot.presenze === 1 ? "a" : "e")}</th>
                        <th className="col3">{tot.goal}</th>
                        <th className="col4">{tot.assist}</th>
                        <th className="col5">{tot.rigoriA + "/" + tot.rigoriB}</th>
                        <th className="col6">{tot.direttiA + "/" + tot.direttiB}</th>
                        <th className="col7">{tot.blu}</th>
                        <th className="col7">{tot.rossi}</th>
                    </tr>
                </thead>
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