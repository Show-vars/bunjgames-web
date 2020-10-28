import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import styles from "./Admin.scss";
import {ThemesList, ThemesGrid, QuestionsGrid} from "./Themes.jsx";
import {AudioPlayer, ImagePlayer, Loading, VideoPlayer, Toast} from "../Common.jsx"
import {getStatusName, getTypeName} from "./Common.js";
import {AdminAuth} from "./Auth.jsx";


const Header = ({game}) => {
    const history = useHistory();

    const onSoundStop = () => JEOPARDY_API.intercom("sound_stop");

    const onLogout = () => {
        JEOPARDY_API.logout();
        history.push("/");
    };
    return <div className={styles.header}>
        <div className={styles.logo}>Admin dashboard</div>
        <div className={styles.token}>{game.token.toUpperCase()}</div>
        <div className={styles.state}>{getStatusName(game.state)}</div>
        <div className={styles.nav}>
            {<div className={css(styles.button, styles.mute)} onClick={onSoundStop}><i className="fas fa-volume-mute"/>
            </div>}
            <Link className={styles.button} to={"/"}>Home</Link>
            <Link className={styles.button} to={"/jeopardy/view"}>View</Link>
            <a className={styles.button} onClick={onLogout}>Logout</a>
        </div>
    </div>
}

const QuestionEvent = ({question}) => {
    const {
        type, custom_theme, value
    } = question;
    return <div className={styles.questionEvent}>
        <div className={styles.type}>{getTypeName(type)}</div>
        {custom_theme && <div>Custom theme: {custom_theme}</div>}
        <div>Value: {value}</div>
    </div>
}

const Question = ({question}) => {
    const {
        value, custom_theme, text, image, audio, video,
        answer, comment, answer_text, answer_image, answer_audio, answer_video
    } = question;

    return <div className={styles.bigquestion}>
        <div className={styles.question}>
            <div>Value: {value}</div>
            {custom_theme && <div>Custom theme: {custom_theme}</div>}
            <div>{text && <p>{text}</p>}</div>
            <div>{image && <ImagePlayer controls={true} game={game} url={image}/>}</div>
            <div>{audio && <AudioPlayer controls={true} game={game} url={audio}/>}</div>
            <div>{video && <VideoPlayer controls={true} game={game} url={video}/>}</div>
        </div>

        <div className={styles.answer}>
            <div>Answer: {answer}</div>
            {comment && <div>Comment: {comment}</div>}
            <div>{answer_text && <p>{answer_text}</p>}</div>
            <div>{answer_image && <ImagePlayer controls={true} game={game} url={answer_image}/>}</div>
            <div>{answer_audio && <AudioPlayer controls={true} game={game} url={answer_audio}/>}</div>
            <div>{answer_video && <VideoPlayer controls={true} game={game} url={answer_video}/>}</div>
        </div>
    </div>
}

const FinalBets = ({players, answerer}) => {
    const onClick = (playerId) => {
        JEOPARDY_API.intercom("do_bet:" + playerId)
    }

    return <div className={css(styles.padding, styles.players)}>
        {players.map((player, index) =>
            <Player key={index} balance={player.final_bet} selected={answerer && player.id === answerer}
                    name={player.name} onClick={() => onClick(player.id)}/>
        )}
    </div>
}

const FinalAnswers = ({players, answerer}) => {
    const onClick = (playerId) => {
        JEOPARDY_API.intercom("do_answer:" + playerId)
    }

    return <div className={css(styles.padding, styles.players)}>
        {players.map((player, index) =>
            <Player key={index} balance={player.final_answer || "⸻"} selected={answerer && player.id === answerer}
                    name={player.name} onClick={() => onClick(player.id)}/>
        )}
    </div>
}

const StateContent = ({game}) => {
    const onSelectQuestion = (questionId) => {
        JEOPARDY_API.chooseQuestion(questionId);
    };
    const onSelectTheme = (themeId) => {
        JEOPARDY_API.remove_final_theme(themeId);
    };

    let content = null;
    if (game.state === "themes_all") {
        content = <ThemesGrid game={game}/>
    } else if (game.state === "round_themes") {
        content = <ThemesList game={game}/>
    } else if (game.state === "final_themes") {
        content = <ThemesList onSelect={onSelectTheme} game={game} active={true}/>
    } else if (game.state === "questions") {
        content = <QuestionsGrid onSelect={onSelectQuestion} game={game}/>
    } else if (game.state === "question_event") {
        content = <QuestionEvent question={game.question}/>
    } else if (["question", "answer", "final_question"].includes(game.state)) {
        content = <Question question={game.question}/>
    } else if (game.state === "final_bets") {
        content = <FinalBets players={game.players}/>
    } else if (game.state === "final_answer") {
        content = <div>
            <Question question={game.question}/>
            <FinalAnswers players={game.players}/>
        </div>
    } else if (game.state === "final_player_answer") {
        content = <FinalAnswers players={game.players} answerer={game.answerer}/>
    } else if (game.state === "final_player_bet") {
        content = <FinalBets players={game.players} answerer={game.answerer}/>
    } else if (game.state === "game_end") {
        content = <div className={styles.padding}>Game over</div>
    }
    return <div className={styles.stateContent}>
        {content}
    </div>
};

const BalanceControl = ({game}) => {
    const [balances, setBalances] = useState(game.players.map((player) => player.balance));

    useEffect(() => {
        setBalances(game.players.map((player) => player.balance));
    }, [game]);

    const onChange = (event, index) => {
        setBalances([...balances.slice(0, index), event.target.value, ...balances.slice(index + 1, balances.length)])
    };

    const onSaveClick = () => {
        JEOPARDY_API.set_balance(balances.map(b => parseInt(b)));
    };

    return <div className={styles.balanceControl}>
        {game.players.map((player, index) => (
            <div key={index}>
                <div className={styles.name}>{player.name}</div>
                <input
                    className={styles.input}
                    type={"number"}
                    onChange={(event) => onChange(event, index)}
                    value={balances[index]}
                />
            </div>
        ))}
        {game.players.length > 0 && <div className={css(styles.button, styles.save)} onClick={onSaveClick}>Save</div>}
    </div>
};

const RightPanel = ({game}) => (
    <div className={styles.rightPanel}>
        <BalanceControl game={game}/>
    </div>
)

const Content = ({game}) => {
    return <div className={styles.content}>
        <StateContent game={game}/>
        <RightPanel game={game}/>
    </div>
}

const Player = ({balance, name, onClick, selected}) => {
    return <div className={css(styles.button, selected && styles.selected, styles.player)} onClick={onClick}>
        <div>{balance}</div>
        <div>{name}</div>
    </div>
}

const Footer = ({game}) => {
    const [answerer, setAnswerer] = useState();
    const [bet, setBet] = useState();

    useEffect(() => {
        setAnswerer(game.answerer);
        setBet(game.question ? game.question.value : 0);
    }, [game]);

    const onNextClick = () => JEOPARDY_API.nextState(game.state);
    const onSkipClick = () => JEOPARDY_API.skip_question();
    const onAnswererClick = () => JEOPARDY_API.set_answerer_and_bet(answerer, bet);
    const onAnswerClick = (is_right) => JEOPARDY_API.answer(is_right);
    const onFinalAnswerClick = (is_right) => JEOPARDY_API.final_player_answer(is_right);
    const onPlayerSelect = (id) => {
        if (["question_event"].includes(game.state)) setAnswerer(id);
    };

    let nextButtonContent = [];
    let betContent = "";

    if (["questions", "final_themes", "game_end"].includes(game.state)) {

    } else if (["question_event"].includes(game.state)) {
        nextButtonContent.push(<div className={styles.button} onClick={onSkipClick}>Skip</div>);
        if (answerer && bet > 0) {
            nextButtonContent.push(<div className={styles.button} onClick={onAnswererClick}>Next</div>);
        }
    } else if (["answer"].includes(game.state)) {
        nextButtonContent.push(<div className={styles.button} onClick={onSkipClick}>Skip</div>);

        if (game.answerer) {
            nextButtonContent.push(<div className={styles.button} onClick={() => onAnswerClick(false)}>Wrong</div>);
            nextButtonContent.push(<div className={styles.button} onClick={() => onAnswerClick(true)}>Right</div>);
        }
    } else if (["final_player_answer"].includes(game.state)) {
        nextButtonContent.push(<div className={styles.button} onClick={() => onFinalAnswerClick(false)}>Wrong</div>);
        nextButtonContent.push(<div className={styles.button} onClick={() => onFinalAnswerClick(true)}>Right</div>);
    } else {
        nextButtonContent.push(<div className={styles.button} onClick={onNextClick}>Next</div>);
    }

    if (["question_event"].includes(game.state)) {
        betContent = <input className={css(styles.input, styles.bet)} type={"number"}
                            onChange={e => setBet(parseInt(e.target.value))}
                            value={bet}
        />
    }

    return <div className={styles.footer}>
        <div className={styles.players}>
            {game.players.map((player, index) =>
                <Player key={index} balance={player.balance} name={player.name}
                        onClick={() => onPlayerSelect(player.id)} selected={player.id === answerer}/>
            )}
        </div>
        {betContent}
        <div className={styles.buttons}>
            {nextButtonContent.map((c, i) => React.cloneElement(c, {key: i}))}
        </div>
    </div>
}

const JeopardyAdmin = () => {
    const [game, setGame] = useState();
    const [connected, setConnected] = useState();

    useEffect(() => setConnected(JEOPARDY_API.isConnected()), [])

    useEffect(() => {
        const id = JEOPARDY_API.getGameSubscriber().subscribe(setGame);
        return () => JEOPARDY_API.getGameSubscriber().unsubscribe(id);
    }, [])

    if (!connected) return <AdminAuth setConnected={setConnected}/>;
    if (!game) return <Loading/>

    return <div className={styles.admin}>
        <Header game={game}/>
        <Content game={game}/>
        <Footer game={game}/>
        <Toast/>
    </div>
}

export default JeopardyAdmin;