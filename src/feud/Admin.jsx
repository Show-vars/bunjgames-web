import React from "react";
import {useHistory} from "react-router-dom";

import {
    useGame,
    useAuth,
    Loading,
    Button,
    ButtonLink,
    VerticalList,
    ListItem,
    useTimer,
    OvalButton,
    TwoLineListItem,
    calcStateName
} from "common/Essentials"
import {BlockContent, Content, Footer, FooterItem, GameAdmin, Header, TextContent} from "common/Admin";
import {AdminAuth} from "common/Auth";

import styles from "feud/Admin.scss";
import {FinalQuestions, Question} from "feud/Question";


const states = [
    'waiting_for_teams',
    'intro',
    'round',
    'button',
    'answers',
    'answers_reveal',
    'final',
    'final_questions',
    'final_questions_reveal',
    'end'
];

const getStateName = (state) => {
    return calcStateName(state);
}

const Timer = () => {
    const time = useTimer(FEUD_API, () => FEUD_API.next_state("questions"));
    const date = new Date(0);
    date.setSeconds(time);
    const timeStr = date.toISOString().substr(14, 5);
    return <TextContent>{timeStr}</TextContent>
}

const Teams = ({game}) => {
    return <VerticalList className={styles.teams}>
        {game.teams.map(player =>
            <ListItem key={player.id} className={css(
                styles.team,
                player.id === game.answerer && styles.selected,
            )}>
                {player.name}
            </ListItem>
        )}
    </VerticalList>
};

const useStateContent = (game) => {
    const onAnswerClick = (answerId) => FEUD_API.answer(true, answerId);

    switch (game.state) {
        case "round":
            return <TextContent>Round {game.round}</TextContent>;
        case "button":
        case "answers":
        case "answers_reveal":
        case "final_questions":
            return <Question
                game={game} showHiddenAnswers={true} className={styles.question} onSelect={onAnswerClick}
            />;
        case "final_questions_reveal":
            return <FinalQuestions game={game} className={styles.question} />
        default:
            return <TextContent>{getStateName(game.state)}</TextContent>;
    }
};

const useControl = (game) => {
    const onNextClick = () => FEUD_API.next_state(game.state);
    const onSetAnswererClick = (teamId) => FEUD_API.set_answerer(teamId);
    const onWrongAnswerClick = () => FEUD_API.answer(false, 0);

    const onRepeatClick = () => FEUD_API.intercom("gong");

    const buttons = [];
    switch (game.state) {
        case "button":
            buttons.push(<Button key={2} onClick={() => onWrongAnswerClick()}>Wrong</Button>)
            buttons.push(game.teams.map(team =>
                <Button key={100 + team.id} onClick={() => onSetAnswererClick(team.id)}>{team.name}</Button>,
            ));
            break;
        case "answers":
            buttons.push(<Button key={2} onClick={() => onWrongAnswerClick()}>Wrong</Button>)
            break;
        case "final":
            buttons.push(<Button key={1} onClick={() => onRepeatClick()}>Repeat</Button>)
            buttons.push(<Button key={5} onClick={onNextClick}>Next</Button>);
            break;
        case "final_questions":
            buttons.push(<Button key={1} onClick={() => onRepeatClick()}>Repeat</Button>)
            buttons.push(<Button key={2} onClick={() => onWrongAnswerClick()}>Wrong</Button>)
            break;
        case "end":
            break;
        default:
            buttons.push(<Button key={5} onClick={onNextClick}>Next</Button>);
    }
    return buttons;
};

const gameScore = (game) => {
    if (game.teams.length < 2) return "";
    if (game.answerer && (game.state === 'final' || game.state === 'final_questions'
        || game.state === 'final_questions_reveal')) {
        const answerer = game.answerer && game.teams.find(t => t.id === game.answerer);
        return answerer.final_score;
    }
    return game.teams[0].score + " : " + game.teams[1].score;
}

const FeudAdmin = () => {
    const game = useGame(FEUD_API, (game) => {}, (message) => {});
    const [connected, setConnected] = useAuth(FEUD_API);
    const history = useHistory();

    const onSoundStop = () => FEUD_API.intercom("sound_stop");
    const onLogout = () => {
        FEUD_API.logout();
        history.push("/admin");
    };

    if (!connected) return <AdminAuth api={FEUD_API} setConnected={setConnected}/>;
    if (!game) return <Loading/>;

    return <GameAdmin>
        <Header gameName={"Friends Feud"} token={game.token} stateName={getStateName(game.state)}>
            <OvalButton onClick={onSoundStop}><i className="fas fa-volume-mute"/></OvalButton>
            <ButtonLink to={"/admin"}>Home</ButtonLink>
            <ButtonLink to={"/feud/view"}>View</ButtonLink>
            <Button onClick={onLogout}>Logout</Button>
        </Header>
        <Content rightPanel={<Teams game={game}/>}>
            {useStateContent(game)}
        </Content>
        <Footer>
            <FooterItem className={styles.gameScore}>{gameScore(game)}</FooterItem>
            <FooterItem>{useControl(game)}</FooterItem>
        </Footer>
    </GameAdmin>
}

export default FeudAdmin;
