import React from 'react'

export const Marcatore = (obj) => {

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
                            <img src={obj.team.logo} alt="logo" style={{ width: "30px" }} />
                        </td>
                        <td style={td_name}> {obj.name} </td>
                        <td style={td}> <strong> {obj.goals} </strong> </td>
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
                    <div className="col"> <strong>GTE </strong> {obj.matches} </div>
                    <div className="col"> <strong>ASS </strong> {obj.assists} </div>
                    <div className="col"> <strong>RIG </strong> {obj.rigori} </div>
                    <div className="col"> <strong>DIR </strong> {obj.diretti} </div>
                </div>
            </div>
        </>
    )
}