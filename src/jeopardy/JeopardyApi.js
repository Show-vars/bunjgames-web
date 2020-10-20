import GameApi from "../GameApi.js";

const JEOPARDY_TOKEN = "JEOPARDY_TOKEN";

export default class JeopardyApi extends GameApi {
    constructor(apiEndpoint, wsEndpoint) {
        super(apiEndpoint, wsEndpoint, JEOPARDY_TOKEN);
    }

    createGame(inputFile) {
        const formData = new FormData();
        formData.append("game", inputFile.files[0]);

        return this.axios.post('create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(result => {
            this.saveToken(result.data.token);
            return result.data;
        });
    }

    registerPlayer(token, name) {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("name", name);

        return this.axios.post('players/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(result => {
            this.saveToken(result.data.token);
            return result.data;
        });
    }

    nextState(from_state=null) {
        this.execute("next_state", {from_state})
    }

    chooseQuestion(question_id) {
        this.execute("choose_question", {question_id})
    }

    end_question(player_id, balance_diff) {
        this.execute("end_question", {player_id, balance_diff})
    }

    skip_question() {
        this.execute("skip_question", {})
    }

    button_click(player_id) {
        this.execute("answer_correct", {player_id})
    }

    final_bet(player_id, bet) {
        this.execute("final_bet", {player_id, bet})
    }

    final_answer(player_id, answer) {
        this.execute("final_answer", {player_id, answer})
    }

    set_balance(balance_list) {
        this.execute("set_balance", {balance_list})
    }

    set_round(round) {
        this.execute("set_round", {round})
    }

}