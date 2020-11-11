import $ from 'jquery'
import { getCacheArray } from './CacheCommons'

export function creaSocieta() {
    let squadre = getCacheArray("ns_squadre");
    let campionati = getCacheArray("ns_campionati");

    let allSquadre = [];
    $.each(campionati, (i) => {
        let sq_camp = campionati[i].teams;
        $.each(sq_camp, (j) => {
            let newsq = sq_camp[j];
            newsq.small = sq_camp[j].name;
            newsq.camp = campionati[i].id;
            newsq.camp_abbr = campionati[i].abbr;

            let cachedName = "";
            try {
                cachedName = squadre.filter(e => e.id == newsq.id)[0].nome;
                cachedName = cachedName.replace(/\ [A-Z]{1}$/, '');
            } catch (e) { }
            newsq.nome = cachedName;

            allSquadre.push(newsq);
        });
    });

    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    var societa = groupBy(allSquadre, 'logo');

    let allSocieta = []
    $.each(Object.keys(societa), i => {
        let logo = Object.keys(societa)[i];
        if (logo != "") {
            let id_club = logo.match(/\/[0-9]*(_[0-9]+)*\./g)[0];
            id_club = parseInt(id_club.match(/[0-9]+/g)[0]);
            allSocieta.push({ id: id_club, nome: "", logo: logo, squadre: societa[logo] })
        }
    });

    allSocieta = selectBestNameForProp(allSocieta, "nome", groupBy);
    allSocieta = selectBestNameForProp(allSocieta, "small", groupBy);

    localStorage.setItem("ns_societa", JSON.stringify(allSocieta));
    console.log(allSocieta);
    return allSocieta;
}

function selectBestNameForProp(allSocieta, prop, groupBy) {
    $.each(allSocieta, i => {
        let newnames = Object.keys(groupBy(allSocieta[i].squadre, prop));
        let arrnames = [];
        $.each(newnames, j => {
            if (newnames[j] != "") {
                let count = (allSocieta[i].squadre.filter(e => e[prop] == newnames[j])).length;
                arrnames.push({ name: newnames[j], count: count });
            }
        });

        let selectBestName = (arr) => {
            let best = "";
            let c = -1;
            for (let j = 0; j < arr.length; j++) {
                if (arr[j].count > c) {
                    c = arr[j].count;
                    best = arr[j].name;
                }
            }
            return best;
        }
        allSocieta[i][prop] = selectBestName(arrnames);
    });
    return allSocieta;
}

export function getSocietaByIDT(idt) {
    let cacheSocieta = creaSocieta();
    return cacheSocieta.filter(e => e.squadre.filter(s => s.id == idt).length > 0)[0];
}