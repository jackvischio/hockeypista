import $ from 'jquery'
import { polishString, parseCompleteTag, parseIsleTag, removeTags, extractProp, myReplaceAll, prepareURLforProxy } from './commons'
import { getCachedSquadre } from '../Cache/CacheSquadra'
import { CaricaCampionati } from '../Middleware/MwCampionati';

export default function ApiInCorso(then, err) {
    $.ajax({
        url: prepareURLforProxy("fisr_mc_1.php"),
        method: "GET",
        success: (data) => {
            data = prepareStringForParsing(data);
            let partite = parsePlaying(data);
            then(partite);
        },
        error: () => { err(); }
    });
}

function prepareStringForParsing(data) {
    // polishing the string
    data = polishString(data);
    data = data.replace(/'/g, '"');

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
    data = myReplaceAll(data, '<a href="#" ', "<div ");
    data = myReplaceAll(data, '</a>', "</div>");

    return data;
}

function parsePlaying(data) {
    let cachedCampionati = CaricaCampionati.GetCached();
    let cachedSquadre = getCachedSquadre();

    let matches = [];
    while (data.indexOf('<div class="scorer_apartado"') == 0) {
        // remove first row: campionato
        let str = data.substr(0, data.indexOf('<div class="scorer_game'));
        data = data.replace(str, "");

        // parsing matches of that campionato
        let maxLive = 0;
        while (data.indexOf('<div class="scorer_game') == 0 && maxLive < 1000) {
            maxLive++;
            data = data.substr(1);
            let current = data.substr(0, min(data.indexOf('<div class="scorer_game'), data.indexOf('<div class="scorer_apartado"'), data.length));
            data = data.replace(current, "");

            let tag = parseCompleteTag("<" + current);

            // try to get the camp from the cache
            let cachedCamp = null;
            try {
                cachedCamp = cachedCampionati.filter(c => c.name.toLowerCase() == extractContentByClass(tag.content, "scorer_liga").toLowerCase())[0];
            } catch (e) { }

            // match object
            let match = {
                idp: 0, idc: 0, day: "", hour: "", score: "", matchDayNum: "",
                teamA: { idt: 0, logo: "", fullname: "", smallname: "" },
                teamB: { idt: 0, logo: "", fullname: "", smallname: "" }
            };

            // IDP, IDC, camp abbr
            let idp = extractProp(tag, "idp");
            match.idp = (idp == "") ? 0 : parseInt(idp);
            try {
                let idc = parseInt(extractProp(tag, "idc"));
                match.idc = (!isNaN(idc)) ? parseInt(idc) : cachedCamp.id;
            } catch (e) { }
            try { match.campAbbr = cachedCamp.abbr; } catch (e) { }

            // Team A
            match.teamA.smallname = extractContentByClass(tag.content, "scorer_team_left");
            try {
                match.teamA.fullname = cachedSquadre.filter((e => (e.camp == match.idc && e.abbr == match.teamA.smallname)))[0].nome;
            } catch (e) { match.teamA.fullname = match.teamA.smallname }
            match.teamA.logo = extractProp(parseIsleTag(extractContentByClass(tag.content, "scorer_logo_left")), "src");

            // Team B
            match.teamB.smallname = extractContentByClass(tag.content, "scorer_team_right");
            try {
                match.teamB.fullname = cachedSquadre.filter((e => (e.camp == match.idc && e.abbr == match.teamB.smallname)))[0].nome;
            } catch (e) { match.teamB.fullname = match.teamB.smallname }
            match.teamB.logo = extractProp(parseIsleTag(extractContentByClass(tag.content, "scorer_logo_right")), "src");

            // date, hour, score, info
            match.score = extractContentByClass(tag.content, "scorer_score");
            let dayHour = extractContentByClass(tag.content, "scorer_bot_left").split(' ');
            match.day = dayHour[0];
            match.hour = dayHour[1];
            match.type = removeTags(extractContentByClass(tag.content, "scorer_bot_center"), "span", true, false);
            match.matchDayNum = extractContentByClass(tag.content, "scorer_bot_right");

            // add to list
            matches.push(match);
        }
    }
    return matches;
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