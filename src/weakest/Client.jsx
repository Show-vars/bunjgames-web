import React from "react";
import {useHistory} from "react-router-dom";

import {List, ListItem, Loading, useAuth, useGame} from "common/Essentials";
import {PlayerAuth} from "common/Auth";
import {GameClient, Content, Header, ExitButton, TextContent, BigButtonContent} from "common/Client";

import styles from "weakest/Client.scss";


const Players = ({game, player, onClick}) => {
    return <List className={styles.players}>
        {game.players.filter(p => !p.is_weak).map(p =>
            <ListItem
                key={p.id}
                className={css(
                    styles.player,
                    p.id === player.id && styles.self,
                    p.id === player.weak && styles.selected,
                    p.id !== player.id && styles.active
                )}
                onClick={() => p.id !== player.id && onClick(p.id)}
            >
                {p.name}
            </ListItem>
        )}
    </List>
}


const useStateContent = (game) => {
    const player = game.players.find(p => p.id === WEAKEST_API.playerId);
    const buttonActive = game.answerer && game.answerer === WEAKEST_API.playerId;

    const onBank = () => buttonActive && WEAKEST_API.save_bank();
    const onPlayerSelect = (playerId) => WEAKEST_API.select_weakest(playerId);

    switch (game.state) {
        case "questions":
            return <BigButtonContent active={buttonActive} onClick={onBank}>Bank</BigButtonContent>
        case "weakest_choose":
            return <Players game={game} player={player} onClick={onPlayerSelect}/>
        case "end":
            return <TextContent>Game over</TextContent>;
        default:
            return <TextContent>The Weakest</TextContent>
    }
};

const WeakestClient = () => {
    const game = useGame(WEAKEST_API, (game) => {}, (message) => {});
    const [connected, setConnected] = useAuth(WEAKEST_API);
    const history = useHistory();

    if (!connected) return <PlayerAuth api={WEAKEST_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;
/*
    if (!game.players.find(p => p === WEAKEST_API.playerId)) {
        WEAKEST_API.savePlayerId(null);
        if (WEAKEST_API.isConnected()) WEAKEST_API.socket.close();
        setConnected(false);
    }
*/

    const onLogout = () => {
        WEAKEST_API.logout();
        history.push("/");
    };

    return <GameClient>
        <Header><ExitButton onClick={onLogout}/></Header>
        <Content>{useStateContent(game)}</Content>
    </GameClient>
}

export default WeakestClient;
