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