import ApiMarcatori from "../API/ApiMarcatori";
import TemporalCache from "../Data structures/TemporalCache";

const cache_name = "c_marcatori";
const cache_expiry = 3600;

export class CaricaMarcatori {
    static Campionato(idc, forceRefresh, then) {
        idc = parseInt(idc);
        let cache = TemporalCache.Restore(cache_name, cache_expiry);
        let cached = cache.get(idc);
        if (!forceRefresh && cached != null) {
            then(cached);
        }
        else {
            ApiMarcatori(idc, (lista) => {
                cache.insert(idc, lista);
                cache.save(cache_name);
                then(lista);
            });
        }
    }

    static Squadra(idc, idt, forceRefresh, then) {
        idt = parseInt(idt);
        this.Campionato(idc, forceRefresh, (lista) => {
            lista = lista.filter(e => e.team.idt == idt);
            then(lista);
        })
    }
}