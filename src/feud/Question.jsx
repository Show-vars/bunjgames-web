import React, {useEffect, useState} from "react";
import styles from "./Question.scss";

const Question = ({question, className, onSelect}) => {
    const answers = []
    question.answers.forEach((answer, index) => {
        answers.push(
            <div key={'answer_' + index}
                 onClick={() => onSelect(answer.id)}
                 className={css(
                    answer.is_opened && styles.opened,
                    !answer.is_opened && onSelect ? styles.active : null,
                    styles.cell, styles.answer
                 )}
            >
                {answer.text}
            </div>
        );
        answers.push(
            <div key={'value_' + index} className={css(styles.cell, styles.value)}>
                {answer.value}
            </div>
        );
    });

    return <div className={css(className, styles.grid)}>
        <div className={css(styles.cell, styles.question)}>{question.text}</div>
        {answers}
    </div>
};

export {Question}