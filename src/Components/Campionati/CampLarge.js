import React from 'react'
import { Link } from 'react-router-dom'

function Img(props) {
    const imgStyle = {
        width: "40px",
        height: "auto",
        margin: "6px"
    }
    return <img src={props.logo} alt={props.name} style={imgStyle} />
}

export function CampLarge(props) {

    const colStyle = {
        padding: "10px"
    }

    const cardStyle = {
        borderRadius: "10px",
        height: "100%",
        position: "relative",
        margin: 0,
        cursor: "pointer"
    }

    const logoStyle = {
        padding: "10px 0 0 0",
        textAlign: "center"
    }

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 p-2" style={colStyle}>
            <div className="card highlight" style={cardStyle} >
                <Link className="link-unstyled" to={"/campionato/" + props.id} query={{nome: props.nome}}>
                    <div className="card-body">
                        <h5 className="card-title text-center"> {props.name} </h5>
                        <div style={logoStyle}>
                            {
                                props.teams.map((elem, index) => <Img key={index} {...elem} />)
                            }
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
