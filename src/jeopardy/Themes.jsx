import React, {useEffect, useState} from "react";
import styles from "./Themes.scss";

const Theme = ({theme, onSelect, active = false}) => (
    <div className={css(active && styles.active, styles.theme)}
         onClick={() => !theme.is_removed && onSelect(theme.id)}>
        <div>{!theme.is_removed && theme.name}</div>
    </div>
);

const Question = ({question, onSelect}) => (
    <div className={css(!question.is_processed && styles.active, styles.question)}
         onClick={() => !question.is_processed && onSelect(question.id)}>
        <div>{!question.is_processed && question.value}</div>
    </div>
);

const ThemesList = ({game, onSelect, active = false}) => (
    <div className={styles.themesList}>
        {game.themes.map((theme, index) => <Theme onSelect={onSelect} active={active} key={index} theme={theme}/>)}
    </div>
);

const ThemesGrid = ({game}) => (
    <div className={styles.themesGrid}>
        {game.themes.map((theme, index) => <Theme key={index} theme={theme}/>)}
    </div>
);

const QuestionsGrid = ({game, selectedId, onSelect}) => {
    let items = [];
    game.themes.forEach((theme, themeIndex) => {
        items.push(<Theme key={themeIndex} theme={theme}/>);
        theme.questions.forEach((question, questionIndex) =>
            items.push(<Question
                onSelect={onSelect}
                key={themeIndex + "_" + questionIndex}
                question={question}
            />)
        );
    });

    return <div className={styles.questionsGrid}>
        {items}
    </div>
};

export {ThemesList, ThemesGrid, QuestionsGrid}