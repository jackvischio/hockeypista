import GeneralCache from '../Data structures/GeneralCache';

export function cacheSquadra(id, nome, logo, abbr, camp, camp_abb) {
    id = parseInt(id);

    let squadre = GeneralCache.Restore("c_squadre");
    let selected = squadre.get(id);

    // creating object
    let obj = null;
    if (selected == null)
        obj = { id: parseInt(id), nome: "", logo: "", abbr: "", soc: 0, camp: [], camp_abb: [] };
    else
        obj = selected;

    // updating values
    if (nome != null) { obj.nome = nome; }
    if (logo != null) {
        obj.logo = logo;
        obj.soc = extractSocietaID(obj.logo);
    }
    if (abbr != null) { obj.abbr = abbr; }
    if (camp != null) {
        camp = parseInt(camp);
        if (!obj.camp.includes(camp))
            obj.camp.push(camp);
    }
    if (camp_abb != null) {
        if (!obj.camp_abb.includes(camp_abb))
            obj.camp_abb.push(camp_abb);
    }

    // saving cache
    squadre.insert(id, obj);
    squadre.save("c_squadre");
}

export function extractSocietaID(logo) {
    let x = logo.split('/');
    let y = x[x.length - 1];
    return parseInt(y.substr(0, y.indexOf('.')).replace(/_[0-9]+/, ""));
}

export function getCachedSquadre() {
    return GeneralCache.GetAllFrom("c_squadre");
}

export function getCachedSquadra(id) {
    return GeneralCache.GetFrom("c_squadre", id);
}

export function getCachedSquadraByName(nome, camp) {
    nome = nome.toUpperCase();
    camp = parseInt(camp);
    let cache = GeneralCache.GetAllFrom("c_squadre");
    return cache.filter(e => e.nome == nome && e.camp.includes(camp))[0];
}