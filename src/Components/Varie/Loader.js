import React from 'react'

function Loader() {
    return (
        <div className="col m-2">
            <div className="m-4 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <h5>Caricamento ...</h5>
            </div>
        </div>
    )
}

export default Loader
