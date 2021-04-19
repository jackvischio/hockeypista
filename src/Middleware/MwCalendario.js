import ApiCalendario from "../API/ApiCalendario";
import TemporalCache from "../Data structures/TemporalCache";
import $ from 'jquery'
import { CaricaPartita } from "./MwPartita";

const cache_name = "c_calendario";
const cache_expiry = 3600;

export class CaricaCalendario {
    static Campionato(idc, forceRefresh, then) {
        idc = parseInt(idc);
        let cache = TemporalCache.Restore(cache_name, cache_expiry);
        let cached_elem = cache.get(idc);

        if (!forceRefresh && cached_elem != null) {
            console.log("found in cache");
            then(cached_elem);
        }
        else {
            // chiamata all'API & caching del risultato
            ApiCalendario(idc, (calendario) => {
                cache.insert(idc, calendario);
                cache.save(cache_name);

                calendario.map(giornata => { giornata.partite.map(p => { CaricaPartita.SalvaTitolo(p); }) });
                then(calendario);
            });
        }
    }

    static DueGiornate(idc, forceRefresh, then) {
        this.Campionato(idc, forceRefresh, (calendario) => {
            let ret = [];

            // data di oggi
            let today = new Date();
            let parseDate = (str) => {
                let a = str.split('/');
                return new Date(a[2], parseInt(a[1]) - 1, a[0]);
            }

            // giornata scorsa
            try {
                let last = calendario.filter((elem) => parseDate(elem.data) < today);
                let last_day = last[last.length - 1];
                ret[0] = last_day;
            } catch (e) {
                ret[0] = null;
            }

            // prossima giornata
            try {
                let next_day = calendario.filter((elem) => parseDate(elem.data) >= today)[0];
                ret[1] = next_day;
            } catch (e) {
                ret[1] = null;
            }

            then(ret);
        });
    }

    static Squadra(idc, idt, forceRefresh, then) {
        this.Campionato(idc, forceRefresh, (calendario) => {
            let ret = [];
            $.each(calendario, i => {
                let x = calendario[i].partite.filter(elem => elem.teams.includes(idt));
                $.each(x, j => {
                    ret.push(x[j]);
                });
            });
            then(ret);
        })
    }
}