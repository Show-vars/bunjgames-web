import React, {useState, useEffect, useRef} from "react";
import { useHistory } from "react-router-dom";
import styles from "./AdminAuth.scss";
import {Loading} from "../Common.jsx";

const GameCreate = ({onInput, onOpen}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);
    const history = useHistory();


    const onCreate = () => {
        setLoading(true);

        JEOPARDY_API.createGame(inputFile.current).then(() => {
            JEOPARDY_API.connect().then(() => {
                history.push("/jeopardy/admin");
            })
        }).catch((e) => {
            console.log(e);
            alert("Wonderful but not exactly!");
        });
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

        JEOPARDY_API.connect(token).then(() => {
            history.push("/jeopardy/view");
        }).catch(() => {
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

const AdminAuth = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(JEOPARDY_API.hasToken()) {
            JEOPARDY_API.connect().then(() => {
                if(history.length > 0) {
                    history.goBack();
                } else {
                    history.push("/jeopardy/admin");
                }
            }).catch(() => {
                setLoading(false)
            })
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) return <Loading/>

    return <div className={styles.auth}>
        <GameCreate/>
        <GameOpen/>
    </div>
}

export default AdminAuth;