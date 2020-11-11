import { getCacheArray, compress, expand } from './CacheCommons'

export function cacheSquadra(id, nome, logo, abbr, camp) {
    id = parseInt(id);

    let squadre = getCacheArray("ns_squadre");
    squadre = expand(squadre, "id");
    let selected = squadre[id];

    let obj = null;
    if (selected == null)
        obj = { id: parseInt(id), nome: "", logo: "", abbr: "", camp: 0 };
    else
        obj = selected;

    if (nome != null) { obj.nome = nome; }
    if (logo != null) { obj.logo = logo; }
    if (abbr != null) { obj.abbr = abbr; }
    if (camp != null) { obj.camp = parseInt(camp); }

    squadre[id] = obj;
    squadre = compress(squadre)
    localStorage.setItem("ns_squadre", JSON.stringify(squadre));
}

export function getCachedSquadra(id) {
    return getCacheArray("ns_squadre").filter(e => e != null).filter(e => e.id == id)[0];
}

export function getCachedSquadraByName(nome, camp) {
    nome = nome.toUpperCase();
    return getCacheArray("ns_squadre").filter(e => e != null).filter(e =>
        (e.nome == nome && e.camp == camp))[0];
}