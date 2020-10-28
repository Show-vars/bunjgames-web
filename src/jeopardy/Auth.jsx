import React, {useState, useEffect, useRef} from "react";
import styles from "./Auth.scss";
import {Loading, Toast} from "../Common.jsx";
import {toast} from "react-toastify";

const GameCreate = ({setConnected}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);

    const onCreate = () => {
        setLoading(true);

        JEOPARDY_API.createGame(inputFile.current).then(() => {
            JEOPARDY_API.connect().then(() => {
                setConnected(true);
            })
        }).catch((e) => {
            setLoading(false);
            if (e.response.status === 400 && e.response.data) {
                toast.dark(e.response.data.detail);
            } else {
                toast.dark("Error while creation game");
            }
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

        JEOPARDY_API.connect(token).then(() => {
            setConnected(true);
        }).catch(() => {
            setLoading(false);
            toast.dark("Game not found");
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

const RegisterPlayer = ({setConnected}) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [name, setName] = useState("");

    const onOpen = () => {
        setLoading(true);

        JEOPARDY_API.registerPlayer(token, name).then(() => {
            JEOPARDY_API.connect().then(() => {
                setConnected(true);
            })
        }).catch((e) => {
            setLoading(false);
            if (e.response.status === 400 && e.response.data) {
                toast.dark(e.response.data.detail);
            } else {
                toast.dark("Error while registering player");
            }
        });
    };

    return <div className={styles.gameOpen}>
        <div className={styles.title}>Register player</div>
        <div>
            <input type="text" placeholder={"name"} value={name} onChange={e => setName(e.target.value)} disabled={loading}/>
            <input type="text" placeholder={"token"} value={token} onChange={e => setToken(e.target.value)} disabled={loading}/>
            <div className={[styles.button, loading && styles.loading ].join(' ')} onClick={onOpen}>Register</div>
        </div>
    </div>
}

const AdminAuth = ({setConnected}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(JEOPARDY_API.hasToken()) {
            JEOPARDY_API.connect().then(() => {
                setConnected(true);
            }).catch(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) return <Loading/>

    return <div className={styles.auth}>
        <GameCreate setConnected={setConnected}/>
        <GameOpen setConnected={setConnected}/>
        <Toast/>
    </div>
}

const PlayerAuth = ({setConnected}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(JEOPARDY_API.hasToken() && JEOPARDY_API.hasPlayerId()) {
            JEOPARDY_API.connect().then(() => {
                setConnected(true);
            }).catch(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) return <Loading/>

    return <div className={styles.auth}>
        <RegisterPlayer setConnected={setConnected}/>
        <Toast/>
    </div>
}

export {AdminAuth, PlayerAuth};
