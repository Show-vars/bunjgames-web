import React, {useEffect, useState} from "react";
import styles from "./View.scss";
import {AudioPlayer, ImagePlayer, VideoPlayer} from "../Common.jsx";
import {ThemesList, ThemesGrid, QuestionsGrid} from "./Themes.jsx";
import {Howl} from 'howler';
import {Loading} from "../Common.jsx";
import {getRoundName, getTypeName} from "./Common.js";
import {AdminAuth} from "./Auth.jsx";

const Music = {
    intro: new Howl({src: ['/sounds/jeopardy/intro.wav']}),
    themes: new Howl({src: ['/sounds/jeopardy/themes.wav']}),
    round: new Howl({src: ['/sounds/jeopardy/round.mp3']}),
    minute: new Howl({src: ['/sounds/jeopardy/minute.mp3']}),
    auction: new Howl({src: ['/sounds/jeopardy/auction.mp3']}),
    bagcat: new Howl({src: ['/sounds/jeopardy/bagcat.mp3']}),
    game_end: new Howl({src: ['/sounds/jeopardy/game_end.mp3']}),
}

const Sounds = {
    skip: new Howl({src: ['/sounds/jeopardy/skip.wav']}),
}

const resetSounds = () => {
    Object.values(Music).forEach(m => m.stop());
};

const QuestionMessage = ({game, text, image, audio, video}) => {
    return <div className={styles.message}>
        {text && <p>{text}</p>}
        {image && <ImagePlayer autoPlay game={game} url={image}/>}
        {audio && <AudioPlayer controls autoPlay={true} game={game} url={audio}/>}
        {video && <VideoPlayer controls autoPlay={true} game={game} url={video}/>}
    </div>
}

const Text = ({text}) => <div className={css(styles.message, styles.text)}><p>{text}</p></div>;

const Content = ({game}) => {
    const {question} = game;
    const answerer = game.answerer && game.players.find(p => p.id === game.answerer);

    let content;
    if (game.state === "waiting_for_players") {
        content = <Text text={game.token}/>
    } else if (game.state === "themes_all") {
        content = <ThemesGrid game={game}/>
    } else if (game.state === "round") {
        content = <Text text={getRoundName(game)}/>
    } else if (game.state === "round_themes") {
        content = <ThemesList game={game}/>
    } else if (game.state === "final_themes") {
        content = <ThemesList game={game}/>
    } else if (game.state === "questions") {
        content = <QuestionsGrid game={game}/>
    } else if (game.state === "question_event") {
        content = <Text text={getTypeName(game.question.type)}/>
    } else if (["question", "answer", "final_question", "final_answer"].includes(game.state)) {
        const {text, image, audio, video} = question;
        content = <QuestionMessage
            game={game} text={text} image={image} audio={audio} video={video}
        />
    } else if (game.state === "question_end") {
        const {answer_text, answer_image, answer_audio, answer_video} = question;
        content = <QuestionMessage
            game={game} text={answer_text} image={answer_image} audio={answer_audio} video={answer_video}
        />
    } else if (game.state === "final_player_answer") {
        content = <Text text={answerer.final_answer || "⸻"}/>
    } else if (game.state === "final_player_bet") {
        content = <Text text={answerer.final_bet}/>
    } else {
        content = <Text text={"Jeopardy"}/>
    }

    return <div className={styles.content}>
        {content}
    </div>
}

const JeopardyView = () => {
    const [game, setGame] = useState();
    const [connected, setConnected] = useState();

    useEffect(() => setConnected(JEOPARDY_API.isConnected()), [])

    const triggerIntercom = (message) => {
        if(message === "sound_stop") {
            resetSounds();
        } else if (message === "skip") {
            Sounds.skip.play();
        }
    };

    const triggerState = (game) => {
        const {state} = game;

        resetSounds();

        switch (state) {
            case "intro": Music.intro.play(); break;
            case "round": Music.round.play(); break;
            case "round_themes": Music.themes.play(); break;
            case "question_event": {
                if (game.question.type === "auction") {
                    Music.auction.play();
                } else if (game.question.type === "bagcat") {
                    Music.bagcat.play();
                }
            } break;
            case "final_answer": Music.minute.play(); break;
            case "game_end": Music.game_end.play(); break;
        }
    };

    useEffect(() => {
        const gameId = JEOPARDY_API.getGameSubscriber().subscribe(setGame);
        const stateId = JEOPARDY_API.getStateSubscriber().subscribe(triggerState);
        const intercomId = JEOPARDY_API.getIntercomSubscriber().subscribe(triggerIntercom);
        return () => {
            JEOPARDY_API.getGameSubscriber().unsubscribe(gameId);
            JEOPARDY_API.getStateSubscriber().unsubscribe(stateId);
            JEOPARDY_API.getIntercomSubscriber().unsubscribe(intercomId);
            resetSounds();
        }
    }, []);

    if (!connected) return <AdminAuth setConnected={setConnected}/>;
    if (!game) return <Loading/>

    return <div className={styles.view}>
        <Content game={game}/>
    </div>;
}

export default JeopardyView;
