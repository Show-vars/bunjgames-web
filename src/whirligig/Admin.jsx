import React, {useState, useReducer, useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import styles from "./Admin.scss";
import {Link} from "react-router-dom";
import {Howl, Howler} from 'howler';

const Sounds = {
    sig1: new Howl({src: ['/sounds/sig1.mp3']})
}

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
        case 'question_end':
            return "Answer";
        case 'end':
            return "Game over";
    }
}

const getMediaUrl = (game, url) => url.startsWith("/") ? `${BunjGamesConfig.WHIRLIGIG_MEDIA}${game.token}${url}` : url;

const ImagePlayer = ({game, url}) => (
    <img src={getMediaUrl(game, url)} alt="Image"/>
);

const AudioPlayer = ({game, url}) => (
    <audio controls src={getMediaUrl(game, url)}> Your browser does not support the <code>audio</code> element. </audio>
);

const VideoPlayer = ({game, url}) => (
    <video controls src={getMediaUrl(game, url)}> Your browser does not support the <code>video</code> element. </video>
);

const Header = ({game}) => {
    const history = useHistory();
    const onLogout = () => {
        WHIRLIGIG_API.logout();
        history.push("/whirligig/auth");
    };
    return <div className={styles.header}>
        <div className={styles.logo}>Admin dashboard</div>
        <div className={styles.token}>{game.token.toUpperCase()}</div>
        <div className={styles.nav}>
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
            <div>{image && <ImagePlayer game={game} url={image}/>}</div>
            <div>{audio && <AudioPlayer game={game} url={audio}/>}</div>
            <div>{video && <VideoPlayer game={game} url={video}/>}</div>
        </div>

        <div className={styles.answer}>
            <div>Answer: {answer_description}</div>
            <div>{answer_text && <p>{answer_text}</p>}</div>
            <div>{answer_image && <ImagePlayer game={game} url={answer_image}/>}</div>
            <div>{answer_audio && <AudioPlayer game={game} url={answer_audio}/>}</div>
            <div>{answer_video && <VideoPlayer game={game} url={answer_video}/>}</div>
        </div>
    </div>
}

const BigItem = ({game}) => {
    const {cur_item, cur_question} = game;

    if (cur_item === null) {
        return <div className={styles.bigitem}/>;
    }

    return <div className={styles.bigitem}>
        <BigInfo item={game.items[cur_item]}/>
        <BigQuestion game={game} question={game.items[cur_item].questions[cur_question]}/>
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

const ScoreControl = ({onUpdate, game}) => {
    const updateScore = (connoisseurs_score, viewers_score) => {
        WHIRLIGIG_API.score(connoisseurs_score, viewers_score).then((game) => {
            onUpdate(game);
        });
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

const RightPanel = ({onUpdate, game, items}) => (
    <div className={styles.rightPanel}>
        <Items items={items}/>
        <ScoreControl onUpdate={onUpdate} game={game}/>
    </div>
)

const Content = ({onUpdate, game}) => {
    const items = game.items || [];

    return (
        <div className={styles.content}>
            <BigItem game={game}/>
            <RightPanel onUpdate={onUpdate} game={game} items={items}/>
        </div>)
};

const Footer = ({onUpdate, game, time}) => {
    const onNextClick = () => {
        WHIRLIGIG_API.nextState().then((game) => {
            onUpdate(game);
        });
    };

    return <div className={styles.footer}>
        <div className={styles.score}>{game.connoisseurs_score} : {game.viewers_score}</div>
        <div className={styles.state}>{getStatusName(game.state)}</div>
        <div className={styles.timer}>
            <div className={styles.time}>{time}</div>
            <div className={styles.button}>Pause</div>
        </div>
        <div className={[styles.button, styles.next].join(' ')} onClick={onNextClick}>Next</div>
    </div>

};


const WhirligigAdmin = () => {
    const history = useHistory();
    const [game, setGame] = useState(null);
    const [time, timeDispatch] = useReducer((state, action) => Math.clamp(state + action, 60, 0), 60);

    console.log("RENDER: ", game);

    if (!WHIRLIGIG_API.hasToken()) {
        history.push("/whirligig/auth");
        return "";
    }

    const onUpdate = (game, oldGame) => {
        console.log("UPDATE: ", game, oldGame);
        setGame(game);

        if((!oldGame || oldGame.state !== game.state) && game.state === "question_discussion") {
            Sounds.sig1.play();
        }
    };

    const updateGame = () => {
        const oldGame = WHIRLIGIG_API.getGameCache();

        WHIRLIGIG_API.getGame().then((game) => {
            console.log("FETCH: ", game, oldGame, !oldGame || oldGame.hash !== game.hash, )
            if(!oldGame || oldGame.hash !== game.hash) {
                onUpdate(game, oldGame);
            }
        });

        const game = WHIRLIGIG_API.getGameCache();
        if (game && game.state === "question_discussion") {
            timeDispatch(-1);
        } else {
            timeDispatch(60);
        }
    };

    useEffect(() => {
        console.log("EFFECT");
        updateGame();
        const timer = setInterval(updateGame, 1000);
        return () => clearInterval(timer);
    }, []);

    return game ? <div className={styles.admin}>
        <Header game={game}/>
        <Content game={game} onUpdate={onUpdate}/>
        <Footer game={game} time={time} onUpdate={onUpdate}/>
    </div> : "Loading"
}

export default WhirligigAdmin;
