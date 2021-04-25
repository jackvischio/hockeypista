import ApiInCorso from "../API/ApiInCorso";
import { extractSocietaID } from "../Cache/CacheSquadra";
import TemporalObjCache from "../Data structures/TemporalObjCache";
import { CaricaPartita } from "./MwPartita";

const cache_name = "c_incorso";
const cache_expiry = 30;

// Tutte e PerSocietà restituiscono un oggetto:
// { in_corso: [], recenti: [], future: [] }

export class CaricaPartite {
    static Tutte(forceRefresh, then, err) {
        let cache = TemporalObjCache.Restore(cache_name);
        let cached = cache.get();
        if (!forceRefresh && cached != null) {
            then(cached);
        }
        else {
            ApiInCorso((partite) => {
                partite.map(p => { CaricaPartita.SalvaTitolo(p); });
                let ret = filtra(partite);
                cache = new TemporalObjCache(ret, cache_expiry);
                cache.save(cache_name);
                then(ret);
            }, err);
        }
    }

    static Recenti(forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => { then(obj.recenti); }, err);
    }

    static InCorso(forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => { then(obj.in_corso); }, err);
    }

    static Future(forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => { then(obj.future); }, err);
    }

    static OraCampionato(idc, forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => {
            let in_corso = obj.in_corso.filter(p => p.idc === idc);
            then(in_corso);
        }, err);
    }

    static OraSquadra(idt, forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => {
            let fun = (e, idt) => (e.teamA.idt === idt || e.teamB.idt === idt);
            let in_corso = obj.in_corso.filter(p => fun(p, idt));
            then(in_corso);
        }, err);
    }

    static PerSocieta(ids, forceRefresh, then, err) {
        this.Tutte(forceRefresh, (obj) => {
            let fun = (e, ids) => (extractSocietaID(e.teamA.logo) == ids || extractSocietaID(e.teamB.logo) == ids);
            obj.in_corso = obj.in_corso.filter(p => fun(p, ids));
            obj.recenti = obj.recenti.filter(p => fun(p, ids));
            obj.future = obj.future.filter(p => fun(p, ids));
            then(obj);
        }, err);
    }
}

function filtra(partite) {
    let ora = partite.filter(e => ((e.type === "TEMPO 1") || (e.type === "INTERVALLO") || (e.type === "TEMPO 2")
        || (e.type === "OVERTIME 1") || (e.type === "OVERTIME 2") || (e.type === "PENALTIS")));
    let recenti = partite.filter(e => (e.type === "FINALE"));
    let future = partite.filter(e => (e.type === "NON INIZIATA" || e.type === "SOSPESA" || e.type === "RINVIATA" || e.type === "riposa"));
    return { in_corso: ora, recenti: recenti, future: future }
}