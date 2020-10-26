import React, {useEffect, useState} from "react";
import {Loading} from "../Common.jsx";
import styles from "./Client.scss";
import {PlayerAuth} from "./Auth.jsx";

const JeopardyClient = () => {
    const [game, setGame] = useState();
    const [connected, setConnected] = useState();

    useEffect(() => setConnected(JEOPARDY_API.isConnected()), [])

    useEffect(() => {
        const gameId = JEOPARDY_API.getGameSubscriber().subscribe(setGame);
        return () => JEOPARDY_API.getGameSubscriber().unsubscribe(gameId);
    }, []);

    if (!connected) return <PlayerAuth setConnected={setConnected}/>;
    if (!game) return <Loading/>

    return <div className={styles.client}>
        {/*<Content game={game}/>*/}
    </div>;
}

export default JeopardyClient;
