import { getObjectFromCache, Contains } from './CacheCommons'

export function CheckIfCachedMatch(id) {
    id = parseInt(id);
    let obj = getObjectFromCache("cache_partite");
    if (Contains(id, obj.array))
        return obj.array.filter(e => e.id === id)[0];
    else
        return null;
}

export function CachePartita(partita) {
    let obj = getObjectFromCache("cache_partite");
    if (!Contains(partita.id, obj.array)) {
        obj.array[obj.next] = partita;
        obj.next = ((obj.next + 1) % obj.size);
        localStorage.setItem("cache_partite", JSON.stringify(obj));
    }
}