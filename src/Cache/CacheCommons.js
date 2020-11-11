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