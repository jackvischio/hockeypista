import { CaricaCampionati } from '../Middleware/MwCampionati';
import { getCacheArray, expand, compress } from './CacheCommons'
import { creaSocieta } from './CacheSocieta';

export function getCachedVisCamp() {
    // prendo l'array in memoria
    let camp = getCacheArray("vis_campionati");
    camp = expand(camp, "id");

    // aggiungo eventuali campionati non già presenti
    let cache = CaricaCampionati.GetCached();
    if (cache != null) {
        cache.forEach(c => {
            if (camp[c.id] === undefined) {
                camp[c.id] = { id: c.id, show: true };
            }
        });
        return camp;
    }
}

export function cacheVisCamp(arr) {
    arr = compress(arr);
    localStorage.setItem("vis_campionati", JSON.stringify(arr));
}

export function getCachedVisSocieta() {
    // prendo l'array in memoria
    let soc = getCacheArray("vis_societa");
    soc = expand(soc, "id");

    // aggiungo eventuali campionati non già presenti
    let cache = creaSocieta();
    cache.forEach(c => {
        if (soc[c.id] === undefined) {
            soc[c.id] = { id: c.id, show: true };
        }
    });
    return soc;
}

export function cacheVisSocieta(arr) {
    arr = compress(arr);
    localStorage.setItem("vis_societa", JSON.stringify(arr));
}