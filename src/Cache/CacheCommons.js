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

export function getObjectFromCache(name) {
    let ok = false;
    let obj = {};
    do {
        try {
            let x = localStorage.getItem(name);
            if (x == null) { throw new Error(); }
            obj = JSON.parse(x);
            ok = true;
        }
        catch (e) { localStorage.setItem(name, JSON.stringify({ size: 100, next: 0, array: [] })); }
    } while (!ok);
    return obj;
}

export function Contains(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id)
            return true;
    }
    return false;
}