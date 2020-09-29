import React, {useState, useEffect, useRef} from "react";
import { useHistory } from "react-router-dom";
import styles from "./Auth.scss";
import {Link} from "react-router-dom";

const GameCreate = ({onInput, onOpen}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);
    const history = useHistory();


    const onCreate = () => {
        setLoading(true);

        WHIRLIGIG_API.createGame(inputFile.current).then(() => {
            history.push("/whirligig/admin");
        })
    };
    return <div className={styles.gameCreate}>
        <div className={styles.title}>Create game</div>
        <div>
            <input ref={inputFile} type="file" disabled={loading}/>
            <div className={[styles.button, loading && styles.loading ].join(' ')} onClick={onCreate}>Create</div>
        </div>
    </div>
}

const GameOpen = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    const onOpen = () => {
        setLoading(true);

        WHIRLIGIG_API.openGame(token).then((response) => {
            history.push("/whirligig/view");
        }).catch((error) => {
            console.log(error);
            setLoading(false);

            alert("Not Wonderful!");
        });
    };

    return <div className={styles.gameOpen}>
        <div className={styles.title}>Open game</div>
        <div>
            <input type="text" value={token} onChange={e => setToken(e.target.value)} disabled={loading}/>
            <div className={[styles.button, loading && styles.loading ].join(' ')} onClick={onOpen}>Open</div>
        </div>
    </div>
}

const Auth = () => {
    const history = useHistory();

    useEffect(() => {
       if(WHIRLIGIG_API.hasToken()) {
           WHIRLIGIG_API.getGame(WHIRLIGIG_API.token).then(() => {
               history.push("/whirligig/admin");
           })
       }
    }, []);

    return <div className={styles.auth}>
        <GameCreate/>
        <GameOpen/>
    </div>
}

export default Auth;