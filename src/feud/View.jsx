import React, {useEffect, useState} from "react";
import {Loading, useGame, useAuth, useTimer, HowlWrapper} from "common/Essentials";
import {AdminAuth} from "common/Auth";
import {Content, GameView, TextContent} from "common/View";
import {FinalQuestions, Question} from "feud/Question";

const Music = {
}

const Sounds = {
    gong: HowlWrapper('/sounds/weakest/gong.ogg'),
    reveal: HowlWrapper('/sounds/weakest/weakest_reveal.mp3', false, 0.5),

}

const loadSounds = () => {
    Object.values(Music).forEach(m => m.load());
    Object.values(Sounds).forEach(m => m.load());
}

const stopMusic = () => {
    Object.values(Music).forEach(m => m.stop());
};

const changeMusic = (old, next) => {
    if (old !== next) {
        stopMusic();
        if (Music[next]) Music[next].play();
        return next;
    }
}

const Timer = () => {
    const time = useTimer(FEUD_API);
    const date = new Date(0);
    date.setSeconds(time);
    const timeStr = date.toISOString().substr(14, 5);
    return <TextContent>{timeStr}</TextContent>
}

const useStateContent = (game) => {
    const answerer = game.answerer && game.teams.find(t => t.id === game.answerer);
    switch (game.state) {
        case "waiting_for_teams":
            return <TextContent>{game.token}</TextContent>;
        case "round":
            return <TextContent>Round {game.round}</TextContent>;
        case "button":
        case "answers":
        case "answers_reveal":
        case "final_questions":
            return <Question
                game={game} showHiddenAnswers={false}
            />;
        case "final":
            return <TextContent>Final</TextContent>;
        case "final_questions_reveal":
            return <FinalQuestions game={game}/>;
        case "end":
            return <TextContent>{answerer.score}</TextContent>;
        default:
            return <TextContent>Friends Feud</TextContent>
    }
};

const FeudView = () => {
    const [music, setMusic] = useState();
    const game = useGame(FEUD_API, (game) => {
    }, (message) => {
        switch (message) {
            case "gong":
                Sounds.gong.play();
                break;
            case "reveal":
                Sounds.reveal.play();
                break;
            case "sound_stop":
                setMusic(changeMusic(music, ""));
                break;
        }
    });

    useEffect(() => {
        loadSounds();
        return () => {
            stopMusic();
        }
    }, []);

    const [connected, setConnected] = useAuth(FEUD_API);

    if (!connected) return <AdminAuth api={FEUD_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;

    return <GameView>
        <Content>{useStateContent(game)}</Content>
    </GameView>
}

export default FeudView;
