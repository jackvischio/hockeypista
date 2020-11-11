import { polishString, removeTags, parseIsleTag, parseCompleteTag, extractProp } from './commons'
import { cacheSquadra } from '../Cache/CacheSquadra'
import $ from 'jquery'

// MAIN FUNCTION
export function CaricaCalendario(idc, then) {
    $("body").append("<div id='retrieveCalendario' style='display: none'></div>");
    $('#retrieveCalendario').load("http://www.server2.sidgad.es/fisr/fisr_cal_1_29.php", { idc: idc }, (data) => {

        data = polishString(data);
        data = data.substr(data.indexOf("<table"));
        data = data.replace("<table ", '<table id="tbl-camp-xxx" ');
        let rem = data.substr(data.indexOf("<thead"));
        rem = rem.substr(0, rem.indexOf("</thead>") + 8);
        data = data.replace(rem, "");
        data = data.replaceAll('<td width="25"></td>', '');

        $("#retrieveCalendario").html(data);
        let calendario = parseCalendario($("#tbl-camp-xxx"), idc);
        $("#retrieveCalendario").remove();

        then(calendario);
    });
}

// FILTERING FUNCTIONS
export function DueGiornate(calendario) {
    let ret = [];

    let today = new Date();
    let parseDate = (str) => {
        let a = str.split('/');
        return new Date(a[2], parseInt(a[1]) - 1, a[0]);
    }

    try {
        let last = calendario.filter((elem) => parseDate(elem.data) < today);
        let last_day = last[last.length - 1];
        ret[0] = last_day;
    } catch (e) {
        ret[0] = null;
    }

    try {
        let next_day = calendario.filter((elem) => parseDate(elem.data) >= today)[0];
        ret[1] = next_day;
    } catch (e) {
        ret[1] = null;
    }

    return ret;
}

export function CampionatoSquadra(calendario, idt) {
    let arr = [];
    $.each(calendario, i => {
        let x = calendario[i].partite.filter(elem => elem.teams.includes(idt));
        $.each(x, j => {
            arr.push(x[j]);
        });
    });
    return arr;
}

// DARK SIDE

function GIORNATA() {
    return { giornata: "", data: "", partite: [] };
}

function PARTITA() {
    return {
        idp: 0, idc: 0, day: "", hour: "", score: "", teams: "",
        teamA: { idt: 0, logo: "", fullname: "", smallname: "" },
        teamB: { idt: 0, logo: "", fullname: "", smallname: "" }
    };
}

function parseCalendario(table, idc) {
    let lastgiornata = "";
    let rows = table.find("tbody tr");
    let giornata = new GIORNATA();
    let calendario = [];

    let parseGameDate = (str) => {
        let a = str.split('');
        return a[6] + a[7] + "/" + a[4] + a[5] + "/" + a[0] + a[1] + a[2] + a[3];
    };

    $.each(rows, (i) => {

        var partita = new PARTITA();
        var cells = $(rows[i]).find("td");

        var this_giornata = removeTags($(cells[3]).html(), "span", true, false);
        if (this_giornata !== lastgiornata) {
            calendario.push(giornata);
            giornata = new GIORNATA();
            giornata.giornata = this_giornata.replace(/[Gg][Jj]/, "Giornata");
            giornata.data = parseGameDate("00000000");
        }
        lastgiornata = this_giornata;

        if (giornata.data === parseGameDate("00000000"))
            giornata.data = parseGameDate($(rows[i]).attr("gamedate"));

        // dettagli partita
        partita.idc = idc;
        partita.day = removeTags($(cells[0]).html(), "div", true, false);
        partita.hour = $(cells[1]).html();
        partita.score = $(cells[10]).html();
        // squadre
        partita.teams = $(rows[i]).attr("class").replace("team_class", "").replaceAll("team_", "").trim();
        var teams_id = partita.teams.split(" ");
        partita.teamA.idt = parseInt(teams_id[0]);
        partita.teamA.logo = extractProp(parseIsleTag($(cells[4]).html()), "src");
        var team = $(cells[5]).html();
        var team1 = team.substr(0, team.indexOf("</div>") + 6);
        partita.teamA.fullname = removeTags(team1, "div", true, false);
        partita.teamA.smallname = removeTags(team.replace(team1, ""), "div", true, false);
        partita.teamB.idt = parseInt(teams_id[1]);
        partita.teamB.logo = extractProp(parseIsleTag($(cells[6]).html()), "src");
        team = $(cells[7]).html();
        team1 = team.substr(0, team.indexOf("</div>") + 6);
        partita.teamB.fullname = removeTags(team1, "div", true, false);
        partita.teamB.smallname = removeTags(team.replace(team1, ""), "div", true, false);
        try {
            partita.idp = parseInt(extractProp(parseCompleteTag($(cells[13]).html()), "idp"));
        } catch (e) { partita.idp = undefined; }

        // caching
        cacheSquadra(partita.teamA.idt, partita.teamA.fullname, partita.teamA.logo, partita.teamA.smallname, idc);
        cacheSquadra(partita.teamB.idt, partita.teamB.fullname, partita.teamB.logo, partita.teamB.smallname, idc);

        //cacheSquadra(teams_id[0], partita.teamA.fullname, partita.teamA.logo, partita.teamA.smallname, idc);

        giornata.partite.push(partita);
    });
    calendario.push(giornata);
    calendario.splice(0, 1);
    return calendario;
}