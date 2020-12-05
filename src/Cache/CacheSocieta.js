import $ from 'jquery'
import { getCacheArray } from './CacheCommons'

export function creaSocieta() {
    let squadre = getCacheArray("ns_squadre");

    let ids = groupBy(squadre, "soc");
    let societa = [];
    Object.keys(ids).forEach(id => {
        id = parseInt(id);
        let soc = { id: id, nome: "", logo: "", small: "", squadre: [] };

        // recupero le squadre della società
        soc.squadre = squadre.filter(e => e.soc === id);

        // recupero il valore migliore per le varie proprietà dalle squadre
        soc.nome = selectBestValue(soc.squadre, "nome");
        soc.small = selectBestValue(soc.squadre, "abbr");
        soc.logo = selectBestValue(soc.squadre, "logo");

        societa.push(soc);
    });
    societa = societa.filter(s => s.small !== "").sort((a, b) => (a.small > b.small) ? 1 : -1).map(s => {
        if (s.nome == "") s.nome = s.small;
        return s;
    });
    localStorage.setItem("ns_societa", JSON.stringify(squadre));
    return societa;
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function selectBestValue(squadre, prop) {
    let values = groupBy(squadre, prop);
    let names = [{ key: "", count: 0 }];
    Object.keys(values).forEach(val => {
        if (val != "") {
            names.push({ key: val, count: squadre.filter(s => s[prop] === val).length });
        }
    });
    names = names.sort((a, b) => (a.count > b.count) ? -1 : 1);
    return names[0].key;
}

export function getSocieta(ids) {
    let cacheSocieta = creaSocieta();
    return cacheSocieta.filter(e => e.id == ids)[0];
}

export function getSocietaByIDT(idt) {
    let cacheSocieta = creaSocieta();
    return cacheSocieta.filter(e => e.squadre.filter(s => s.id == idt).length > 0)[0];
}