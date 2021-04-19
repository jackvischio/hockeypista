import ApiPartita from "../API/ApiPartita";
import { CaricaCampionati } from "./MwCampionati";

import CircularQueue from "../Data structures/CircularQueue";
import GeneralCache from "../Data structures/GeneralCache";

const title_cache = "f_tit_partite";
const data_cache = "c_partite";

export class CaricaPartita {

    static Partita(idp, forceRefresh, then, error) {
        idp = parseInt(idp);
        let cache = CircularQueue.Restore(data_cache);
        if (!forceRefresh && cache.contains(idp)) {
            then(cache.get(idp));
        }
        else {
            ApiPartita(idp, (partita) => {
                if (partita.currentTime === "FINALE") {
                    cache.add(partita);
                    cache.save(data_cache);
                }
                then(partita);
            }, error);
        }
    }

    static SalvaTitolo(partita) {
        try {
            if (partita.idp !== undefined) {
                let camp = CaricaCampionati.GetByID(partita.idc);
                let obj = {
                    id: partita.idp,
                    titolo: "" + camp.abbr + ": " + partita.teamA.smallname + " vs " + partita.teamB.smallname
                };

                GeneralCache.QuickInsert(title_cache, partita.idp, obj);
            }
        } catch (e) { }
    }

    static GetTitolo(idp) {
        return GeneralCache.GetFrom(title_cache, idp);
    }
}