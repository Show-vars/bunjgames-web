import axios from 'axios';
import Subscriber from "./Subscriber";

const WHIRLIGIG_TOKEN = "WHIRLIGIG_TOKEN";

export default class ClientApi {
    constructor(apiEndpoint, wsEndpoint) {
        this.axios = axios.create({
            baseURL: apiEndpoint,
            timeout: 10000
        });

        this.wsEndpoint = wsEndpoint;
        this.gameSubscriber = new Subscriber();
        this.stateSubscriber = new Subscriber();
        this.intercomSubscriber = new Subscriber();
        this.lastState = null;

        this.loadToken();
    }

    connect(token = this.token) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => reject(), 5000);
            this.socket = new WebSocket(this.wsEndpoint + token);
            console.log("[WS] Connecting as", token);
            this.socket.onopen = e => {
                console.log("[WS] Connected", e);
                this.token = token;
                this.saveToken();
            }
            this.socket.onmessage = e => {
                console.log("[WS] Message", e);
                if(timeout) {
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
        if(!data || !data.type) return;

        if(data.type === "game") {
            this.game = data.message;
            if (this.lastState !== this.game.state) {
                this.lastState = this.game.state;
                this.stateSubscriber.fire(this.game);
            }
            this.gameSubscriber.fire(this.game);
        } else if(data.type === "intercom") {
            this.intercomSubscriber.fire(data.message);
        }
    }

    loadToken() {
        try {
            this.token = JSON.parse(localStorage.getItem(WHIRLIGIG_TOKEN));
        } catch (e) {
            this.token = null;
        }
    }

    saveToken() {
        localStorage.setItem(WHIRLIGIG_TOKEN, JSON.stringify(this.token));
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

    createGame(inputFile) {
        const formData = new FormData();
        formData.append("game", inputFile.files[0]);

        return this.axios.post('create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(result => {
            this.token = result.data.token;
            this.saveToken();
            return result.data;
        });
    }

    /*openGame(token) {
        return this.getGame(token).then(game => {
            if (game) {
                this.token = token;
                this.saveToken();
            }

            return game;
        });
    }*/

    score(connoisseurs_score, viewers_score) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: "change_score",
            params: {connoisseurs_score, viewers_score}
        }));
    }

    calcTime() {
        const serverTime = this.game.timer_time;
        const serverPausedTime = this.game.timer_paused_time;
        const isPaused = this.game.timer_paused;
        const now = Date.now();

        let time;
        if (isPaused) {
            time = Math.round((serverTime - serverPausedTime) / 1000);
        } else {
            time = Math.round((serverTime - now) / 1000);
        }
        return Math.clamp(time,60,0);
    }

    timer(paused) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: "change_timer",
            params: {paused}
        }));
    }

    answerCorrect(isCorrect) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: "answer_correct",
            params: {is_correct: Boolean(isCorrect)}
        }));
    }

    nextState(fromState=null) {
        if (!this.isConnected()) return;

        this.socket.send(JSON.stringify({
            method: "next_state",
            params: {"from_state": fromState}
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
        this.token = null;
        this.game = undefined;
        this.saveToken();
        if (this.isConnected()) this.socket.close();
    }
}
