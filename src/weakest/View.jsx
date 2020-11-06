import React from "react";
import {Loading, useGame, useAuth, useTimer} from "common/Essentials";
import {Howl} from 'howler';
import {AdminAuth} from "common/Auth";
import {Content, GameView, TextContent} from "common/View";

const Music = {
    // intro: new Howl({src: ['/sounds/weakest/intro.wav']}),
}

const Sounds = {
}

const resetSounds = () => {
    Object.values(Music).forEach(m => m.stop());
};

const Timer = () => {
    const time = useTimer(WEAKEST_API);
    const date = new Date(0);
    date.setSeconds(time);
    const timeStr = date.toISOString().substr(14, 5);
    return <TextContent>{timeStr}</TextContent>
}

const FinalQuestions = ({game}) => {
    return ""
}

const useStateContent = (game) => {
    switch (game.state) {
        case "waiting_for_players":
            return <TextContent>{game.token}</TextContent>;
        case "round":
            return <TextContent>Round {game.round}</TextContent>;
        case "questions":
            return <Timer/>;
        case "weakest_choose":
            return <TextContent>Choose the Weakest</TextContent>;
        case "weakest_reveal":
            return <TextContent>{game.players.find(p => p.id === game.weakest).name}</TextContent>;
        case "final":
            return <TextContent>Final</TextContent>;
        case "final_questions":
            return <FinalQuestions game={game}/>;
        case "end":
            return <TextContent>Game over</TextContent>;
        default:
            return <TextContent>The Weakest</TextContent>
    }
};

const WeakestView = () => {
    const game = useGame(WEAKEST_API, (game) => {
        resetSounds();
        switch (game.state) {
            // case "intro": Music.intro.play(); break;
            // case "round": Music.round.play(); break;
            // case "round_themes": Music.themes.play(); break;
            // case "question_event": {
            //     if (game.question.type === "auction") {
            //         Music.auction.play();
            //     } else if (game.question.type === "bagcat") {
            //         Music.bagcat.play();
            //     }
            // } break;
            // case "final_answer": Music.minute.play(); break;
            // case "game_end": Music.game_end.play(); break;
        }
    }, (message) => {
        switch (message) {
            case "sound_stop": resetSounds(); break;
        }
    });
    const [connected, setConnected] = useAuth(WEAKEST_API);

    if (!connected) return <AdminAuth api={WEAKEST_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;

    return <GameView>
        <Content>{useStateContent(game)}</Content>
    </GameView>
}

export default WeakestView;
