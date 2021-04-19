import { polishString, parseCompleteTag, parseIsleTag, prepareURLforProxy } from './commons'
import $ from 'jquery'

export default function ApiClassifica(idc, then) {
    $("body").append("<div id='retrieveClassifica' style='display: none'></div>");
    $('#retrieveClassifica').load(prepareURLforProxy("fisr_clasif_29_1.php"), { idc: idc }, (data) => {
        data = polishString(data);
        data = data.substr(data.indexOf("<table"));
        data = data.replace("<table ", '<table id="tbl-class-xxx" ');
        let rem = data.substr(data.indexOf("<thead>"));
        rem = rem.substr(0, rem.indexOf("</thead>"));
        data = data.replace(rem, "");

        $("#retrieveClassifica").html(data);
        let classifica = parseClassifica($("#tbl-class-xxx"), idc);
        $("#retrieveClassifica").remove();

        then(classifica);
    });
}

function parseClassifica(table, idc) {
    let rows = table.find("tbody tr");
    let classifica = [];
    $.each(rows, (i) => {
        let newobj = { pos: 0, logo: "", nome: "", small: "", punti: 0, gte: 0, vte: 0, pte: 0, pse: 0, rft: 0, rst: 0, diff: 0, pen: 0 };
        let cells = $(rows[i]).find("td");

        newobj.logo = parseIsleTag(parseCompleteTag($(cells[1]).html()).content).props.filter(elem => elem.name === "src")[0].value;
        let x = parseCompleteTag(($(cells[2]).html())).content;
        newobj.nome = x.substr(0, x.indexOf("</div>"));
        newobj.small = x.substr(x.indexOf("\">") + 2);

        let check = (val) => (val === "") ? 0 : parseInt(val);

        // crea una funzione check(val) return (val=="") ? 0 : parseInt(val); } e sostituiscila qua, che credo che y faccia casino
        newobj.pos = (i + 1);
        newobj.punti = check($(cells[3]).html());
        newobj.gte = check(parseCompleteTag($(cells[4]).html()).content);
        newobj.vte = check(parseCompleteTag($(cells[5]).html()).content);
        newobj.pte = check(parseCompleteTag($(cells[6]).html()).content);
        newobj.pse = check(parseCompleteTag($(cells[7]).html()).content);
        newobj.rft = check(parseCompleteTag($(cells[8]).html()).content);
        newobj.rst = check(parseCompleteTag($(cells[9]).html()).content);
        newobj.diff = check(parseCompleteTag($(cells[10]).html()).content);
        newobj.pen = check(parseCompleteTag($(cells[11]).html()).content);
        newobj.camp = idc;

        classifica.push(newobj);
    });

    return classifica;
}