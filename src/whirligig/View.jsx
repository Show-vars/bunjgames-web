import React from "react";
import styles from "./View.scss";


const Text = ({text}) => {
    return <div className={styles.text}>{text}</div>
}

const Image = ({url}) => {
    return <img
        className={styles.image}
        src={url}
        alt={'Error'}
    />
}

const Audio = ({url}) => {
    return <source
        src={url}
        type='audio/mpeg'
    />
}

const Content = () => {
    return <div className={styles.content}>
        <Image url={'https://cdn.jpegmini.com/user/images/slider_puffin_jpegmini_mobile.jpg'}/>
        <Audio url={''}/>
    </div>
}

const WhirligigView = () => {
    return <div className={styles.view}>
        <Content/>
    </div>
}

export default WhirligigView;
