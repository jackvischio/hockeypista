import ApiCampionati from "../API/ApiCampionati";
import { cacheSquadra } from "../Cache/CacheSquadra";
import GeneralCache from "../Data structures/GeneralCache";
import TemporalObjCache from "../Data structures/TemporalObjCache";

const short_term_cache = "c_campionati";
const long_term_cache = "f_campionati";

export class CaricaCampionati {
    static GetAll(forceRefresh, then, error) {
        let short_cache = TemporalObjCache.Restore(short_term_cache);
        let cached = short_cache.get();
        if (!forceRefresh && cached != null) {
            then(cached);
        }
        else {
            ApiCampionati((campionati) => {

                // memorizzazione nella cache a breve termine
                short_cache.insert(campionati, 60 * 60);
                short_cache.save(short_term_cache);

                // memorizzazione nella cache a lungo termine
                let long_cache = GeneralCache.Restore(long_term_cache);
                campionati.map(camp => long_cache.insert(camp.id, camp));
                long_cache.save(long_term_cache);

                // caching del nome della squadra
                campionati.map(c => {
                    c.teams.map(team => cacheSquadra(team.id, null, team.logo, team.name, c.id, c.abbr));
                })

                then(campionati);
            }, () => { error(); });
        }
    }

    static GetCached() {
        return GeneralCache.GetAllFrom(long_term_cache);
    }

    static GetByID(idc) {
        return GeneralCache.GetFrom(long_term_cache, idc);
    }

    static GetByName(name) {
        let arr = GeneralCache.GetAllFrom(long_term_cache);
        let x = arr.filter(e => e.name.toLowerCase() === name.toLowerCase());
        return ((x.length === 1) ? x[0] : null);
    }
}