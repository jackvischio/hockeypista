import { polishString, removeTags, extractProp, parseCompleteTag, parseIsleTag } from './commons'
import $ from 'jquery'

export function caricaMarcatori(idc, then) {
    $("body").append("<div id='retrieveMarcatori' style='display: none'></div>");
    $('#retrieveMarcatori').load('http://www.server2.sidgad.es/fisr/fisr_stats_1_' + idc + '.php', { idc: idc, tipo_stats: "goles" },
        () => {
            $("#retrieveMarcatori").find(".mobile").remove();
            var data = polishString($("#retrieveMarcatori").html());
            data = data.replace("<table", '<table id="tbl-marc-xxx"');
            $("#retrieveMarcatori").html(data);

            var marcatori_loaded = parseMarcatori($("#tbl-marc-xxx"));
            $("#retrieveMarcatori").remove();

            then(marcatori_loaded);
        });
}

function parseMarcatori(table) {
    let rows = table.find("tbody tr");

    let parseWdef = (str, def) => { if (str === "") return def; return parseInt(str); }
    let setWdef = (str, def) => { if (str === "") return def; return str; }

    let marcatori = [];
    $.each(rows, (i) => {
        let gioc = { pos: 0, team: { idt: 0, logo: "", name: "" }, idpl: 0, name: "", flag: "", matches: 0, goals: 0, assists: 0, diretti: "", rigori: "", blu: 0, rossi: 0 };
        let cells = $(rows[i]).find("td");

        gioc.pos = (i + 1);
        gioc.team.name = removeTags($(cells[1]).html(), "span", true, false);
        gioc.team.logo = extractProp(parseIsleTag($(cells[2]).html()), "src");
        gioc.flag = extractProp(parseIsleTag($(cells[3]).html()), "src");
        let tag = parseCompleteTag($(cells[4]).html());
        gioc.idpl = extractProp(tag, "id_player");
        gioc.team.idt = extractProp(tag, "team_id").replace('"', '');
        gioc.name = extractProp(tag, "player_name").replace(',', '');
        gioc.goals = parseWdef($(cells[5]).html(), 0);
        gioc.matches = parseWdef($(cells[6]).html(), 0);
        gioc.assists = parseWdef($(cells[8]).html(), 0);
        gioc.rigori = setWdef($(cells[10]).html(), "0/0");
        gioc.diretti = setWdef($(cells[12]).html(), "0/0");
        gioc.blu = parseWdef($(cells[14]).html(), 0);
        gioc.rossi = parseWdef($(cells[16]).html(), 0);

        marcatori.push(gioc);
    });

    marcatori = sort(marcatori);

    return marcatori;
}

function sort(array) {
    let prep = (dir, rig) => {
        let x = 0;
        let a = dir.split("/");
        try { x += parseInt(a[0]) / parseInt(a[1]); } catch (e) { x += 0.2; }
        a = rig.split("/");
        try { x += parseInt(a[0]) / parseInt(a[1]); } catch (e) { x += 0.2; }
        return x;
    }

    let scambia = (sx, dx) => {
        if (sx.goals > dx.goals) return -1;
        else if (sx.goals < dx.goals) return 1;
        else {
            if (sx.assists > dx.assists) return -1;
            else if (sx.assists < dx.assists) return 1;
            else {
                sx = prep(sx.diretti, sx.rigori);
                dx = prep(dx.diretti, dx.rigori);

                if (sx > dx) return -1;
                else if (sx < dx) return 1;
                else return 0;
            }
        }
    };

    array = array.sort((a, b) => scambia(a, b));
    $.each(array, i => {
        array[i].pos = i + 1;
    });
    return array;
}