export default class GeneralCache {
    constructor() {
        this.array = [];
    }

    static Restore(name) {
        let x = localStorage.getItem(name);
        if (x == null)
            return new GeneralCache();
        else {
            let array = JSON.parse(x);
            let cache = new GeneralCache();
            cache.restore(array);
            return cache;
        }
    }

    restore(arr) {
        arr.map(e => { this.insert(e.key, e.value); });
    }

    insert(key, value) {
        this.array[key] = { key: key, value: value };
    }

    remove(key) {
        this.array[key] = null;
    }

    get(key) {
        return (this.array[key] == null) ? null : this.array[key].value;
    }

    get_all() {
        return this.array.filter(e => e != null).map(e => e.value);
    }

    is_empty() {
        return (this.array.length === 0);
    }

    static GetFrom(name, key) {
        let x = localStorage.getItem(name);
        if (x == null) return null;
        else {
            let array = JSON.parse(x);
            let filt = array.filter(e => e.key == key)
            return ((filt.length == 1) ? filt[0].value : null);
        }
    }

    static GetAllFrom(name) {
        let x = localStorage.getItem(name);
        if (x == null) return null;
        else {
            let array = JSON.parse(x);
            return array.map(e => e.value);
        }
    }

    static QuickInsert(name, key, value) {
        let x = localStorage.getItem(name);
        if (x == null) {
            let cache = new GeneralCache();
            cache.insert(key, value);
            cache.save(name);
        }
        else {
            let array = JSON.parse(x);
            let done = false;
            array.map(e => {
                if (e.key === key) { e.value = value; done = true; }
            });
            if (!done) array.push({ key: key, value: value });
            localStorage.setItem(name, JSON.stringify(array));
        }
    }

    save(name) {
        let arr = this.array.filter(e => e != null);
        localStorage.setItem(name, JSON.stringify(arr));
    }
}