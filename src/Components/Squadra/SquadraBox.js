import React from 'react'
import { Link } from 'react-router-dom';

export default function SquadraBox(props) {
    return (
        <div>
            <div className="row m-0">
                <div className="col col-sm-12 col-md-9 col-lg-12 col-xl-8">
                    <div style={{ width: "100%", overflow: "auto" }}>
                        <table className="table table-striped table-bordered table-squadra">
                            <thead className="thead-light">
                                <tr style={{ borderBottom: "2px solid #BBB" }}>
                                    <th className="col1"></th>
                                    <th className="col2">Nome</th>
                                    <th className="col3">Gte</th>
                                    <th className="col4">Gol</th>
                                    <th className="col4">Ass</th>
                                    <th className="col5">Rig</th>
                                    <th className="col6">Dir</th>
                                    <th className="col7"><i className="fas fa-square" style={{ color: "blue" }}></i></th>
                                    <th className="col7"><i className="fas fa-square" style={{ color: "red" }}></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.giocatori.map((g, i) => <Giocatore {...g} key={i} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className="col col-sm-12 col-md-3 col-lg-12 col-xl-4 p-0 pt-3 pt-md-0 pl-md-2 pl-lg-0 pt-lg-3 pl-xl-3 pt-xl-0">
                    <table className="table table-striped table-bordered table-squadra">
                        <thead className="thead-light">
                            <tr>
                                <th className="col1"></th>
                                <th className="col2">Ruoli tecnici</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.tecnici.map((g, i) => <Tecnico {...g} key={i} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function Giocatore(obj) {
    let f = (str, nv) => {
        if (str == nv)
            return (<span className="nv"> {str}</span>);
        return str;
    }

    return (
        <tr>
            <td className="col1">
                <img src={obj.naz} alt="" />
            </td>
            <td className="col2">
                <Link to={"/giocatore/" + obj.idpl} className="link-black">
                    {obj.nome}
                </Link>
            </td>
            <td className="col3">{f(obj.presenze, "0")}</td>
            <td className="col4">{f(obj.gol, "0")}</td>
            <td className="col5">{f(obj.assist, "0")}</td>
            <td className="col6">{f(obj.rigori, "0/0")}</td>
            <td className="col7">{f(obj.diretti, "0/0")}</td>
            <td className="col7">{f(obj.blu, "0")}</td>
            <td className="col7">{f(obj.rossi, "0")}</td>
        </tr>
    )
}

function Tecnico(obj) {
    return (
        <tr>
            <td className="col1">
                <img src={obj.naz} alt="" />
            </td>
            <td className="col2">{obj.nome}</td>
        </tr>
    )
}
