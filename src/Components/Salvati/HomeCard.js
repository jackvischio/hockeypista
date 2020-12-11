import React from 'react'

export default function HomeCard(props) {
    return (
        <div className="row">
            <div className="col col-12">
                <div className="card">
                    <div className="card-header">
                        {props.children[0]}
                    </div>
                    <div className="card-body">
                        <div className="scrollbox">
                            {props.children[1]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}