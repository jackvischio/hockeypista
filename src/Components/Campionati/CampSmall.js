import React from 'react'
import { Link } from 'react-router-dom'

import { titleCase } from '../../API/commons'

export function CampSmall(props) {

    const colStyle = {
        padding: "0.25rem"
    }

    const cardStyle = {
        borderRadius: "10px",
        height: "100%",
        margin: 0,
        cursor: "pointer"
    }

    const bodyStyle = {
        padding: "0.75rem"
    }

    return (
        <div className="col col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4" style={colStyle}>
            <div className="card highlight" style={cardStyle} >
                <Link className="link-unstyled" to={"/campionato/" + props.id} >
                    <div className="card-body" style={bodyStyle}>
                        <h5 className="card-title text-center"> {titleCase(props.name)} </h5>
                    </div>
                </Link>
            </div>
        </div>
    )
}
