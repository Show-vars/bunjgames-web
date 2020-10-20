import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import styles from "./Admin.scss";
import {ThemesList, ThemesGrid, QuestionsGrid} from "./Themes.jsx";
import {Loading} from "../Common.jsx"


const getStatusName = (status) => {
    switch (status) {
        case 'waiting_for_players':
            return "Waiting for players";
        case 'themes_all':
            return "All themes";
        case 'themes_round':
            return "Round themes";
        case 'questions':
            return "Questions";
        case 'question_event':
            return "Question event";
        case 'question':
            return "Question";
        case 'question_end':
            return "Question end";
        case 'final_end':
            return "Final question end";
        case 'game_end':
            return "Game over";
    }
}


const Header = ({game}) => {
    const history = useHistory();

    // const onSoundStop = () => WHIRLIGIG_API.intercom("sound_stop");

    const onLogout = () => {
        JEOPARDY_API.logout();
        history.push("/jeopardy/admin/auth");
    };
    return <div className={styles.header}>
        <div className={styles.logo}>Admin dashboard</div>
        <div className={styles.token}>{game.token.toUpperCase()}</div>
        <div className={styles.state}>{getStatusName(game.state)}</div>
        <div className={styles.nav}>
            {/*<div className={css(styles.button, styles.mute)} onClick={onSoundStop}><i className="fas fa-volume-mute"/></div>*/}
            <Link className={styles.button} to={"/"}>Home</Link>
            <Link className={styles.button} to={"/jeopardy/view"}>View</Link>
            <a className={styles.button} onClick={onLogout}>Logout</a>
        </div>
    </div>
}

const Item = ({game}) => {
    let themes = null;
    if (game.state === "themes_all") {
        themes = <ThemesGrid game={game}/>
    } else if (game.state === "themes_round") {
        themes = <ThemesList game={game}/>
    } else if (game.state === "questions") {
        themes = <QuestionsGrid game={game}/>
    }
    return <div className={styles.item}>
        {themes}
    </div>
};

const BalanceControl = ({game}) => {
    const [balances, setBalances] = useState(game.players.map((player) => player.balance));

    const onChange = (event, index) => {
        console.log([...balances.slice(0, index), parseInt(event.target.value), ...balances.slice(index + 1, balances.length)])
        setBalances([...balances.slice(0, index), parseInt(event.target.value), ...balances.slice(index + 1, balances.length)])
    };

    const onSaveClick = () => {
        JEOPARDY_API.set_balance(balances);
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
        <div className={css(styles.button, styles.save)} onClick={onSaveClick}>Save</div>
    </div>
};

const RightPanel = ({game}) => (
    <div className={styles.rightPanel}>
        <BalanceControl game={game}/>
    </div>
)

const Content = ({game}) => {
    return <div className={styles.content}>
        <Item game={game}/>
        <RightPanel game={game}/>
    </div>
}

const Player = ({player}) => {
    return <div className={css(styles.button, styles.player)}>
        <div>{player.balance}</div>
        <div>{player.name}</div>
    </div>
}

const Footer = ({game}) => {
    const onNextClick = () => JEOPARDY_API.nextState(game.state);

    let nextButtonContent = <div className={css(styles.button, styles.next)} onClick={onNextClick}>Next</div>

    return <div className={styles.footer}>
        <div className={styles.players}>
            {game.players.map((player, index) => <Player key={index} player={player}/>)}
        </div>
        {nextButtonContent}
    </div>
}

const JeopardyAdmin = () => {
    const history = useHistory();
    const [game, setGame] = useState();

    if (!JEOPARDY_API.isConnected()) {
        history.push("/jeopardy/admin/auth");
        return "";
    }

    useEffect(() => {
        const id = JEOPARDY_API.getGameSubscriber().subscribe(setGame);
        return () => JEOPARDY_API.getGameSubscriber().unsubscribe(id);
    }, [])

    if (!game) return <Loading/>

    return <div className={styles.admin}>
        <Header game={game}/>
        <Content game={game}/>
        <Footer game={game}/>
    </div>
}

export default JeopardyAdmin;