export default class Subscriber {
    constructor(isState = true) {
        this.nextId = 0;
        this.subscribtions = {};
        this.last = undefined;
        this.isState = isState;
    }

    subscribe(callback) {
        console.log("subscribe")
        this.subscribtions[this.nextId] = callback;
        if(this.isState && this.last) callback(this.last)
        return this.nextId++;
    }

    unsubscribe(id) {
        console.log("unsubscribe")
        delete this.subscribtions[id];
    }

    fire(payload) {
        this.last = payload;
        for (const [id, subscription] of Object.entries(this.subscribtions)) {
            subscription(payload, id);
        }

        console.log(this.subscribtions)
    }
}