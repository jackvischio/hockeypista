import { getCacheArray } from './CacheCommons'

export function cacheSquadra(obj) {
    // need implementation
}

export function getCachedSquadra(id) {
    let squadre = getCacheArray("ns_squadre").filter(e => e != null);;
    try {
        return squadre[id];
    } catch (e) { return null; }
}

export function getCachedSquadre(id) {
    return getCacheArray("ns_squadre").filter(e => e != null);;
}