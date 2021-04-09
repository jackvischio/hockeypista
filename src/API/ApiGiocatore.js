import $ from 'jquery'
import { getCachedCampionatoByName } from '../Cache/CacheCampionato';
import { getSocieta } from '../Cache/CacheSocieta';
import { extractSocietaID } from '../Cache/CacheSquadra';
import { extractProp, parseCompleteTag, parseIsleTag, polishString, removeComments, removeTags } from './commons';

function GIOCATORE() {
    return {
        nome: "", foto: "", id: 0,
        nazione: { img: "", testo: "" },
        data_nascita: "", eta: 0,
        societa: { nome: "", logo: "", ids: 0 },
        campionati: []
    }
}

function CAMPIONATO() {
    return {
        nome: "",
        id: 0,
        partite: []
    }
}

export function CaricaDettagliGiocatore(idpl, idc, idt, stagione, then) {
    $("body").append("<div id='retrieveSquadra" + stagione + "' style='display: none'></div>");
    $.ajax({
        method: "POST",
        url: "https://hockeypista-backend.herokuapp.com/http://www.server2.sidgad.es/fisr/fisr_profileseason_1_" + stagione + ".php",
        data: { idm: 1, idc: idc, id_player: idpl, team_id: idt },
        success: (data) => {

            // return object
            var giocatore = new GIOCATORE();
            var container = $("#retrieveSquadra" + stagione);

            // polish string
            data = removeComments(polishString(data));

            // retrieve 3 components
            var primo = data.substr(0, data.indexOf('<div class="header_player_profile_name">'));
            data = data.replace(primo, "");
            var secondo = data.substr(0, data.indexOf('<table class="tabla_basic">'));
            var terzo = data.replace(secondo, "");

            // from second component -> nome cognome
            giocatore.nome = removeTags(removeTags(secondo, "span", true, false), "div", true, false);

            // from first component
            primo = primo.replace(primo.substr(0, primo.indexOf('<div class="player_profile_picture"')), "");
            var blocco1 = primo.substr(0, primo.indexOf('<div class="player_profile_data_right"'));
            primo = primo.replace(blocco1, "");

            // player photo
            var supp = extractProp(parseCompleteTag(blocco1), "style");
            supp = supp.substr(supp.indexOf('(') + 1);
            giocatore.foto = supp.substr(0, supp.indexOf(')'));

            // informazioni del giocatore
            container.html(primo);
            var divs = container.find("div");
            giocatore.id = idpl;
            try {
                giocatore.nazione.img = extractProp(parseIsleTag($(divs[5]).html()), "src");
                giocatore.nazione.testo = $(divs[6]).html().trim().toLowerCase();
            } catch (e) { }
            try {
                giocatore.data_nascita = $(divs[7]).html().trim();
                giocatore.eta = parseInt($(divs[8]).html().trim());
            } catch (e) { }

            // società
            try {
                giocatore.societa.logo = extractProp(parseIsleTag($(divs[12]).html()), "src");
                let soc = getSocieta(parseInt(extractSocietaID(giocatore.societa.logo)))
                giocatore.societa.nome = soc.nome;
                giocatore.societa.ids = parseInt(soc.id);
            } catch (e) {
                try {
                    giocatore.societa.nome = $(divs[13]).html().trim();
                } catch (e) {
                    giocatore.societa.nome = "not found";
                }
            }

            // PARTITE DEI CAMPIONATI
            container.html(terzo);
            var head = container.find("thead");
            var body = container.find("tbody");

            var def = (value, defa) => {
                value = value.trim();
                if (value === "") return defa;
                return value;
            };

            for (var i = 0; i < body.length; i++) {
                var camp = CAMPIONATO();
                try {
                    camp.nome = removeTags(removeTags(removeTags($(head[2 * i]).html(), "div", true, false), "th", true, false), "tr", true, false);
                    camp.id = getCachedCampionatoByName(camp.nome).id;
                } catch (e) { }

                var righe = $(body[i]).find("tr");
                for (var j = 1; j < righe.length; j++) {
                    var celle = $(righe[j]).find("td");
                    var partita = { squadraA: "", squadraB: "", data: "", risultato: "", goal: 0, assist: 0, blu: 0, rossi: 0, diretti: "", rigori: "" };

                    partita.data = $(celle[0]).html();
                    partita.squadraA = removeTags($(celle[1]).html(), "span", true, false);
                    partita.risultato = $(celle[2]).html().replace(":", " - ");
                    partita.squadraB = removeTags($(celle[3]).html(), "span", true, false);
                    partita.goal = def($(celle[4]).html(), 0);
                    partita.assist = def($(celle[5]).html(), 0);
                    partita.rigori = def($(celle[6]).html(), "0/0");
                    partita.diretti = def($(celle[7]).html(), "0/0");
                    partita.blu = def($(celle[8]).html(), 0);
                    partita.rossi = def($(celle[9]).html(), 0);

                    camp.partite.push(partita);
                }
                giocatore.campionati.push(camp);
            }

            container.remove();
            then(giocatore);
        }
    })
}