import ApiSquadra from "../API/ApiSquadra";
import GeneralCache from "../Data structures/GeneralCache";
import TemporalCache from "../Data structures/TemporalCache";

const cache_name = "c_squadra";
const cache_expiry = 3600;

const cache_gioc = "f_giocatori";

export class CaricaSquadra {
    static Squadra(idt, idc, forceRefresh, then) {
        let cache_id = parseInt("" + idc + "" + idt);
        let cache = TemporalCache.Restore(cache_name, cache_expiry);
        let cached_elem = cache.get(cache_id);

        if (!forceRefresh && cached_elem != null) {
            then(cached_elem);
        }
        else {
            ApiSquadra(idt, idc, (obj) => {
                cache.insert(cache_id, obj);
                cache.save(cache_name);

                // cache giocatori
                let gioc = GeneralCache.Restore(cache_gioc);
                obj.giocatori.map(g => { gioc.insert(g.idpl, { id: g.idpl, nome: g.nome }) });
                gioc.save(cache_gioc);
                then(obj);
            });
        }
    }

    static Giocatore(idpl) {
        return GeneralCache.GetFrom(cache_gioc, idpl);
    }
}