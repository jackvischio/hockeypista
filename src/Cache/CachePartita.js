import { getObjectFromCache, CircularQueue } from './CacheCommons'

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