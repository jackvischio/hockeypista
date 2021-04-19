export default class TemporalCache {
    constructor(seconds) {
        this.array = [];
        this.expiration = seconds * 1000;
    }

    static Restore(name, seconds) {
        let x = localStorage.getItem(name);
        if (x == null)
            return new TemporalCache(seconds);
        else {
            x = JSON.parse(x);
            let queue = new TemporalCache(seconds);
            queue.restore(x.expiration, x.array);
            queue.polish();
            return queue;
        }
    }

    restore(expiration, array) {
        this.array = array;
        this.expiration = expiration;
    }

    insert(id, value) {
        let new_obj = {
            id: id,
            expiry: this.now() + this.expiration,
            obj: value
        };
        this.remove(id);
        this.array.push(new_obj);
    }

    get(id) {
        this.polish();
        let res = this.array.filter(e => (e.id == id));
        return (res.length == 1) ? res[0].obj : null;
    }

    now() { return new Date().getTime(); }

    polish() {
        let now = this.now();
        this.array = this.array.filter(e => (e.expiry > now));
    }

    remove(id) {
        this.array = this.array.filter(e => (e.id != id));
    }

    save(name) {
        this.polish();
        localStorage.setItem(name, JSON.stringify({ expiration: this.expiration, array: this.array }));
    }
}