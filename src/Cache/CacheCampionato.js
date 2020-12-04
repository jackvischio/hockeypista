import { getCacheArray, expand, compress } from './CacheCommons'
import { cacheSquadra } from './CacheSquadra'

export function cacheCampionato(obj) {
    let camp = getCacheArray("ns_campionati");
    camp = expand(camp, "id");
    obj.teams.forEach(team => {
        cacheSquadra(team.id, null, team.logo, team.name, obj.id);
    });
    camp[obj.id] = obj;
    camp = compress(camp);
    localStorage.setItem("ns_campionati", JSON.stringify(camp));
}

export function getCachedCampionati() {
    return getCacheArray("ns_campionati");
}

export function getCachedCampionato(id) {
    return getCacheArray("ns_campionati").filter(e => e.id === id)[0];
}

export function getCachedCampionatoByName(name) {
    return getCacheArray("ns_campionati").filter(e => e.name.toLowerCase() === name.toLowerCase())[0];
}