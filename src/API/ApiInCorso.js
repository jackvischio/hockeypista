import $ from 'jquery'
import { polishString, parseCompleteTag, parseIsleTag, removeTags, extractProp } from './commons'
import { getCachedCampionati } from '../Cache/CacheCampionato'
import { getCachedSquadre } from '../Cache/CacheSquadra'

function caricaPartite(then) {
    $.ajax({
        url: "https://www.server2.sidgad.es/fisr/fisr_mc_1.php",
        method: "GET",
        success: (data) => {
            data = prepareStringForParsing(data);
            let campionati = parsePlaying(data);
            // DEBUG 
            //campionati[0].matches[0].type = "TEMPO 1";
            //console.log(campionati);
            then(campionati);
        }
    });
}

function prepareStringForParsing(data) {
    // polishing the string
    data = polishString(data);
    data = data.replaceAll("'", '"');

    // removing comments, style blocks and input tags at the beginning
    while (data.indexOf("<!--") != -1) {
        let supp = data.substr(data.indexOf("<!--"));
        supp = supp.substr(0, supp.indexOf("-->") + 3);
        data = data.replace(supp, "");
    }
    data = removeTags(data, "style", true, true);
    data = data.substr(data.indexOf('<div class="scorer_apartado"'));
    data = data.substr(0, data.length - 6);

    // uniforming all blocks
    data = data.replaceAll('<a href="#" ', "<div ");
    data = data.replaceAll('</a>', "</div>");

    return data;
}

function parsePlaying(data) {
    let cachedCampionati = getCachedCampionati();
    let cachedSquadre = getCachedSquadre();

    let campionati = [];
    while (data.indexOf('<div class="scorer_apartado"') == 0) {
        // getting campionato
        let str = data.substr(0, data.indexOf('<div class="scorer_game'));
        data = data.replace(str, "");

        // new campionato
        let campionato = { name: "", id: 0, matches: [] };
        campionato.name = removeTags(removeTags(str, "div", true, false), "div", true, false).trim();

        // parsing matches of that campionato
        let maxLive = 0;
        while (data.indexOf('<div class="scorer_game') == 0 && maxLive < 1000) {
            maxLive++;
            data = data.substr(1);
            let current = data.substr(0, min(data.indexOf('<div class="scorer_game'), data.indexOf('<div class="scorer_apartado"'), data.length));
            data = data.replace(current, "");

            let tag = parseCompleteTag("<" + current);

            let cachedCamp = cachedCampionati.filter(c => c.name.toLowerCase() == extractContentByClass(tag.content, "scorer_liga").toLowerCase())[0];

            // try to extract the id of the campionato from the match
            try {
                let idc = parseInt(extractProp(tag, "idc"));
                campionato.id = (!isNaN(idc)) ? parseInt(idc) : cachedCamp.id;
            } catch (e) { }

            let match = {
                idp: 0, idc: 0, day: "", hour: "", score: "", matchDayNum: "",
                teamA: { idt: 0, logo: "", fullname: "", smallname: "" },
                teamB: { idt: 0, logo: "", fullname: "", smallname: "" }
            };
            let idp = extractProp(tag, "idp");
            match.idp = (idp == "") ? 0 : parseInt(idp);
            match.idc = campionato.id;
            try { match.campAbbr = cachedCamp.abbr; } catch (e) { }
            match.teamA.smallname = extractContentByClass(tag.content, "scorer_team_left");
            try {
                match.teamA.fullname = cachedSquadre.filter((e => (e.camp == match.idc && e.abbr == match.teamA.smallname)))[0].nome;
            } catch (e) { match.teamA.fullname = match.teamA.smallname }
            match.teamA.logo = extractProp(parseIsleTag(extractContentByClass(tag.content, "scorer_logo_left")), "src");

            match.teamB.smallname = extractContentByClass(tag.content, "scorer_team_right");
            try {
                match.teamB.fullname = cachedSquadre.filter((e => (e.camp == match.idc && e.abbr == match.teamB.smallname)))[0].nome;
            } catch (e) { match.teamB.fullname = match.teamB.smallname }
            match.teamB.logo = extractProp(parseIsleTag(extractContentByClass(tag.content, "scorer_logo_right")), "src");

            match.score = extractContentByClass(tag.content, "scorer_score");
            let dayHour = extractContentByClass(tag.content, "scorer_bot_left").split(' ');
            match.day = dayHour[0];
            match.hour = dayHour[1];
            match.type = removeTags(extractContentByClass(tag.content, "scorer_bot_center"), "span", true, false);
            match.matchDayNum = extractContentByClass(tag.content, "scorer_bot_right");

            campionato.matches.push(match);
        }

        campionati.push(campionato);
    }

    return campionati;
}

function min(a, b, escape) {
    if (a < 0 && b < 0) return escape;
    if (a < 0) return b;
    if (b < 0) return a;
    if (a > b) return b;
    return a;
}

function extractContentByClass(input, wclass) {
    let str = input.substr(input.indexOf('<div class="' + wclass + '"'));
    str = str.substr(0, str.indexOf("</div>") + 6);
    return removeTags(str, "div", true, false);
}

export function CaricaPartiteInCorso(then) {
    caricaPartite((campionati) => {
        let partite = [];
        campionati.forEach(elem => {
            partite = partite.concat(elem.matches.filter(e => ((e.type === "TEMPO 1") || (e.type === "INTERVALLO") || (e.type === "TEMPO 2"))));
        })
        then(partite);
    });
}

export function CaricaPartiteRecenti(then) {
    caricaPartite((campionati) => {
        let partite = [];
        campionati.forEach(elem => {
            partite = partite.concat(elem.matches.filter(e => (e.type === "FINALE")));
        })
        then(partite);
    });
}

export function CaricaPartiteInCorsoCampionato(idc, then) {
    caricaPartite((campionati) => {
        let campionato = campionati.filter(e => e.id === idc)[0];
        let partite = [];
        if (campionato != null) partite = campionato.matches.filter(e => ((e.type === "TEMPO 1") || (e.type === "INTERVALLO") || (e.type === "TEMPO 2")));
        then(partite);
    })
}

function fun(e, ids) {
    let fun2 = (str) => {
        let x = str.split('/');
        let y = x[x.length - 1];
        return parseInt(y.substr(0, y.indexOf('.')).replace(/_[0-9]+/, ""));
    }
    return (fun2(e.teamA.logo) == ids || fun2(e.teamB.logo) == ids);
}

export function CaricaPartiteInCorsoSocieta(ids, then) {
    caricaPartite((campionati) => {
        let partite = [];
        campionati.forEach(elem => {
            partite = partite.concat(elem.matches.filter(e => fun(e, ids) && ((e.type === "TEMPO 1") || (e.type === "INTERVALLO") || (e.type === "TEMPO 2"))));
        });
        then(partite);
    });
}

export function CaricaPartiteRecentiSocieta(ids, then) {
    caricaPartite((campionati) => {
        let partite = [];
        campionati.forEach(elem => {
            partite = partite.concat(elem.matches.filter(e => fun(e, ids) && (e.type === "FINALE")));
        });
        then(partite);
    });
}

export function CaricaPartiteFutureSocieta(ids, then) {
    caricaPartite((campionati) => {
        let partite = [];
        campionati.forEach(elem => {
            partite = partite.concat(elem.matches.filter(e => fun(e, ids) && (e.type === "NON INIZIATA")));
        });
        then(partite);
    });
}