import React, {useState, useEffect} from "react";
import styles from "./Admin.scss";
import {Link} from "react-router-dom";


const Header = () => (
    <div className={styles.header}>
        <div className={styles.logo}>Admin dashboard</div>
        <div className={styles.nav}>
            <Link className={styles.button} to={"/"}>Home</Link>
            <Link className={styles.button} to={"/whirligig/view"}>View</Link>
        </div>
    </div>
);

const BigQuestion = ({question}) => {
    const {
        description, text, image, audio, video,
        answer_description, answer_text, answer_image, answer_audio, answer_video
    } = question;

    return <div>
        <div>Question: {description}</div>
        <div>Answer: {answer_description}</div>
    </div>
}

const BigItem = ({item, question}) => {
    const {name, description, type} = item;

    return <div className={styles.bigitem}>
        <div>Name: {name}</div>
        <div>Description: {description}</div>
        <div>Type: {type}</div>
        <BigQuestion question={question}/>
    </div>
};

const ItemQuestion = ({question, single}) => {
    const {number, is_processed, description, answer_description} = question;
    const checkbox = (is_processed)
        ? <i className="fas fa-check-square"/>
        : <i className="fas fa-square"/>

    return <div className={styles.question}>
        {single || <div>{number}: {checkbox}</div>}
        <div>Question: {description}</div>
        <div>Answer: {answer_description}</div>
    </div>
};

const ItemQuestions = ({questions}) => (
    <div className={styles.questions}>
        {questions.map((q, k) => (
            <ItemQuestion key={k} question={q} single={questions.length <= 1}/>
        ))}
    </div>
);

const Item = ({item}) => {
    let [isSelected, select] = useState(false);
    const {name, description, type, is_processed} = item;

    const checkbox = (is_processed)
        ? <i className="fas fa-check-square"/>
        : <i className="fas fa-square"/>

    return <div className={styles.item}>
        <div className={styles.short} onClick={() => select(!isSelected)}>
            <div className={styles.desc}>{name}: {description}</div>
            <div className={styles.processed}>{checkbox}</div>
        </div>
        {isSelected && <ItemQuestions questions={item.questions}/>}
    </div>;
};

const Items = ({items}) => (
    <div className={styles.list}>
        {items.map((item, key) => (
            <Item key={key} item={item}/>
        ))}
    </div>
);

const Content = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        WHIRLIGIG_API.getGame("OR69W9").then((result) => {
            setItems(result.data.items);
        })
    });

    return (
        <div className={styles.content}>
            {items.length > 0 && <BigItem item={items[0]} question={items[0].questions[0]}/>}
            <Items items={items}/>
        </div>)
};

const Footer = () => (
    <div className={styles.footer}>
        <div className={styles.score}>0 : 0</div>
        <div className={styles.state}>Started</div>
        <div className={styles.timer}>
            <div className={styles.time}>0:32</div>
            <div className={styles.button}>Pause</div>
        </div>
        <div className={[styles.button, styles.next].join(' ')}>Next</div>
    </div>

);

const WhirligigAdmin = () => {
    return <div className={styles.admin}>
        <Header/>
        <Content/>
        <Footer/>
    </div>
}

export default WhirligigAdmin;
