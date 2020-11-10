import React from 'react'

export default function Labels(props) {

    const arr = prepare(parseInt(props.tempo) * 2, props.dir);
    return (
        <>
            {arr.map((a, i) => <Label key={i} {...a} />)}
        </>
    )
}

function prepare(totalMin, dir) {
    let a = [];
    let i = 0;
    while (i <= totalMin) {
        let pos = "" + i / totalMin * 100 + "%";
        a.push({
            style: (dir === "vert") ? { top: pos } : { left: pos },
            label: i
        });
        i += 5;
    }
    return a;
}

function Label(props) {
    return (
        <div className="tl-label" style={props.style}>{props.label}</div>
    )
}
