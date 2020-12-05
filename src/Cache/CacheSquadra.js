import { getCacheArray, compress, expand } from './CacheCommons'

export function cacheSquadra(id, nome, logo, abbr, camp, camp_abb) {
    id = parseInt(id);

    let squadre = getCacheArray("ns_squadre");
    squadre = expand(squadre, "id");
    let selected = squadre[id];

    let obj = null;
    if (selected == null)
        obj = { id: parseInt(id), nome: "", logo: "", abbr: "", soc: 0, camp: 0, camp_abb: "" };
    else
        obj = selected;

    if (nome != null) { obj.nome = nome; }
    if (logo != null) {
        obj.logo = logo;
        obj.soc = extractSocietaID(obj.logo);
    }
    if (abbr != null) { obj.abbr = abbr; }
    if (camp != null) { obj.camp = parseInt(camp); }
    if (camp_abb != null) { obj.camp_abb = camp_abb; }

    squadre[id] = obj;
    squadre = compress(squadre)
    localStorage.setItem("ns_squadre", JSON.stringify(squadre));
}

function extractSocietaID(logo) {
    let x = logo.split('/');
    let y = x[x.length - 1];
    return parseInt(y.substr(0, y.indexOf('.')).replace(/_[0-9]+/, ""));
}

export function getCachedSquadre() {
    return getCacheArray("ns_squadre").filter(e => e != null);
}

export function getCachedSquadra(id) {
    return getCacheArray("ns_squadre").filter(e => e != null).filter(e => e.id == id)[0];
}

export function getCachedSquadraByName(nome, camp) {
    nome = nome.toUpperCase();
    return getCacheArray("ns_squadre").filter(e => e != null).filter(e =>
        (e.nome == nome && e.camp == camp))[0];
}