import { getCacheArray } from './CacheCommons'

export function IsSaved(path) {
    let salvati = getCacheArray("ns_salvati");
    let salva = salvati.filter(e => e == path);
    if (salva.length > 0)
        return true;
    else
        return false;
}

export function Salva(path) {
    if (!IsSaved(path)) {
        let salvati = getCacheArray("ns_salvati");
        salvati.push(path);
        localStorage.setItem("ns_salvati", JSON.stringify(salvati));
    }
}

export function DisSalva(path) {
    if (IsSaved(path)) {
        let salvati = getCacheArray("ns_salvati");
        salvati = salvati.filter(e => e != path);
        localStorage.setItem("ns_salvati", JSON.stringify(salvati));
    }
}