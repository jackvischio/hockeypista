import { getCacheArray, expand, compress } from './CacheCommons'

export function cacheGiocatore(obj) {
    let camp = getCacheArray("ns_title_giocatori");
    camp = expand(camp, "id");
    camp[obj.id] = obj;
    camp = compress(camp);
    localStorage.setItem("ns_title_giocatori", JSON.stringify(camp));
}

export function getCachedGiocatore(id) {
    return getCacheArray("ns_title_giocatori").filter(e => e.id == id)[0];
}