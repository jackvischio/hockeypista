import { getCacheArray } from './CacheCommons'

export function cacheCampionato(obj) {
    let camp = getCacheArray("ns_campionati");
    camp[obj.id] = obj;
    localStorage.setItem("ns_campionati", JSON.stringify(camp));
}

export function getCachedCampionati() {
    return getCacheArray("ns_campionati").filter(e => e != null);
}

export function getCachedCampionato(id) {
    return getCacheArray("ns_campionati").filter(e => e != null).filter(e => e.id == id)[0];
}