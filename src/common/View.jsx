import React from "react";
import styles from "common/View.scss";


const TextContent = ({children}) => (
    <div className={styles.text}>
        <p>{children}</p>
    </div>
);

const Content = ({children}) => (
    <div className={styles.content}>
        {children}
    </div>
);

const GameView = ({children}) => (
    <div className={styles.view}>
        {children}
    </div>
);

export {
    TextContent,
    Content,
    GameView,
}
