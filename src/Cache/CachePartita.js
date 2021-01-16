import { getCachedCampionato } from './CacheCampionato';
import { compress, expand, getCacheArray, getObjectFromCache } from './CacheCommons'

export function CheckIfCachedMatch(id) {
    id = parseInt(id);
    let obj = getObjectFromCache("cache_partite");
    if (obj.contains(id))
        return obj.get(id);
    else
        return null;
}

export function CachePartita(partita) {
    let obj = getObjectFromCache("cache_partite");
    obj.add(partita);
    obj.save("cache_partite");
}

export function CacheTitoloPartita(partita) {
    if (partita.idp !== undefined) {
        let arr = getCacheArray("ns_title_partita");
        arr = expand(arr, "id");
        let camp = getCachedCampionato(partita.idc);
        arr[partita.idp] = {
            id: partita.idp,
            titolo: "" + camp.abbr + ": " + partita.teamA.smallname + " vs " + partita.teamB.smallname
        };
        arr = compress(arr);
        localStorage.setItem("ns_title_partita", JSON.stringify(arr));
    }
}

export function GetTitoloPartita(idp) {
    return getCacheArray("ns_title_partita").filter(e => e.id == idp)[0];
}