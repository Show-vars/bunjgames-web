import axios from 'axios';
import Subscriber from "./Subscriber";

export default class GameClient {
    constructor(apiEndpoint, wsEndpoint, tokenName) {
        this.axios = axios.create({
            baseURL: apiEndpoint,
            timeout: 10000
        });

        this.wsEndpoint = wsEndpoint;
        this.gameSubscriber = new Subscriber();
        this.stateSubscriber = new Subscriber();
        this.intercomSubscriber = new Subscriber();
        this.lastState = null;
        this.tokenName = tokenName;

        this.loadToken();
    }

    connect(token = this.token) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => reject(), 5000);
            this.socket = new WebSocket(this.wsEndpoint + token);
            console.log("[WS] Connecting as", token);
            this.socket.onopen = e => {
                console.log("[WS] Connected", e);
                this.saveToken(token);
            }
            this.socket.onmessage = e => {
                console.log("[WS] Message", e);
                if (timeout) {
                    clearTimeout(timeout);
                    resolve();
                }
                this.onData(JSON.parse(e.data));
            }
            this.socket.onclose = e => {
                console.log("[WS] Close", e);
                reject();
            }
            this.socket.onerror = e => {
                console.log("[WS] Error", e);
                reject();
            }
        });
    }

    isConnected() {
        return Boolean(this.socket && this.socket.readyState === WebSocket.OPEN);
    }

    onData(data) {
        if (!data || !data.type) return;

        if (data.type === "game") {
            this.game = data.message;
            if (this.lastState !== this.game.state) {
                this.lastState = this.game.state;
                this.stateSubscriber.fire(this.game);
            }
            this.gameSubscriber.fire(this.game);
        } else if (data.type === "intercom") {
            this.intercomSubscriber.fire(data.message);
        }
    }

    loadToken() {
        try {
            this.token = JSON.parse(localStorage.getItem(this.tokenName));
        } catch (e) {
            this.token = null;
        }
        return this.token;
    }

    saveToken(token) {
        this.token = token;
        localStorage.setItem(this.tokenName, JSON.stringify(this.token));
    }

    getGameSubscriber() {
        return this.gameSubscriber;
    }

    getStateSubscriber() {
        return this.stateSubscriber;
    }


    getIntercomSubscriber() {
        return this.intercomSubscriber;
    }

    execute(method, params = {}) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: method,
            params: params
        }));
    }

    intercom(message) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: "intercom",
            message: message
        }));
    }

    hasToken() {
        return Boolean(this.token);
    }

    logout() {
        this.saveToken(null);
        this.game = undefined;
        if (this.isConnected()) this.socket.close();
    }
}
