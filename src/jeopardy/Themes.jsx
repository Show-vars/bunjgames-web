import React, {useEffect, useState} from "react";
import styles from "./Themes.scss";

const Theme = ({theme, active=false}) => (
    <div className={(active) ? css(styles.button, styles.question) : styles.theme}>{theme.name}</div>
);

const Question = ({question}) => (
    <div className={css(styles.button, styles.question)}>{question.value}</div>
);

const ThemesList = ({game}) => (
    <div className={styles.themesList}>
        {game.categories.map((theme, index) => <Theme active={true} key={index} theme={theme}/>)}
    </div>
);

const ThemesGrid = ({game}) => (
    <div className={styles.themesGrid}>
        {game.categories.map((theme, index) => <Theme key={index} theme={theme}/>)}
    </div>
);

const QuestionsGrid = ({game}) => {
    let items = [];
    game.categories.forEach((theme, categoryIndex) => {
        items.push(<Theme key={categoryIndex} theme={theme}/>);
        theme.questions.forEach((question, questionIndex) =>
            items.push(<Question key={categoryIndex + "_" + questionIndex} question={question}/>)
        );
    });

    return <div className={styles.questionsGrid}>
        {items}
    </div>
};

export {ThemesList, ThemesGrid, QuestionsGrid}