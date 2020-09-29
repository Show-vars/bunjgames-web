export default class Subscriber {
    constructor() {
        this.nextId = 0;
        this.subscribtions = {};
    }

    subscribe(callback) {
        console.log("subscribe")
        this.subscribtions[this.nextId] = {
            callback: callback,
            state: null
        };
        return this.nextId++;
    }

    unsubscribe(id) {
        console.log("unsubscribe")
        delete this.subscribtions[id];
    }

    fire(payload, state, checker) {
        for (const [id, subscription] of Object.entries(this.subscribtions)) {
            const check = checker(subscription.state);
            if(check) {
                this.subscribtions[id].state = state;
            }
            subscription.callback(payload, check);
        }

        console.log(this.subscribtions)
    }
}