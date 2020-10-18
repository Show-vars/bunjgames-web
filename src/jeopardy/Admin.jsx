import {Link, useHistory} from "react-router-dom";
import React, {useEffect, useState} from "react";
import styles from "./Admin.scss";

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
        <div className={styles.nav}>
            {/*<div className={css(styles.button, styles.mute)} onClick={onSoundStop}><i className="fas fa-volume-mute"/></div>*/}
            <Link className={styles.button} to={"/"}>Home</Link>
            <Link className={styles.button} to={"/jeopardy/view"}>View</Link>
            <a className={styles.button} onClick={onLogout}>Logout</a>
        </div>
    </div>
}

const Content = ({game}) => {
    return null
}

const Footer = ({game}) => {
    return null
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

    return game ? <div className={styles.admin}>
        <Header game={game}/>
        <Content game={game}/>
        <Footer game={game}/>
    </div> : "Loading"
}

export default JeopardyAdmin;