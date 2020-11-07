import React from "react";
import styles from "common/View.scss";


const TextContent = ({children}) => (
    <div className={styles.text}>
        <p>{children}</p>
    </div>
);

const BlockContent = ({children}) => (
    <div className={styles.block}>
        {children}
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
    BlockContent,
    Content,
    GameView,
}
