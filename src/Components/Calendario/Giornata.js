import React from 'react'

import { titleCase } from '../../API/commons'

import PartiteBox from './PartiteBox'

export default function Giornata(props) {
    return (
        <div style={{ marginTop: "20px" }}>
            <h5 className="d-inline-block">
                {titleCase(props.giornata.giornata)}
            </h5>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span> {props.giornata.data}</span>
            <br />
            <PartiteBox giornata={props.giornata} />
        </div>
    )
}
