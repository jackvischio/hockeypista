import { getObjectFromCache, Contains } from './CacheCommons'

export function CheckIfCachedTeam(id) {
    id = parseInt(id);
    let obj = getObjectFromCache("cache_giocatori");
    if (Contains(id, obj.array))
        return obj.array.filter(e => e.id === id)[0];
    else
        return null;
}

export function CacheGiocatori(team) {
    let obj = getObjectFromCache("cache_giocatori");
    if (!Contains(team.id, obj.array)) {
        obj.array[obj.next] = team;
        obj.next = ((obj.next + 1) % obj.size);
        localStorage.setItem("cache_giocatori", JSON.stringify(obj));
    }
}