import React from 'react'
import { Link } from 'react-router-dom'

export default function Societa(props) {
    return (
        <div className="col col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3">
            <Link to={"/societa/" + props.id} className="link-unstyled">
                <div className="card card-body p-2 highlight" style={{ margin: "0.25rem", borderRadius: "10px" }}>
                    <img src={props.logo} style={{ margin: "0 auto", height: "40px" }} alt={props.small} />
                    <h5 className="mb-0 mt-1 text-center">{props.small}</h5>
                </div>
            </Link>
        </div>
    )
}