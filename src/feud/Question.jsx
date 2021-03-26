import React, {useEffect, useState} from "react";
import styles from "./Question.scss";

const Question = ({game, showHiddenAnswers, className, onSelect}) => {
    const answerer = game.answerer && game.teams.find(t => t.id === game.answerer);
    const answers = [];
    let strikesContainersCount = 0;
    game.question.answers.forEach((answer, index) => {
        answers.push(
            <div key={'answer_' + index}
                 onClick={() => onSelect(answer.id)}
                 className={css(
                    answer.is_opened && styles.opened,
                    !answer.is_opened && onSelect ? styles.active : null,
                    styles.cell, styles.answer
                 )}
            >
                {(answer.is_opened || showHiddenAnswers) && answer.text}
            </div>
        );
        answers.push(
            <div
                key={'value_' + index}
                className={css(
                    answer.is_opened && styles.opened,
                    styles.cell, styles.value
                )}
            >
                {(answer.is_opened || showHiddenAnswers) && answer.value}
            </div>
        );
        if (answerer && strikesContainersCount < 3) {
            strikesContainersCount++;
            answers.push(
                <div
                    key={'strike_' + index}
                    className={css(
                        answerer && answerer.strikes >= strikesContainersCount && styles.active,
                        styles.cell, styles.strike
                    )}
                >
                    <i className="fas fa-times"/>
                </div>
            );
        } else {
            answers.push(
                <div key={'strike_' + index} />
            );
        }
    });

    return <div className={css(className, styles.grid)}>
        <div className={css(styles.cell, styles.question)}>{game.question.text}</div>
        {answers}
    </div>
};

const FinalQuestions = ({game, className}) => {
    const answers = [];
    game.final_questions.forEach((question, index) => {
        answers.push(
            <div key={'question_' + index} className={css(styles.cell, styles.answer, styles.opened)}>
                {question.text}
            </div>
        );
        let answer = question.answers.length ? question.answers[0] : null;
        answers.push(
            <div key={'answer_' + index} className={css(styles.cell, styles.answer, styles.opened)}>
                { answer ? answer.text : "-" }
            </div>
        );
        answers.push(
            <div key={'value_' + index} className={css(styles.cell, styles.value, styles.opened)}>
                { answer ? answer.value : "0" }
            </div>
        );
    });

    return <div className={css(className, styles.finalQuestionsGrid)}>
        {answers}
    </div>
}

export {Question, FinalQuestions}