import $ from 'jquery';
import { cacheGiocatore } from '../Cache/CacheGiocatori';
import { polishString, extractProp, parseIsleTag, parseCompleteTag, titleCase, removeTags } from './commons'

function GIOCATORE() {
    return { idpl: 0, nome: "", idgc: "", naz: "", presenze: 0, gol: 0, assist: 0, rigori: "", diretti: "", blu: 0, rossi: 0 }
}

function TECNICO() { return { nome: "", naz: "" }; }

export function CaricaSquadra(idt, idc, then) {
    $("body").append("<div id='retrieveSquadra' style='display: none'></div>");
    $('#retrieveSquadra').load('https://hockeypista-backend.herokuapp.com/http://www.server2.sidgad.es/fisr/fisr_stats_1_' + idc + '.php', {
        idc: idc,
        idq: idt,
        filter: 3,
        tipo_stats: "plantillas"
    }, (data) => {

        data = polishString(data);

        let firstTable = data.substr(0, data.indexOf("</table>") + 8);
        let secondTable = data.replace(firstTable, "");

        firstTable = firstTable.replace('<table', '<table id="tbl-sq-gioc-xxx"');
        secondTable = secondTable.replace('<table', '<table id="tbl-sq-tecn-xxx"');

        let rem = firstTable.substr(firstTable.indexOf("<thead"));
        rem = rem.substr(0, rem.indexOf("</thead>") + 8);
        firstTable = firstTable.replace(rem, "");

        rem = secondTable.substr(secondTable.indexOf("<thead"));
        rem = rem.substr(0, rem.indexOf("</thead>") + 8);
        secondTable = secondTable.replace(rem, "");

        $('#retrieveSquadra').html(firstTable + " " + secondTable);

        let giocatori = parseTableGiocatori($("#tbl-sq-gioc-xxx"), idt);
        giocatori.map(e => cacheGiocatore({ id: e.idpl, nome: e.nome }));

        let tecnici = parseTableTecnici($("#tbl-sq-tecn-xxx"), idt);

        $("#retrieveSquadra").remove();

        then(giocatori, tecnici);
    });
}

function parseTableGiocatori(table, id_team) {
    var rows = table.find("tbody tr");
    var giocatori = [];

    let parseWdef = (str, def) => { if (str === "") return def; return parseInt(str); }
    let setWdef = (str, def) => { if (str === "") return def; return str; }

    $.each(rows, i => {
        let cells = $(rows[i]).find("td");
        let gioc = new GIOCATORE();

        gioc.naz = extractProp(parseIsleTag($(cells[3]).html()), "src");
        let tag = parseCompleteTag($(cells[4]).html());
        let this_sq = extractProp(tag, "team_id").replace('"', "");
        gioc.idpl = extractProp(tag, "id_player");
        gioc.nome = titleCase(extractProp(tag, "player_name").replace(',', ''));
        gioc.gol = parseWdef($(cells[5]).html(), 0);
        gioc.presenze = parseWdef($(cells[6]).html(), 0);
        gioc.assist = parseWdef($(cells[8]).html(), 0);
        gioc.rigori = setWdef($(cells[10]).html(), "0/0");
        gioc.diretti = setWdef($(cells[12]).html(), "0/0");
        gioc.blu = parseWdef($(cells[14]).html(), 0);
        gioc.rossi = parseWdef($(cells[16]).html(), 0);

        if (this_sq === id_team) { giocatori.push(gioc); }
    });

    return giocatori;
}

function parseTableTecnici(table, id_team) {
    var rows = table.find("tbody tr");
    var tecnici = [];

    $.each(rows, i => {
        let cells = $(rows[i]).find("td");
        let tecn = new TECNICO();

        tecn.naz = extractProp(parseIsleTag($(cells[3]).html()), "src");
        tecn.nome = titleCase(removeTags($(cells[4]).html(), "span", true, false));

        let this_sq = $(rows[i]).attr("class").replace(" fila_stats_player", "").replace("teamid_", "");

        if (this_sq === id_team) { tecnici.push(tecn); }
    });

    return tecnici;
}