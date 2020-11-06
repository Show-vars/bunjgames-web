import React from "react";
import styles from "./Admin.scss";
import {Toast} from "./Essentials.jsx";

const Header = ({gameName, token, stateName, children}) => {
    return <div className={styles.header}>
        <div className={styles.logo}>{gameName ? gameName : "Admin"}</div>
        <div className={styles.token}>{token.toUpperCase()}</div>
        <div className={styles.state}>{stateName}</div>
        <div className={styles.nav}>
            {children}
        </div>
    </div>
}

const StateContent = ({children}) => (
    <div className={styles.stateContent}>{children}</div>
)

const RightPanel = ({children}) => (
    <div className={styles.rightPanel}>
        {children}
    </div>
)

const BlockContent = ({children}) => (
    <div className={styles.blockContent}>{children}</div>
)

const TextContent = ({children}) => (
    <div className={styles.textContent}>{children}</div>
)

const Content = ({rightPanel, children}) => {
    return <div className={styles.content}>
        <StateContent>{children}</StateContent>
        <RightPanel>{rightPanel}</RightPanel>
    </div>
}

const FooterItem = ({children}) => (
    <div className={styles.footerItem}>
        {children}
    </div>
);

const Footer = ({children}) => (
    <div className={styles.footer}>
        {children}
    </div>
);

const GameAdmin = ({children}) => {
    return <div className={styles.admin}>
        {children}
        <Toast/>
    </div>
}

export {
    // Components
    GameAdmin,
    Header,
    Content,
    BlockContent,
    TextContent,
    Footer,
    FooterItem,
};