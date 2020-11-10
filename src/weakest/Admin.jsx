import React from "react";
import {useHistory} from "react-router-dom";

import {useGame, useAuth, Loading, Button, ButtonLink, List, ListItem, useTimer, OvalButton} from "common/Essentials"
import {BlockContent, Content, Footer, FooterItem, GameAdmin, Header, TextContent} from "common/Admin";
import {AdminAuth} from "common/Auth";

import {getStatusName} from "weakest/Common";
import styles from "weakest/Admin.scss";


const Question = ({game}) => {
    const {question, answer} = game.question;

    return <BlockContent>
        {game.state === "final_questions" && game.players.filter(player => !player.is_weak).map(player =>
            <div key={player.id}>{player.name} : {player.right_answers}</div>
        )}
        {game.state === "questions" && <Timer/>}
        <div>{question}</div>
        <div>{answer}</div>
    </BlockContent>
}

const Timer = () => {
    const time = useTimer(WEAKEST_API, () => WEAKEST_API.next_state("questions"));
    const date = new Date(0);
    date.setSeconds(time);
    const timeStr = date.toISOString().substr(14, 5);
    return <TextContent>{timeStr}</TextContent>
}

const WeakestContent = ({game}) => {
    const weakest = game.players.find(player => player.id === game.weakest);
    const strongest = game.players.find(player => player.id === game.strongest);

    return <BlockContent>
        {game.state === "weakest_reveal" && <TextContent>Weakest reveal</TextContent>}
        <div>{"Weakest: "}{weakest.name}</div>
        <div>{"Strongest: "}{strongest.name}</div>
        <List className={styles.players}>
            {game.players.filter(player => !player.is_weak).map(player =>
                <ListItem key={player.id} className={styles.player}>
                    <div>{player.weak ? game.players.find(p => p.id === player.weak).name : "⸻"}</div>
                    <div>{player.name}</div>
                </ListItem>
            )}
        </List>
    </BlockContent>
}

const Players = ({game}) => {
    return <List className={styles.players}>
        {game.players.map(player =>
            <ListItem key={player.id} className={css(
                styles.player,
                player.id === game.answerer && styles.selected,
                player.is_weak && styles.weak
            )}>
                {player.name}
            </ListItem>
        )}
    </List>
};

const useStateContent = (game) => {
    switch (game.state) {
        case "intro":
            return <TextContent>Intro</TextContent>;
        case "round":
            return <TextContent>Round {game.round}</TextContent>
        case "questions":
        case "final_questions":
            return <Question game={game}/>
        case "weakest_choose":
            return <WeakestContent game={game}/>;
        case "weakest_reveal":
            return <WeakestContent game={game}/>;
        case "final":
            return <TextContent>Choose player to start</TextContent>;
        case "end":
            return <TextContent>Game over</TextContent>;
    }
    return "";
};

const useControl = (game) => {
    const onNextClick = () => WEAKEST_API.next_state(game.state);
    const onAnswerClick = (isCorrect) => WEAKEST_API.answer_correct(isCorrect);
    const onBankClick = () => WEAKEST_API.save_bank();
    const onFinalAnswererClick = (playerId) => WEAKEST_API.select_final_answerer(playerId);
    const onGongClick = () => WEAKEST_API.intercom("gong");

    const buttons = [<Button onClick={() => onGongClick()}>Gong</Button>];
    switch (game.state) {
        case "questions":
        case "final_questions":
            buttons.push([
                <Button onClick={() => onBankClick()}>Bank</Button>,
                <Button onClick={() => onAnswerClick(false)}>Wrong</Button>,
                <Button onClick={() => onAnswerClick(true)}>Right</Button>
            ]);
            break;
        case "final":
            buttons.push(game.players.filter(player => !player.is_weak).map(player =>
                    <Button key={player.id} onClick={() => onFinalAnswererClick(player.id)}>{player.name}</Button>,
                ));
            break;
        case "weakest_choose":
        case "end":
            break;
        default:
            buttons.push(<Button onClick={onNextClick}>Next</Button>);
    }
    return buttons;
};

const WeakestAdmin = () => {
    const game = useGame(WEAKEST_API, (game) => {}, (message) => {});
    const [connected, setConnected] = useAuth(WEAKEST_API);
    const history = useHistory();

    const onSoundStop = () => WEAKEST_API.intercom("sound_stop");
    const onLogout = () => {
        WEAKEST_API.logout();
        history.push("/");
    };

    if (!connected) return <AdminAuth api={WEAKEST_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;

    return <GameAdmin>
        <Header gameName={"The Weakest"} token={game.token} stateName={getStatusName(game.state)}>
            <OvalButton onClick={onSoundStop}><i className="fas fa-volume-mute"/></OvalButton>
            <ButtonLink to={"/"}>Home</ButtonLink>
            <ButtonLink to={"/weakest/view"}>View</ButtonLink>
            <Button onClick={onLogout}>Logout</Button>
        </Header>
        <Content rightPanel={<Players game={game}/>}>{useStateContent(game)}</Content>
        <Footer>
            <FooterItem>{/* empty */}</FooterItem>
            <FooterItem>{useControl(game)}</FooterItem>
        </Footer>
    </GameAdmin>
}

export default WeakestAdmin;