import React, {useEffect, useState} from "react";
import {AudioPlayer, HowlWrapper, ImagePlayer, VideoPlayer, Loading, useGame, useAuth} from "common/Essentials";
import {AdminAuth} from "common/Auth";
import Whirligig from "whirligig/Whirligig";
import styles from "whirligig/View.scss";
import {Content, GameView, TextContent} from "common/View";


const QuestionsEndMusic = {
    current: 0,
    music: [
        HowlWrapper('/sounds/whirligig/question_end_1.mp3'),
        HowlWrapper('/sounds/whirligig/question_end_2.mp3'),
        HowlWrapper('/sounds/whirligig/question_end_3.mp3'),
        HowlWrapper('/sounds/whirligig/question_end_4.mp3'),
        HowlWrapper('/sounds/whirligig/question_end_5.mp3'),
    ]
}

const Music = {
    start: HowlWrapper('/sounds/whirligig/start.mp3'),
    intro: HowlWrapper('/sounds/whirligig/intro.mp3'),
    questions: HowlWrapper('/sounds/whirligig/questions.mp3'),
    whirligig: HowlWrapper('/sounds/whirligig/whirligig.mp3'),
    end: HowlWrapper('/sounds/whirligig/end_defeat.mp3'),
    end_victory: HowlWrapper('/sounds/whirligig/end_victory.mp3'),
    black_box: HowlWrapper('/sounds/whirligig/black_box.mp3'),
}

const Sounds = {
    sig1: HowlWrapper('/sounds/whirligig/sig1.ogg'),
    sig2: HowlWrapper('/sounds/whirligig/sig2.ogg'),
    sig3: HowlWrapper('/sounds/whirligig/sig3.ogg'),
    gong: HowlWrapper('/sounds/whirligig/gong.ogg'),
}

const loadSounds = () => {
    QuestionsEndMusic.music.forEach(m => m.load());
    Object.values(Music).forEach(m => m.load());
    Object.values(Sounds).forEach(m => m.load());
}

const resetSounds = () => {
    QuestionsEndMusic.music.forEach(m => m.stop());
    Object.values(Music).forEach(m => m.stop());
};

const isQuestionAvailable = (game) => {
    const {cur_question} = game;
    return ["question_start", "question_discussion", "answer"].includes(game.state)
        && ["text", "image", "audio", "video"].some(v => cur_question[v]);
}

const isAnswerAvailable = (game) => {
    const {cur_question} = game;
    return ["right_answer"].includes(game.state)
        && ["answer_text", "answer_image", "answer_audio", "answer_video"].some(v => cur_question[v]);
}

const isWhirligigAvailable = (game) => {
    return ["question_whirligig"].includes(game.state);
}

const QuestionMessage = ({game, text, image, audio, video}) => {
    return <div className={styles.media}>
        {text && <div><p>{text}</p></div>}
        {image && <div><ImagePlayer autoPlay game={game} url={image}/></div>}
        {["question_start", "right_answer"].includes(game.state) && audio &&
        <div><AudioPlayer controls autoPlay={true} game={game} url={audio}/></div>}
        {["question_start", "right_answer"].includes(game.state) && video &&
        <div><VideoPlayer controls autoPlay={true} game={game} url={video}/></div>}
    </div>
}

const triggerTimerSound = (game, time) => {
    if (!game.cur_item) return;

    if (game.cur_item.type === "standard") {
        switch (time) {
            case 60:
                Sounds.sig1.play();
                break;
            case 10:
                Sounds.sig2.play();
                break;
            case 0:
                Sounds.sig3.play();
                break;
        }
    } else {
        switch (time) {
            case 20:
                Sounds.sig1.play();
                break;
            case 0:
                Sounds.sig3.play();
                break;
        }
    }
}

const useStateContent = (game) => {
    const onWhirligigReady = () => Music.whirligig.stop();

    if (isWhirligigAvailable(game)) {
        return <Whirligig game={game} callback={onWhirligigReady}/>
    } else if (isQuestionAvailable(game)) {
        const {text, image, audio, video} = game.cur_question;
        return <QuestionMessage
            game={game} text={text} image={image} audio={audio} video={video}
        />
    } else if (isAnswerAvailable(game)) {
        const {answer_text, answer_image, answer_audio, answer_video} = game.cur_question;
        return <QuestionMessage
            game={game} text={answer_text} image={answer_image} audio={answer_audio} video={answer_video}
        />
    } else {
        return <TextContent className={styles.score}>{game.connoisseurs_score} : {game.viewers_score}</TextContent>;
    }
}

const WhirligigView = () => {
    const game = useGame(WHIRLIGIG_API, (game) => {
        resetSounds();
        switch (game.state) {
            case "start": Music.start.play(); break;
            case "intro": Music.intro.play(); break;
            case "questions": Music.questions.play(); break;
            case "question_whirligig": Music.whirligig.play(); break;
            case "question_end": {
                QuestionsEndMusic.music[QuestionsEndMusic.current].play();
                QuestionsEndMusic.current = (QuestionsEndMusic.current + 1) % QuestionsEndMusic.music.length;
            } break;
            case "end": {
                Music.end.play();
            } break;
        }
    }, (message) => {
        switch (message) {
            case "gong":
                Sounds.gong.play();
                break;
            case "sound_stop":
                resetSounds();
                break;
        }
    });

    useEffect(() => {
        loadSounds();
        return () => {
            resetSounds();
        }
    }, []);

    useEffect(() => {
        if (!game) return;

        let timer;
        if (game.timer_time > 0) {
            triggerTimerSound(game, WHIRLIGIG_API.calcTime());
            timer = setInterval(() => {
                triggerTimerSound(game, WHIRLIGIG_API.calcTime());
            }, 1000);
        }

        return () => timer && clearInterval(timer);
    }, [game]);

    const [connected, setConnected] = useAuth(WHIRLIGIG_API);

    if (!connected) return <AdminAuth api={WHIRLIGIG_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;

    return <GameView>
        <Content>{useStateContent(game)}</Content>
    </GameView>
}

export default WhirligigView;
