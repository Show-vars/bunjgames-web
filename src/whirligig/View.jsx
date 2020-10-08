import React, {useEffect, useState} from "react";
import styles from "./View.scss";
import {useHistory} from "react-router-dom";
import {AudioPlayer, ImagePlayer, VideoPlayer} from "./Common.jsx";
import {Howl, Howler} from 'howler';
import Whirligig from "./Whirligig.jsx";

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

const QuestionsEndMusic = {
    current: 0,
    music: [
        new Howl({src: ['/sounds/whirligig/question_end_1.mp3']}),
        new Howl({src: ['/sounds/whirligig/question_end_2.mp3']}),
        new Howl({src: ['/sounds/whirligig/question_end_3.mp3']}),
        new Howl({src: ['/sounds/whirligig/question_end_4.mp3']}),
        new Howl({src: ['/sounds/whirligig/question_end_5.mp3']}),
    ]
}

const Music = {
    start: new Howl({src: ['/sounds/whirligig/start.mp3']}),
    intro: new Howl({src: ['/sounds/whirligig/intro.mp3']}),
    questions: new Howl({src: ['/sounds/whirligig/questions.mp3']}),
    whirligig: new Howl({src: ['/sounds/whirligig/whirligig.mp3']}),
    end_defeat: new Howl({src: ['/sounds/whirligig/end_defeat.mp3']}),
    end_victory: new Howl({src: ['/sounds/whirligig/end_victory.mp3']}),
    black_box: new Howl({src: ['/sounds/whirligig/black_box.mp3']}),
}

const Sounds = {
    sig1: new Howl({src: ['/sounds/whirligig/sig1.mp3']}),
    sig2: new Howl({src: ['/sounds/whirligig/sig2.mp3']}),
    sig3: new Howl({src: ['/sounds/whirligig/sig3.mp3']}),
    gong: new Howl({src: ['/sounds/whirligig/gong.mp3']}),
}

const resetSounds = () => {
    QuestionsEndMusic.music.forEach(m => m.stop());
    Object.values(Music).forEach(m => m.stop());
};

const Score = ({game}) => <div className={styles.score}>{game.connoisseurs_score} : {game.viewers_score}</div>;

const QuestionMessage = ({game, text, image, audio, video}) => {
    return <div className={styles.message}>
        {text && <div><p>{text}</p></div>}
        {image && <div><ImagePlayer autoPlay game={game} url={image}/></div>}
        {game.state === "question_start" && audio &&
        <div><AudioPlayer controls autoPlay={true} game={game} url={audio}/></div>}
        {game.state === "question_start" && video &&
        <div><VideoPlayer controls autoPlay={true} game={game} url={video}/></div>}
    </div>
}

const Content = ({game}) => {
    const [angle, setAngle] = useState(Math.randomRange(0, 2 * Math.PI));
    const {cur_question} = game;
    const onWhirligigReady = (angle) => {
        Music.whirligig.stop();
        setTimeout(function() {
            setAngle(angle);
            if (isWhirligigAvailable(game)) {
                WHIRLIGIG_API.nextState("question_whirligig");
            }
        }.bind(this), 3000);
    }

    let content;
    if (isWhirligigAvailable(game)) {
        content = <Whirligig game={game} angle={angle} callback={onWhirligigReady}/>
    } else if (isQuestionAvailable(game)) {
        const {text, image, audio, video} = cur_question;
        content = <QuestionMessage
            game={game} text={text} image={image} audio={audio} video={video}
        />
    } else if (isAnswerAvailable(game)) {
        const {answer_text, answer_image, answer_audio, answer_video} = cur_question;
        content = <QuestionMessage
            game={game} text={answer_text} image={answer_image} audio={answer_audio} video={answer_video}
        />
    } else {
        content = <Score game={game}/>;
    }

    return <div className={styles.content}>
        {content}
    </div>
}

const WhirligigView = () => {
    const history = useHistory();
    const [game, setGame] = useState();

    if (!WHIRLIGIG_API.isConnected()) {
        history.push("/whirligig/auth");
        return "";
    }

    const triggerTimerSound = (time) => {
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
    };

    const triggerIntercom = (message) => {
        if(message === "gong") {
            Sounds.gong.play();
        } else if(message === "sound_stop") {
            resetSounds();
        }
    };

    const triggerState = (game) => {
        const {state} = game;

        resetSounds();

        switch (state) {
            case "start": Music.start.play(); break;
            case "intro": Music.intro.play(); break;
            case "questions": Music.questions.play(); break;
            case "question_whirligig": Music.whirligig.play(); break;
            case "question_end": {
                QuestionsEndMusic.music[QuestionsEndMusic.current].play();
                QuestionsEndMusic.current = (QuestionsEndMusic.current + 1) % QuestionsEndMusic.music.length;
            } break;
            case "end": {
                if(game.connoisseurs_score > game.viewers_score) {
                    Music.end_victory.play();
                } else {
                    Music.end_defeat.play();
                }
            } break;
        }
    };

    useEffect(() => {
        if (!game) return;

        var timer;
        if (game.timer_time > 0) {
            triggerTimerSound(WHIRLIGIG_API.calcTime());
            timer = setInterval(() => {
                triggerTimerSound(WHIRLIGIG_API.calcTime());
            }, 1000);
        }

        return () => timer && clearInterval(timer);
    });

    useEffect(() => {
        const gameId = WHIRLIGIG_API.getGameSubscriber().subscribe(setGame);
        const stateId = WHIRLIGIG_API.getStateSubscriber().subscribe(triggerState);
        const intercomId = WHIRLIGIG_API.getIntercomSubscriber().subscribe(triggerIntercom);
        return () => {
            WHIRLIGIG_API.getGameSubscriber().unsubscribe(gameId);
            WHIRLIGIG_API.getStateSubscriber().unsubscribe(stateId);
            WHIRLIGIG_API.getIntercomSubscriber().unsubscribe(intercomId);
            resetSounds();
        }
    }, []);

    if (!game) {
        return "Loading";
    }

    return <div className={styles.view}>
        <Content game={game}/>
    </div>;
}

export default WhirligigView;
