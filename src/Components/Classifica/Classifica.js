import React from 'react'

export const Classifica = (obj) => {

    const td = {
        verticalAlign: "middle",
        textAlign: "center",
        width: "10%",
        minWidth: "48px",
        padding: "5px"
    }

    const td_name = {
        width: "60%",
        padding: "5px",
        verticalAlign: "middle",
        textAlign: "left",
    }

    return (
        <>
            <table className="table mb-0">
                <tbody>
                    <tr>
                        <td style={td}> {obj.pos}<sup>o</sup> </td>
                        <td style={td}>
                            <img src={obj.logo} alt="logo" style={{ width: "30px", margin: 0 }} />
                        </td>
                        <td style={td_name}> {obj.nome} </td>
                        <td style={td}> <strong> {obj.punti} </strong> </td>
                        <td style={td}>
                            <button className="btn btn-link text-primary m-0" onClick={obj.callback}>
                                <i className="fas fa-plus-circle"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={"collapse" + ((obj.show) ? " show" : "")} >
                <div className="row text-center" style={{ fontSize: "0.8em", margin: "0 0 5px 0" }}>
                    <div className="col"> <strong>GTE </strong> {obj.gte} </div>
                    <div className="col"> <strong>VTE </strong> {obj.vte} </div>
                    <div className="col"> <strong>PTE </strong> {obj.pte} </div>
                    <div className="col"> <strong>PSE </strong> {obj.pse} </div>
                    <div className="w-100"></div>
                    <div className="col"> <strong>RFT </strong> {obj.rft} </div>
                    <div className="col"> <strong>RST </strong> {obj.rst} </div>
                    <div className="col"> <strong>DIFF</strong> {obj.diff} </div>
                    <div className="col"> <strong>PEN </strong> {obj.pen} </div>
                </div>
            </div>
        </>
    )
}