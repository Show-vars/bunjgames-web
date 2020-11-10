import React from "react";
import styles from "common/View.scss";
import {Toast} from "common/Essentials";


const TextContent = ({className, children}) => (
    <div className={css(styles.text, className)}>
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
        <Toast/>
    </div>
);

export {
    TextContent,
    BlockContent,
    Content,
    GameView,
}
