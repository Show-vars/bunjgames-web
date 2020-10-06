import React, {useState, useEffect, useRef} from "react";
import { useHistory } from "react-router-dom";
import styles from "./Auth.scss";

const GameCreate = ({onInput, onOpen}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);
    const history = useHistory();


    const onCreate = () => {
        setLoading(true);

        WHIRLIGIG_API.createGame(inputFile.current).then(() => {
            WHIRLIGIG_API.connect().then(() => {
                history.push("/whirligig/admin");
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

        WHIRLIGIG_API.connect(token).then(() => {
            history.push("/whirligig/view");
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

const Auth = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       if(WHIRLIGIG_API.hasToken()) {
           WHIRLIGIG_API.connect().then(() => {
               if(history.length > 0) {
                   history.goBack();
               } else {
                   history.push("/whirligig/admin");
               }
           }).catch(() => {
               setLoading(false)
           })
       } else {
           setLoading(false);
       }
    }, []);

    if(loading) return "LoAdInG";

    return <div className={styles.auth}>
        <GameCreate/>
        <GameOpen/>
    </div>
}

export default Auth;