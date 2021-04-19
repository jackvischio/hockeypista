export default class CircularQueue {
    constructor(size) {
        this.size = size;
        this.next = 0;
        this.array = [];
    }

    static Restore(name) {
        let x = localStorage.getItem(name);
        if (x == null)
            return new CircularQueue(100);
        else {
            x = JSON.parse(x);
            let queue = new CircularQueue(100);
            queue.restore(x.size, x.array);
            return queue;
        }
    }

    restore(size, array) {
        this.size = size;
        this.array = array;
        this.next = array.length;
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

    get(id) {
        return this.array[this.indexOf(id)];
    }

    save(name) {
        let arr = (this.array.slice(this.next, this.size)).concat(this.array.slice(0, this.next));
        arr = arr.filter(a => (a !== null));
        localStorage.setItem(name, JSON.stringify({ size: this.size, array: arr }));
    }
}