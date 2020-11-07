import React from "react";
import ReactDOM from "react-dom";
import {Howler} from 'howler';
import styles from './App.scss';
import { BrowserRouter, withRouter } from 'react-router-dom'
import { Switch, Route } from "react-router";
import InfoPage from "info/InfoPage";
import WhirligigAdmin from "./whirligig/Admin.jsx";
import WhirligigView from "./whirligig/View.jsx";
import WhirligigApi from "./whirligig/WhirligigApi.js";
import JeopardyApi from "./jeopardy/JeopardyApi.js";
import WeakestApi from "./weakest/WeakestApi.js";
import JeopardyAdmin from "./jeopardy/Admin.jsx";
import JeopardyView from "./jeopardy/View.jsx";
import JeopardyClient from "./jeopardy/Client.jsx";
import WeakestAdmin from "./weakest/Admin.jsx";
import WeakestView from "./weakest/View.jsx";
import WeakestClient from "./weakest/Client.jsx";

require("./Polyfils.js");

window.WHIRLIGIG_API = new WhirligigApi(BunjGamesConfig.WHIRLIGIG_API_ENDPOINT, BunjGamesConfig.WHIRLIGIG_WS_ENDPOINT);
window.JEOPARDY_API = new JeopardyApi(BunjGamesConfig.JEOPARDY_API_ENDPOINT, BunjGamesConfig.JEOPARDY_WS_ENDPOINT);
window.WEAKEST_API = new WeakestApi(BunjGamesConfig.WEAKEST_API_ENDPOINT, BunjGamesConfig.WEAKEST_WS_ENDPOINT);

Howler.volume(0.5);

const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route exact path="/" component={InfoPage}/>
            <Route exact path="/whirligig/admin" component={WhirligigAdmin}/>
            <Route exact path="/whirligig/view" component={WhirligigView}/>

            <Route exact path="/jeopardy/admin" component={JeopardyAdmin}/>
            <Route exact path="/jeopardy/view" component={JeopardyView}/>
            <Route exact path="/jeopardy/client" component={JeopardyClient}/>

            <Route exact path="/weakest/admin" component={WeakestAdmin}/>
            <Route exact path="/weakest/view" component={WeakestView}/>
            <Route exact path="/weakest/client" component={WeakestClient}/>
        </Switch>
    </BrowserRouter>
};

ReactDOM.render(<App />, document.getElementById("root"));
