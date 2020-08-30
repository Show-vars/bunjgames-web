import axios from 'axios';


export default class ClientApi {
    constructor(endpoint) {
        this.axios = axios.create({
            baseURL: endpoint,
            timeout: 1000
        });

    }

    createGame() {

    }

    getGame(token) {
        return this.axios.get(`game?token=${token}`);
    }

    nextState(token) {
        return this.axios.post(`state/next`, {token: token});
    }
}

