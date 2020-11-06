import React from "react";
import { Link } from "react-router-dom";
import styles from "./InfoPage.scss";

const InfoPage = () => {
    return <div className={styles.body}>
        <div className={styles.header}>
            <div className={styles.subtitle}>Bunjgames</div>
        </div>
        <div className={styles.category}>
            <div className={styles.subtitle}>Whirligig:</div>
            <div><Link to={'/whirligig/admin'}>Admin panel</Link></div>
            <div><Link to={'/whirligig/view'}>View</Link></div>
        </div>
        <div className={styles.category}>
            <div className={styles.subtitle}>Jeopardy:</div>
            <div><Link to={'/jeopardy/admin'}>Admin panel</Link></div>
            <div><Link to={'/jeopardy/view'}>View</Link></div>
            <div><Link to={'/jeopardy/client'}>Client</Link></div>
        </div>
        <div className={styles.category}>
            <div className={styles.subtitle}>The Weakest:</div>
            <div><Link to={'/weakest/admin'}>Admin panel</Link></div>
            <div><Link to={'/weakest/view'}>View</Link></div>
            <div><Link to={'/weakest/client'}>Client</Link></div>
        </div>
    </div>
}

export default InfoPage;
