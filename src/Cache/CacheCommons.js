export function getCacheArray(name) {
    let ok = false;
    let arr = [];
    do {
        try {
            let x = localStorage.getItem(name);
            if (x == null) { throw new Error(); }
            arr = JSON.parse(x);
            ok = true;
        }
        catch (e) { localStorage.setItem(name, JSON.stringify([])); }
    } while (!ok);
    return arr;
}

export function expand(arr, label) {
    let ret = [];
    arr.forEach(element => {
        ret[element[label]] = element;
    });
    return ret;
}

export function compress(arr) {
    return arr.filter(e => e != null);
}

// for caching objects

class CircularQueue {
    constructor(size) {
        this.size = size;
        this.next = 0;
        this.array = [];
    }

    indexOf(id) {
        let i = 0;
        for (i = 0; i < this.array.length; i++)
            if (this.array[i].id === id)
                return i
        return -1;
    }

    contains(id) { return (this.indexOf(id) !== -1); }

    add(obj) {
        if (this.contains(obj.id)) {
            let arr = (this.array.slice(this.next, this.size)).concat(this.array.slice(0, this.next));
            arr = arr.filter(a => (a !== null && a.id !== obj.id));
            arr.push(obj);
            this.array = arr;
            this.next = ((arr.length) % this.size);
        }
        else {
            this.array[this.next] = obj;
            this.next = ((this.next + 1) % this.size);
        }
    }

    remove(id) {

    }

    get(id) {
        return this.array[this.indexOf(id)];
    }

    save(name) {
        let arr = (this.array.slice(this.next, this.size)).concat(this.array.slice(0, this.next));
        arr = arr.filter(a => (a !== null));
        localStorage.setItem(name, JSON.stringify({ size: this.size, array: arr }));
    }
}

export function getObjectFromCache(name) {
    let ok = false;
    let i = 0;
    let obj = {};
    do {
        try {
            let x = localStorage.getItem(name);
            if (x == null) { throw new Error(); }
            obj = JSON.parse(x);
            //let inutile = obj.contains(1);
            ok = true;
        }
        catch (e) { localStorage.setItem(name, JSON.stringify(new CircularQueue(100))); }
    } while (!ok && i < 10);

    let f = new CircularQueue(obj.size);
    obj.array.forEach(e => {
        try {
            f.add(e);
        } catch (x) { }
    });
    return f;
}