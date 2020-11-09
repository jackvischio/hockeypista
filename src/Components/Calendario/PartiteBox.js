import React from 'react'
import Partita from './Partita'

const GiornataVuota = () => {
    return <i style={{ color: "#777" }}>niente da visualizzare</i>
}

export default function PartiteBox(props) {
    if (props.giornata === null || props.giornata === undefined) {
        return <GiornataVuota />
    }
    else {
        return (
            <>
                { (props.giornata.partite.map((p, i) => <Partita key={i} {...p} />))}
            </>
        )
    }
}
