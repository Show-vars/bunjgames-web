import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Loading} from "../Common.jsx";
import styles from "./Client.scss";
import {PlayerAuth} from "./Auth.jsx";
import {Howl} from "howler";

const Sounds = {
    do_bet: new Howl({src: ['/sounds/jeopardy/do_bet.mp3']})
}

const Header = () => {
    const history = useHistory();

    const onLogout = () => {
        JEOPARDY_API.logout();
        history.push("/");
    };

    return <div className={styles.header}>
        <a className={styles.exit} onClick={onLogout}><i className="fas fa-times-circle"/></a>
    </div>
}

const FinalBet = ({game}) => {
    const [bet, setBet] = useState();

    const onSubmit = () => {
        JEOPARDY_API.final_bet(parseInt(bet));
    }

    return <div className={styles.form}>
        <input type="number" className={styles.input}
               onChange={(e) => setBet(e.target.value)}
               value={bet}/>
        <div className={styles.button} onClick={onSubmit}>Submit</div>
    </div>
}

const Content = ({game}) => {
    let content = "";
    const buttonActive = game.state === "answer" && !game.answerer;
    const player = game.players.find(p => p.id === JEOPARDY_API.playerId);

    const onButton = () => {
        if(buttonActive) JEOPARDY_API.button_click();
    }

    if(["question", "answer"].includes(game.state)) {
        content = <div className={css(styles.playerButton,  buttonActive && styles.active)} onClick={onButton}/>
    } else if(["final_bets"].includes(game.state) && player.final_bet === 0) {
        content = <FinalBet />
    } else {
        content = <div className={styles.text}>Jeopardy</div>
    }
    return <div className={styles.content}>
        {content}
    </div>
}

const Player = ({player, selected, self}) => {
    return <div className={css(styles.player, self && styles.self, selected && styles.selected)}>
        <div>{player.balance}</div>
        <div>{player.name}</div>
    </div>
}

const Players = ({game}) => {
    return <div className={styles.players}>
        {game.players.map((player, index) =>
            <Player key={player.id} player={player} selected={player.id === game.answerer} self={player.id === JEOPARDY_API.playerId}/>
        )}
    </div>
}

const JeopardyClient = () => {
    const [game, setGame] = useState();
    const [connected, setConnected] = useState();

    const triggerIntercom = (message) => {
        if(message === "do_bet:" + JEOPARDY_API.playerId) {
            Sounds.do_bet.play();
        }
    };

    useEffect(() => setConnected(JEOPARDY_API.isConnected()), [])

    useEffect(() => {
        const gameId = JEOPARDY_API.getGameSubscriber().subscribe(setGame);
        const intercomId = JEOPARDY_API.getIntercomSubscriber().subscribe(triggerIntercom);

        return () => {
            JEOPARDY_API.getGameSubscriber().unsubscribe(gameId);
            JEOPARDY_API.getIntercomSubscriber().unsubscribe(intercomId);
        }
    }, []);

    if (!connected) return <PlayerAuth setConnected={setConnected}/>;
    if (!game) return <Loading/>

    return <div className={styles.client}>
        <Header />
        <Content game={game}/>
        <Players game={game}/>
    </div>;
}

export default JeopardyClient;
