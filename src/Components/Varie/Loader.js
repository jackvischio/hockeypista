import React from 'react'

function Loader() {
    return (
        <div className="w-100 p-4 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <h5>Caricamento ...</h5>
        </div>
    )
}

export default Loader
