import React from 'react'
import { Link } from 'react-router-dom'

export default function SquadraBox(obj) {
    const cardStyle = {
        minWidth: "150px",
        maxWidth: "100%",
        padding: "10px",
        borderRadius: "10px",
        margin: 0,
        TextAlign: "center"
    }

    return (
        <div className="col m-1 p-0" style={{ cursor: "pointer" }}>
            <Link className="link-unstyled" to={"/squadra/" + obj.id}>
                <div className="card card-body text-center highlight" style={cardStyle}>
                    <img src={obj.logo} style={{ margin: "0 auto", height: "40px" }} alt={obj.name} />
                    <h5 className="mb-0">{obj.name}</h5>
                </div>
            </Link>
        </div>
    );
}