export default class TemporalObjCache {
    constructor(object, seconds) {
        this.obj = object;
        this.expiry = (new Date().getTime()) + seconds * 1000;
    }

    static Restore(name) {
        let x = localStorage.getItem(name);
        if (x == null)
            return new TemporalObjCache(null, 0);
        else {
            x = JSON.parse(x);
            let queue = new TemporalObjCache(null, 0);
            queue.restore(x.expiry, x.obj);
            queue.validate();
            return queue;
        }
    }

    restore(expiry, object) {
        this.obj = object;
        this.expiry = expiry;
    }

    validate() {
        if (this.expiry <= (new Date().getTime())) {
            this.obj = null;
            this.expiry = 0;
        }
    }

    insert(object, seconds) {
        this.expiry = (new Date().getTime()) + seconds * 1000;
        this.obj = object;
    }

    get() {
        this.validate();
        return this.obj;
    }

    save(name) {
        this.validate();
        localStorage.setItem(name, JSON.stringify({ expiry: this.expiry, obj: this.obj }));
    }
}