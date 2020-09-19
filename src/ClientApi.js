import axios from 'axios';

const WHIRLIGIG_TOKEN = "WHIRLIGIG_TOKEN";

export default class ClientApi {
    constructor(endpoint) {
        this.axios = axios.create({
            baseURL: endpoint,
            timeout: 1000
        });

        this.game = undefined;

        this.loadToken();
    }

    loadToken() {
        this.token = JSON.parse(localStorage.getItem(WHIRLIGIG_TOKEN));
    }

    saveToken() {
        localStorage.setItem(WHIRLIGIG_TOKEN, JSON.stringify(this.token));
    }

    createGame(inputFile) {
        const formData = new FormData();
        formData.append("game", inputFile.files[0]);

        return this.axios.post('create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            if (response.data) {
                this.token = response.data.token;
                this.saveToken();
            }
        });
    }

    openGame(token) {
        return this.getGame(token).then(game => {
            if (game) {
                this.token = token;
                this.saveToken();
            }

            return game;
        });
    }

    getGameCache() {
        return this.game;
    }

    getGame() {
        if (this.hasToken()) {
            return this.axios.get(`game?token=${this.token}`).then(result => {
                const oldGame = this.game;
                const game = result.data;

                if(!oldGame || oldGame.hash !== game.hash) {
                    this.game = result.data;
                }

                return game;
            });
        }
    }

    score(connoisseurs_score, viewers_score) {
        if (!this.hasToken() || connoisseurs_score < 0 || connoisseurs_score > 6 || viewers_score < 0 || viewers_score > 6) {
            return new Promise(((resolve, reject) => reject()));
        }

        return this.axios.post(`score`, {
            token: this.token,
            connoisseurs_score: connoisseurs_score,
            viewers_score: viewers_score
        }).then(result => result.data);
    }

    nextState() {
        if (this.hasToken()) {
            return this.axios.post(`state/next`, {token: this.token}).then(result => result.data);
        }
    }

    hasToken() {
        return Boolean(this.token);
    }

    logout() {
        this.token = null;
        this.saveToken();
    }
}

