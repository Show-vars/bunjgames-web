import React, {useState, useEffect, useRef} from "react";
import styles from "./Auth.scss";
import {Loading} from "../Common.jsx";

const GameCreate = ({setConnected}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);


    const onCreate = () => {
        setLoading(true);

        WHIRLIGIG_API.createGame(inputFile.current).then(() => {
            WHIRLIGIG_API.connect().then(() => {
                setConnected(true);
            })
        }).catch((e) => {
            alert("Error");
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

const GameOpen = ({setConnected}) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    const onOpen = () => {
        setLoading(true);

        WHIRLIGIG_API.connect(token).then(() => {
            setConnected(true);
        }).catch(() => {
            setLoading(false);
            alert("Error");
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

const Auth = ({setConnected}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       if(WHIRLIGIG_API.hasToken()) {
           WHIRLIGIG_API.connect().then(() => {
               setConnected(true);
           }).catch(() => {
               setLoading(false)
           })
       } else {
           setLoading(false);
       }
    }, []);

    if(loading) return <Loading/>;

    return <div className={styles.auth}>
        <GameCreate setConnected={setConnected}/>
        <GameOpen setConnected={setConnected}/>
    </div>
}

export default Auth;