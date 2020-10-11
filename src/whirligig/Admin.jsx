import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import styles from "./Admin.scss";
import {Link} from "react-router-dom";
import {AudioPlayer, ImagePlayer, VideoPlayer} from "./Common.jsx";

const getStatusName = (status) => {
    switch (status) {
        case 'start':
            return "Start";
        case 'intro':
            return "Intro";
        case 'questions':
            return "Questions";
        case 'question_whirligig':
            return "Selecting question";
        case 'question_start':
            return "Asking";
        case 'question_discussion':
            return "Discussion";
        case 'answer':
            return "Answer";
        case 'right_answer':
            return "Right answer";
        case 'question_end':
            return "Question end";
        case 'end':
            return "Game over";
    }
}

const Header = ({game}) => {
    const history = useHistory();

    const onSoundStop = () => WHIRLIGIG_API.intercom("sound_stop");

    const onLogout = () => {
        WHIRLIGIG_API.logout();
        history.push("/whirligig/auth");
    };
    return <div className={styles.header}>
        <div className={styles.logo}>Admin dashboard</div>
        <div className={styles.token}>{game.token.toUpperCase()}</div>
        <div className={styles.nav}>
            <div className={css(styles.button, styles.mute)} onClick={onSoundStop}><i className="fas fa-volume-mute"/></div>
            <Link className={styles.button} to={"/"}>Home</Link>
            <Link className={styles.button} to={"/whirligig/view"}>View</Link>
            <a className={styles.button} onClick={onLogout}>Logout</a>
        </div>
    </div>
};

const BigInfo = ({item}) => {
    const {name, description, type} = item;

    return <div className={styles.biginfo}>
        <div className={styles.question}>
            <div>Name: {name}</div>
            <div>Description: {description}</div>
            <div>Type: {type}</div>
        </div>
    </div>
}

const BigQuestion = ({game, question}) => {
    const {
        description, text, image, audio, video,
        answer_description, answer_text, answer_image, answer_audio, answer_video
    } = question;

    return <div className={styles.bigquestion}>
        <div className={styles.question}>
            <div>Current question: {description}</div>
            <div>{text && <p>{text}</p>}</div>
            <div>{image && <ImagePlayer controls={true} game={game} url={image}/>}</div>
            <div>{audio && <AudioPlayer controls={true} game={game} url={audio}/>}</div>
            <div>{video && <VideoPlayer controls={true} game={game} url={video}/>}</div>
        </div>

        <div className={styles.answer}>
            <div>Answer: {answer_description}</div>
            <div>{answer_text && <p>{answer_text}</p>}</div>
            <div>{answer_image && <ImagePlayer controls={true} game={game} url={answer_image}/>}</div>
            <div>{answer_audio && <AudioPlayer controls={true} game={game} url={answer_audio}/>}</div>
            <div>{answer_video && <VideoPlayer controls={true} game={game} url={answer_video}/>}</div>
        </div>
    </div>
}

const BigItem = ({game}) => {
    const {cur_item, cur_question} = game;

    if (!cur_item || !cur_question) {
        return <div className={styles.bigitem}/>;
    }

    return <div className={styles.bigitem}>
        <BigInfo item={cur_item}/>
        <BigQuestion game={game} question={cur_question}/>
    </div>
};

const ItemQuestion = ({question, single}) => {
    const {number, is_processed, description, answer_description} = question;
    const checkbox = (is_processed)
        ? <i className="fas fa-check-square"/>
        : <i className="fas fa-square"/>

    return <div className={styles.question}>
        {single || <div>{number}: {checkbox}</div>}
        <div>Question: {description}</div>
        <div>Answer: {answer_description}</div>
    </div>
};

const ItemQuestions = ({questions}) => (
    <div className={styles.questions}>
        {questions.map((q, k) => (
            <ItemQuestion key={k} question={q} single={questions.length <= 1}/>
        ))}
    </div>
);

const Item = ({item}) => {
    let [isSelected, select] = useState(false);
    const {name, description, type, is_processed} = item;

    const checkbox = (is_processed)
        ? <i className="fas fa-check-square"/>
        : <i className="fas fa-square"/>

    return <div className={styles.item}>
        <div className={styles.short} onClick={() => select(!isSelected)}>
            <div className={styles.desc}>{name}: {description}</div>
            <div className={styles.processed}>{checkbox}</div>
        </div>
        {isSelected && <ItemQuestions questions={item.questions}/>}
    </div>;
};

const Items = ({items}) => (
    <div className={styles.list}>
        {items.map((item, key) => (
            <Item key={key} item={item}/>
        ))}
    </div>
);

const ScoreControl = ({game}) => {
    const updateScore = (connoisseurs_score, viewers_score) => {
        WHIRLIGIG_API.score(connoisseurs_score, viewers_score);
    };

    return <div className={styles.scoreControl}>
        <div className={styles.control}>
            <div>Connoisseurs</div>
            <div>
                <div className={styles.button}
                     onClick={() => updateScore(game.connoisseurs_score - 1, game.viewers_score)}>
                    <i className="fas fa-minus"/>
                </div>
                {game.connoisseurs_score}
                <div className={styles.button}
                     onClick={() => updateScore(game.connoisseurs_score + 1, game.viewers_score)}>
                    <i className="fas fa-plus"/>
                </div>
            </div>
        </div>
        <div className={styles.control}>
            <div>Viewers</div>
            <div>
                <div className={styles.button}
                     onClick={() => updateScore(game.connoisseurs_score, game.viewers_score - 1)}>
                    <i className="fas fa-minus"/>
                </div>
                {game.viewers_score}
                <div className={styles.button}
                     onClick={() => updateScore(game.connoisseurs_score, game.viewers_score + 1)}>
                    <i className="fas fa-plus"/>
                </div>
            </div>
        </div>
    </div>
};

const RightPanel = ({game, items}) => (
    <div className={styles.rightPanel}>
        <Items items={items}/>
        <ScoreControl game={game}/>
    </div>
)

const Content = ({ game}) => {
    const items = game.items || [];

    return (
        <div className={styles.content}>
            <BigItem game={game}/>
            <RightPanel game={game} items={items}/>
        </div>)
};

const Footer = ({game}) => {
    const [time, setTime] = useState();

    const onGong = () => WHIRLIGIG_API.intercom("gong");
    const onAnswerClick = (isCorrect) => WHIRLIGIG_API.answerCorrect(isCorrect);
    const onNextClick = () => WHIRLIGIG_API.nextState(game.state);
    const onPause = () => WHIRLIGIG_API.timer(!game.timer_paused);

    useEffect(() => {
        var timer;
        if(game.timer_time > 0) {
            setTime(WHIRLIGIG_API.calcTime());
            timer = setInterval(() => {
                const time = WHIRLIGIG_API.calcTime();
                if(game.state === "question_discussion" && time <= 0) {
                    WHIRLIGIG_API.nextState("question_discussion");
                }
                setTime(time)
            }, 1000);
        }

        return () => timer && clearInterval(timer);
    });

    let nextButtonContent;
    if(game.state === "right_answer") {
        nextButtonContent = [
            <div className={css(styles.button, styles.next)} onClick={() => onAnswerClick(true)}>Right</div>,
            <div className={css(styles.button, styles.next)} onClick={() => onAnswerClick(false)}>Wrong</div>
        ];
    } else if(game.state !== "end") {
        nextButtonContent = <div className={css(styles.button, styles.next)} onClick={onNextClick}>Next</div>
    }

    return <div className={styles.footer}>
        <div className={styles.score}>{game.connoisseurs_score} : {game.viewers_score}</div>
        <div className={styles.state}>{getStatusName(game.state)}</div>
        {game.timer_time > 0 && <div className={styles.timer}>
            <div className={styles.time}>{time}</div>
            <div className={styles.button} onClick={onPause}>{game.timer_paused ? "Resume" : "Pause"}</div>
        </div>}
        <div className={css(styles.button, styles.gong)} onClick={onGong}>Gong!</div>
        {nextButtonContent}
    </div>

};


const WhirligigAdmin = () => {
    const history = useHistory();
    const [game, setGame] = useState();

    if (!WHIRLIGIG_API.isConnected()) {
        history.push("/whirligig/auth");
        return "";
    }

    useEffect(() => {
        const id = WHIRLIGIG_API.getGameSubscriber().subscribe(setGame);
        return () => WHIRLIGIG_API.getGameSubscriber().unsubscribe(id);
    }, [])

    return game ? <div className={styles.admin}>
        <Header game={game}/>
        <Content game={game}/>
        <Footer game={game}/>
    </div> : "Loading"
}

export default WhirligigAdmin;
