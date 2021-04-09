import { polishString, titleCase, removeTags, extractProp, parseIsleTag, parseCompleteTag, parseTable } from './commons'
import $ from 'jquery'
import { getCachedCampionatoByName } from '../Cache/CacheCampionato';
import { getCachedSquadraByName } from '../Cache/CacheSquadra';
import { CachePartita, CheckIfCachedMatch } from '../Cache/CachePartita';

function PARTITA() {
    return {
        id: 0,
        referees: {
            ref1: "",
            ref2: "",
            aus: ""
        },
        teamA: new SQUADRA(),
        teamB: new SQUADRA(),
        campionato: {
            idc: 0,
            girone: "",
            nome: "",
            tempo: 25
        },
        girone: "",
        date: { day: "", hour: "" },
        place: "",
        goalsA: 0,
        goalsB: 0,
        falliA: 0,
        falliB: 0,
        currentTime: "",
        playing: true,
        actions: []
    }
}

function SQUADRA() {
    return {
        idt: 0,
        nome: "",
        logo: "",
        small: "",
        giocatori: [],
        tecnici: []
    }
}

function AZIONE() {
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
    };
}

export function CaricaPartita(idp, forceRefresh, then, error) {
    let cache = CheckIfCachedMatch(idp);
    if (!forceRefresh && cache !== null) {
        // partita memorizzata in cache
        //console.log("found in cache");
        //console.log(cache);
        then(cache);
    }
    else {
        // partita non già memorizzata
        fetch("https://hockeypista-backend.herokuapp.com/http://www.server2.sidgad.es/fisr/fisr_gr_" + idp + "_1.php").then((res) => {
            return res.text();
        }).then(data => {
            let partita = parsePartita(data);
            partita.id = parseInt(idp);
            //console.log(partita);

            // se possibile (= partita finita), la memorizzo in cache
            if (partita.currentTime === "FINALE") CachePartita(partita);

            // restituisco il controllo al componente
            then(partita);
        }).catch(() => { error(); });
    }
}

export function parsePartita(data) {
    // pulizia iniziale
    data = polishString(data);
    data = data.replace(/https:\/\/www.sidgad.com\/fisr\/images\/logo_print.gif/g, "");

    // Oggetto finale
    let partita = new PARTITA();

    // First table => luogo, # giornata, data, campionato
    data = data.substr(data.indexOf("<table"));
    let firstTable = data.substr(0, data.indexOf("</table>") + 8);
    data = data.replace(firstTable, "");
    firstTable = firstTable.replace("<table", '<table id="tbl-head-1"');

    // Second table => squadre A e B, falli e gol A & B, tempo di gioco, loghi squadre A & B
    let secondTable = data.substr(0, data.indexOf("</table>") + 8);
    data = data.replace(secondTable, "");
    secondTable = secondTable.replace("<table", '<table id="tbl-head-2"');

    // Third table => eliminare (arbitri)
    let thirdTable = data.substr(0, data.indexOf("</table>") + 8);
    data = data.replace(thirdTable, "");

    // Inserimento dei dati delle tabelle nell'oggetto partita
    $("body").append("<div id='retrieveMatch' style='display: none'></div>");
    $("#retrieveMatch").html(firstTable + " " + secondTable);
    partita = inserisciDati1(partita, $("#retrieveMatch"));
    $("#retrieveMatch").remove();

    // azioni del gioco
    let actionStr = data.substr(data.indexOf('<div id="game_report_inicidencias"'));
    actionStr = actionStr.substr(actionStr.indexOf("<table"));
    actionStr = actionStr.substr(0, actionStr.indexOf("</table>") + 8);
    let actionTable = parseTable(polishString(actionStr));
    partita.actions = actionTable.rows.map(parseAzione);

    // recupera il nome abbreviato e l'id delle squadre
    try {
        let actA = partita.actions.filter(ac => ac.team.name.toLowerCase() === partita.teamA.nome.toLowerCase());
        let actB = partita.actions.filter(ac => ac.team.name.toLowerCase() === partita.teamB.nome.toLowerCase());
        let teamA = getCachedSquadraByName(partita.teamA.nome, partita.campionato.idc);
        let teamB = getCachedSquadraByName(partita.teamB.nome, partita.campionato.idc);
        partita.teamA.idt = teamA.id;
        partita.teamB.idt = teamB.id;
        partita.teamA.small = actA[0].team.small;
        partita.teamB.small = actB[0].team.small;
    } catch (e) { }

    // tabelle dei giocatori
    $("body").append("<div id='contTeam' style='display: none'></div>");
    {
        let tableTeam = data.substr(data.indexOf('<table width="100%" class="competiciones_tabla_basic">'));
        tableTeam = tableTeam.substr(0, tableTeam.indexOf("</table>"));
        data = data.replace(tableTeam, "");
        tableTeam = polishString(tableTeam);
        tableTeam = tableTeam.replace("<table ", "<table id='tableTeam' class='table table-striped table-bordered' ");
        $("#contTeam").html(tableTeam);
        formatTeamTable($("#tableTeam"));
    }
    let ret = parseTeamTable($("#tableTeam"));
    partita.teamA.giocatori = ret[0];
    partita.teamA.tecnici = ret[1];
    {
        let tableTeam = data.substr(data.indexOf('<table width="100%" class="competiciones_tabla_basic">'));
        tableTeam = tableTeam.substr(0, tableTeam.indexOf("</table>"));
        data = data.replace(tableTeam, "");
        tableTeam = polishString(tableTeam);
        tableTeam = tableTeam.replace("<table ", "<table id='tableTeam' class='table table-striped table-bordered' ");
        $("#contTeam").html(tableTeam);
        formatTeamTable($("#tableTeam"));
    }
    ret = parseTeamTable($("#tableTeam"));
    partita.teamB.giocatori = ret[0];
    partita.teamB.tecnici = ret[1];

    // arbitri
    let tableReport = data.substr(data.indexOf('<div id="div_acta"'));
    $("body").append("<div id='retrieveReferees' class='d-none'></div>");
    $("#retrieveReferees").html(tableReport);
    partita = retrieveReferees(partita, $("#retrieveReferees"));
    $("#retrieveReferees").remove();

    return partita;
}

function inserisciDati1(match, tables) {
    let rows = tables.find("table tbody tr");
    let cells1 = $(rows[0]).find("td");
    let cells2 = $(rows[1]).find("td");

    match.place = titleCase($(cells1[1]).html()).trim();

    let matchStr = titleCase($(cells1[0]).html()).trim();
    let matchComp = matchStr.split('-').map(elem => elem.trim());
    match.date.hour = matchComp[matchComp.length - 1];
    let supp = (matchComp[matchComp.length - 2].split(' '));
    match.date.day = supp[supp.length - 1];
    let fullCamp = matchComp.slice(0, matchComp.length - 2).join(' - ').replace(/[0-9]{4}\/[0-9]{4}/g, "").trim();
    console.log(fullCamp)
    try {
        let cachedCamp = getCachedCampionatoByName(fullCamp);
        match.campionato.idc = cachedCamp.id;
        match.campionato.abbr = cachedCamp.abbr;
        match.campionato.tempo = cachedCamp.dur_tempo;
    } catch (e) { }
    if (fullCamp.indexOf(' - ') !== -1) {
        match.campionato.nome = fullCamp.substr(0, fullCamp.indexOf(' - '));
        match.campionato.girone = fullCamp.substr(fullCamp.indexOf(' - ') + 3);
    }
    else {
        match.campionato.nome = fullCamp;
    }

    try {
        match.teamA.nome = titleCase(removeTags($(cells2[0]).html(), "div", true, false));
        match.teamA.logo = extractProp(parseIsleTag(removeTags($(cells2[1]).html(), "div", true, false)), "src");
        match.teamB.nome = titleCase(removeTags($(cells2[6]).html(), "div", true, false));
        match.teamB.logo = extractProp(parseIsleTag(removeTags($(cells2[5]).html(), "div", true, false)), "src");
    } catch (e) { }

    let scoreStr = $(cells2[3]).html();
    let div1 = scoreStr.substr(0, scoreStr.indexOf("</div>") + 6);
    scoreStr = scoreStr.replace(div1, "");
    let div2 = scoreStr.substr(0, scoreStr.indexOf("</div>") + 6);
    let div3 = scoreStr.replace(div2, "");
    match.currentTimestamp = removeTags(div3, "div", true, false);
    let scores = parseCompleteTag(div1).content.split("-").map(elem => removeTags(elem, "span", true, false));
    match.goalsA = parseInt(scores[0]);
    match.goalsB = parseInt(scores[1]);
    match.currentTime = removeTags(removeTags(removeTags(parseCompleteTag(div2).content, "span", false, true), "span", false, true), "span", true, false);
    match.playing = !(match.currentTime === "FINALE");

    match.falliA = parseInt(removeTags($(cells2[2]).html(), "div", true, false));
    match.falliB = parseInt(removeTags($(cells2[4]).html(), "div", true, false));

    return match;
}

function parseAzione(row) {

    let lookForPlayer = (str, numb) => {
        str = removeTags(str, "span", true, false);
        let tag = parseCompleteTag(str);
        numb = removeTags(numb, "[^<>]*", true, false);
        return {
            name: tag.content, number: parseInt(numb),
            id: parseInt(tag.props.filter(elem => (elem.name === "id_player" || elem.name === "id"))[0].value)
        };
    };
    let lookForPlayerRecursive = (str, numb) => {
        str = str.substr(str.indexOf("</a>") + 4);
        str = str.substr(str.indexOf("<a"));
        str = str.substr(0, str.indexOf("</a>") + 4);
        return lookForPlayer(str, numb);
    };

    let azione = new AZIONE();

    try {

        // period and time of the action
        let cell = row.cells[0].content;
        let cell1 = cell.substr(0, cell.indexOf("</div>") + 6);
        let cell2 = cell.replace(cell1, "");
        azione.period = removeTags(cell1, "div", true, false);
        azione.time = removeTags(cell2, "div", true, false);

        // team
        cell = row.cells[1].content;
        cell1 = cell.substr(0, cell.indexOf("<div"));
        cell2 = cell.replace(cell1, "");
        azione.team.logo = parseIsleTag(cell1).props[0].value;
        azione.team.small = removeTags(cell2, "div", true, false);

        // azione
        cell = row.cells[7].content;
        cell1 = cell.substr(0, cell.indexOf("</div>") + 6);     // action -> also retrieve the full name of the team
        cell2 = cell.replace(cell1, "");                        // other info
        // based on action, I look for other params
        if (cell1.includes("TIMEOUT")) {
            azione.action = "timeout";
        }
        else if (cell1.includes("AMMONIZIONE VERBALE")) {
            azione.action = "ammonizione";
            azione.player = lookForPlayer(cell2, row.cells[6].content);
        }
        else if (cell1.includes("CARTELLINO BLU")) {
            azione.action = "blu";
            azione.player = lookForPlayer(cell2, row.cells[6].content);
        }
        else if (cell1.includes("CARTELLINO ROSSO")) {
            azione.action = "rosso";
            azione.player = lookForPlayer(cell2, row.cells[6].content);
        }
        else if (cell1.includes("GOL")) {
            azione.action = "gol";
            azione.player = lookForPlayer(cell2, row.cells[6].content);
            azione.action_supp = removeTags(row.cells[3].content, "div", true, false);
        }
        else if (cell1.includes("FALLI")) {
            azione.action = "fallo";
            azione.player = lookForPlayer(cell2, row.cells[6].content);
            azione.action_supp = removeTags(row.cells[3].content, "div", true, false);
        }
        else if (cell1.includes("TIRO DIRETTO")) {
            azione.action = "diretto";
            azione.player = lookForPlayerRecursive(cell2, row.cells[6].content);
        }
        else if (cell1.includes("RIGORE")) {
            azione.action = "rigore";
            azione.player = lookForPlayerRecursive(cell2, row.cells[6].content);
        }
        azione.team.name = removeTags(removeTags(removeTags(cell1, "span", true, true), "strong", true, true), "div", true, false);

    } catch (e) { console.log(e) }

    return azione;
}

function formatTeamTable(table) {
    // removing first row (name of the team)
    let primaRiga = table.find("thead tr")[0];
    let nomeSquadra = $(primaRiga).find("td div").html();
    primaRiga.remove();

    // modifying thead values
    $(table.find("thead tr th")[0]).html("N°").addClass("col1");
    $(table.find("thead tr th")[1]).html("R").addClass("col2");
    $(table.find("thead tr th")[3]).html("5 I").addClass("col3");
    $(table.find("thead tr th")[4]).html("Nome").removeAttr("style colspan").addClass("col4");
    $(table.find("thead tr th")[5]).html("Gol").removeAttr("width").addClass("col5");
    $(table.find("thead tr th")[11]).html("<i class='fas fa-square' style='color: blue'></i>").removeAttr("width").addClass("col6");
    $(table.find("thead tr th")[12]).html("<i class='fas fa-square' style='color: red'></i>").removeAttr("width").addClass("col7");

    let theads = table.find("thead")
    $.each(theads, (el) => {
        $(theads[el]).addClass("thead-light");
    })

    // remove some columns
    let removeColumn = (table, numCol, remHead) => {
        if (remHead) { table.find("thead tr th")[numCol].remove(); }
        let rows = table.find("tbody tr");
        let i = 0;
        while (!($(rows[i]).html().includes('colspan="6"'))) {
            $(rows[i]).find("td")[numCol].remove();
            i++;
        }
    }

    // remove columns from players' table
    removeColumn(table, 2, true);
    removeColumn(table, 3, false);
    removeColumn(table, 5, true);
    removeColumn(table, 5, true);
    removeColumn(table, 5, true);
    removeColumn(table, 5, true);
    removeColumn(table, 5, true);

    // formatting players' rows
    let i = 0;
    let rows = table.find("tbody tr");
    while (!($(rows[i]).html().includes('colspan="6"'))) {
        let cells = $(rows[i]).find("td");

        // number
        $(cells[0]).removeAttr("align width").addClass("col1");

        // role
        let cell = $(cells[1]);
        cell.removeAttr("align width class").addClass("col2");
        let str = removeTags(cell.html(), "div", true, false);
        cell.html("<span>" + str + "</span>");

        // initial 5
        $(cells[2]).removeAttr("align width class").addClass("col3");
        $(cells[2]).html(($(cells[2]).html() !== "") ? '<span class="fa fa fa-circle" style="color:#18B; font-size: 0.8em;" aria-hidden="true"></span>' : "");

        // name
        cell = $(cells[3]);
        cell.removeAttr("style").addClass("col4");
        str = removeTags(polishString(cell.html()), "span", true, false);
        str = str.substr(0, str.indexOf("</div>") + 6);
        let tag = parseCompleteTag(str);
        // id = tag.props.filter(elem => elem.name == "id")[0].value;
        cell.html(titleCase(tag.content));

        // gol, blu, rossi
        $(cells[4]).removeClass("stats_table").addClass("col5").removeAttr("id");
        $(cells[5]).removeClass("stats_table").addClass("col6");
        $(cells[6]).removeClass("stats_table").addClass("col7");

        i++;
    }

    // replacing separing line
    $(rows[i]).remove();

    // edit dirigenti
    i++;
    while (rows[i] != null) {
        let cells = $(rows[i]).find("td");

        $(cells[0]).attr("colspan", "1").removeClass("stats_table").addClass("col1");

        let cell = $(cells[1]);
        cell.removeAttr("align class").addClass("col2");
        let str = removeTags(cell.html(), "div", true, false);
        cell.html("<span>" + str + "</span>");

        $(cells[2]).removeAttr("align width class style").addClass("col3").html("");

        cell = $(cells[3]);
        cell.removeAttr("style").addClass("col4").attr("colspan", "2");
        cell.html(titleCase(removeTags(polishString(cell.html()), "span", true, false)));

        $(cells[4]).removeClass("stats_table").addClass("col5")
        $(cells[5]).removeClass("stats_table").addClass("col6");
        $(cells[6]).removeClass("stats_table").addClass("col7");

        i++;
    }

    // edit technicians' label row
    $($(table.find("thead")[1]).find("th")[0]).attr("colspan", "7").removeAttr("style").html("Ruoli tecnici");

    return nomeSquadra;
}

function parseTeamTable(table) {
    let tbodies = table.find("tbody");

    let getContent = (row) => $(row).html();

    // Giocatori
    let rows_gioc = $(tbodies[0]).find("tr");
    let giocatori = [];
    $.each(rows_gioc, (i) => {
        let cells = $(rows_gioc[i]).find("td");
        giocatori.push({
            num: getContent(cells[0]),
            ruolo: removeTags(getContent(cells[1]), "span", true, false),
            i5: (getContent(cells[2]) !== ""),
            nome: getContent(cells[3]),
            gol: getContent(cells[4]),
            blu: getContent(cells[5]),
            rossi: getContent(cells[6])
        })
    })

    // Tecnici
    let rows_tecn = $(tbodies[1]).find("tr");
    let tecnici = [];
    $.each(rows_tecn, (i) => {
        let cells = $(rows_tecn[i]).find("td");
        tecnici.push({
            ruolo: removeTags(getContent(cells[1]), "span", true, false),
            nome: getContent(cells[3]),
            blu: getContent(cells[4]),
            rossi: getContent(cells[5])
        })
    })

    return [giocatori, tecnici];
}

function retrieveReferees(match, elem) {
    let table = elem.find("table")[0];
    let rows = $(table).find("tr");

    match.referees.ref1 = titleCase($($(rows[4]).find("td")[1]).html()).replace(',', '').trim();
    match.referees.ref2 = titleCase($($(rows[4]).find("td")[3]).html()).replace(',', '').trim();
    match.referees.aus = titleCase($($(rows[5]).find("td")[1]).html()).replace(',', '').trim();

    return match;
}