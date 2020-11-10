import React from 'react'

import { titleCase } from '../../API/commons'

export function NewAzione() {
    return {
        period: "",
        time: "",
        team: {
            name: "",
            small: "",
            logo: ""
        },
        action: "",         // fallo di squadra, gol blu, rosso, ammonizione, tiro diretto, tiro di rigore
        action_supp: "",    // # fallo per falli, tabellone per gol
        player: {
            name: "",
            number: 0,
            id: 0
        }
    }
}

function createElement(type, title, badge, player, time, img) {
    return (
        <div className="action-elem action-elem-secondary">
            {(badge != null) ? (<span className="badge badge-secondary sora">{badge}</span>) : ""}
            <h5>{title}</h5>
            {(player != null) ? (<p>{player}</p>) : ""}
            <p style={{ fontSize: "0.8em" }}>{time}</p>
            <img src={img} alt="" />
        </div>
    )
}

export default function Azione(elem) {
    if (elem.action === "fallo") {
        return createElement('warning', elem.action_supp + "° fallo di squadra", null, null, elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "timeout") {
        return createElement('warning', "Timeout", null, null, elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "gol") {
        return createElement('success', "Gol", elem.action_supp, titleCase(elem.player.name) + " (" + elem.player.number + ")", elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "blu") {
        return createElement('primary', "Cartellino blu", null, titleCase(elem.player.name) + " (" + elem.player.number + ")", elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "rosso") {
        return createElement('danger', "Cartellino rosso", null, titleCase(elem.player.name) + " (" + elem.player.number + ")", elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "warning") {
        return createElement('warning', "Ammonizione verbale", null, titleCase(elem.player.name) + " (" + elem.player.number + ")", elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "diretto") {
        return createElement('primary', "Tiro diretto", null, "Tiro di: " + titleCase(elem.player.name), elem.period + " - " + elem.time, elem.team.logo);
    }
    else if (elem.action === "rigore") {
        return createElement('primary', "Tiro di rigore", null, "Tiro di: " + titleCase(elem.player.name), elem.period + " - " + elem.time, elem.team.logo);
    }
    return null;
}