import React from 'react'
import Loader from './Loader'

export default function ModalLoader() {
    return (
        <div className="modal fade show" tabindex="-1" role="dialog" style={{ display: "block", backgroundColor: "#4445" }}>
            <div className="modal-dialog" style={{ marginTop: "120px" }}>
                <div class="modal-content">
                    <Loader />
                </div>
            </div>
        </div>
    )
}
