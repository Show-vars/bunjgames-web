import React, {useState, useEffect, useRef} from "react";
import styles from "./Auth.scss";
import {Loading, Toast} from "./Essentials.jsx";
import {toast} from "react-toastify";

const GameAuth = ({children}) => (
    <div className={styles.auth}>
        {children}
        <Toast/>
    </div>
)

const AuthForm = ({title, children}) => (
    <div className={styles.form}>
        <div className={styles.title}>{title}</div>
        <div>
            {children}
        </div>
    </div>
)

const GameCreateForm = ({api, setConnected}) => {
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);

    const onSubmit = () => {
        if (inputFile.current.files.length === 0) {
            toast.dark("Please select game file");
            return;
        }
        setLoading(true);
        api.createGame(inputFile.current).then(() => {
            api.connect().then(() => {
                setConnected(true);
            })
        }).catch((e) => {
            setLoading(false);
            if(!e.response) {
                toast.dark(e.message);
            } else if (e.response.status === 400 && e.response.data) {
                toast.dark(e.response.data.detail);
            } else {
                toast.dark("Error while creation game");
            }
        });
    };

    return <AuthForm title={"Create game"}>
        <input ref={inputFile} type="file" disabled={loading}/>
        <div className={[styles.button, loading && styles.loadingButton].join(' ')} onClick={onSubmit}>Create</div>
    </AuthForm>
}

const GameOpenForm = ({api, setConnected}) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    const onSubmit = () => {
        if (!token) {
            toast.dark("Please enter token");
            return;
        }
        setLoading(true);

        api.connect(token).then(() => {
            setConnected(true);
        }).catch(() => {
            setLoading(false);
            toast.dark("Game not found");
        });
    };

    return <AuthForm title={"Open game"}>
        <input type="text" placeholder={"token"} value={token} onChange={e => setToken(e.target.value)} disabled={loading}/>
        <div className={[styles.button, loading && styles.loadingButton].join(' ')} onClick={onSubmit}>Open</div>
    </AuthForm>
}

const RegisterPlayerForm = ({api, setConnected}) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [name, setName] = useState("");

    const onSubmit = () => {
        if (!token || !name) {
            toast.dark("Please enter token and name");
            return;
        }
        setLoading(true);


        api.registerPlayer(token, name).then(() => {
            api.connect().then(() => {
                setConnected(true);
            })
        }).catch((e) => {
            setLoading(false);
            if(!e.response) {
                toast.dark(e.message);
            } else if (e.response.status === 400 && e.response.data) {
                toast.dark(e.response.data.detail);
            } else {
                toast.dark("Error while registering player");
            }
        });
    };

    return <AuthForm  title={"Register player"}>
        <input type="text" maxLength={20} placeholder={"name"} value={name} onChange={e => setName(e.target.value)} disabled={loading}/>
        <input type="text" placeholder={"token"} value={token} onChange={e => setToken(e.target.value)} disabled={loading}/>
        <div className={[styles.button, loading && styles.loadingButton ].join(' ')} onClick={onSubmit}>Register</div>
    </AuthForm>
}

const AdminAuth = ({api, setConnected}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(api.hasToken()) {
            api.connect().then(() => {
                setConnected(true);
            }).catch(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) return <Loading/>

    return <GameAuth>
        <GameCreateForm api={api} setConnected={setConnected}/>
        <GameOpenForm api={api} setConnected={setConnected}/>
    </GameAuth>
}

const PlayerAuth = ({api, setConnected}) => {
    const [loading, setLoading] = useState(true);

    const checkGame = (game) => {
        return !game.players || !api.playerId || game.players.find(p => p.id === api.playerId)
    }

    useEffect(() => {
        if(api.hasToken() && api.hasPlayerId()) {
            api.connect(api.token, checkGame).then(() => {
                setConnected(true);
            }).catch(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, []);

    if(loading) return <Loading/>

    return <GameAuth>
        <RegisterPlayerForm api={api} setConnected={setConnected}/>
    </GameAuth>
}

export {GameAuth, AuthForm, AdminAuth, PlayerAuth};
