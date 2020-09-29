export default class AwesomeTimer {
    constructor() {
        this.time = 0;
        //this.update = this.update.bind(this);

        this.triggers = [];
        this.callback = undefined;
    }

    start(timeout) {
        this.time = timeout;
        console.log("Start", this.time);
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    resume() {
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    stop() {
        this.time = 0;
        if(this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    pause() {
        if(this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    toggle() {
        if (this.intervalId) this.pause(); else this.resume();
    }

    addTrigger(time, callback) {
        this.triggers.push({time, callback});
    }

    setCallback(callback) {
        this.callback = callback;
    }

    destroy() {
        console.log("destroy", this.time);
        this.stop();
        this.triggers = [];
    }

    update() {
        console.log("Timer", this.time);

        this.triggers.filter(t => t.time === this.time).forEach(t => t.callback(this.time));
        if (this.callback) this.callback(this.time);

        if (this.time <= 0) {
            this.stop();
        } else {
            this.time--;
        }
    }
}