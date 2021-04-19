import ApiClassifica from "../API/ApiClassifica";
import TemporalCache from "../Data structures/TemporalCache";

const cache_name = "c_classifica";
const cache_expiry = 3600;

export class CaricaClassifica {
    static Campionato(idc, forceRefresh, then) {
        idc = parseInt(idc);
        let cache = TemporalCache.Restore(cache_name, cache_expiry);
        let cached_elem = cache.get(idc);

        if (!forceRefresh && cached_elem != null) {
            then(cached_elem);
        }
        else {
            // chiamata all'API & caching del risultato
            ApiClassifica(idc, (result) => {
                cache.insert(idc, result);
                cache.save(cache_name);
                then(result);
            });
        }
    }

    static Squadra(idc, abbr, forceRefresh, then) {
        this.Campionato(idc, forceRefresh, (clas) => {
            let obj = clas.filter(e => e.small.toUpperCase() == abbr.toUpperCase())[0];
            then(obj);
        })
    }
}