import React from "react";
import ReactDOM from "react-dom";
import styles from './App.scss';
import { BrowserRouter, withRouter } from 'react-router-dom'
import { Switch, Route } from "react-router";
import InfoPage from "./InfoPage.jsx";
import WhirligigAuth from "./whirligig/Auth.jsx";
import WhirligigAdmin from "./whirligig/Admin.jsx";
import WhirligigView from "./whirligig/View.jsx";
import WhirligigClient from "./whirligig/Client.jsx";
import WhirligigApi from "./whirligig/WhirligigApi.js";
import JeopardyApi from "./jeopardy/JeopardyApi.js";
import JeopardyAdmin from "./jeopardy/Admin.jsx";
import JeopardyAdminAuth from "./jeopardy/AdminAuth.jsx";

require("./Polyfils.js");

window.WHIRLIGIG_API = new WhirligigApi(BunjGamesConfig.WHIRLIGIG_API_ENDPOINT, BunjGamesConfig.WHIRLIGIG_WS_ENDPOINT);
window.JEOPARDY_API = new JeopardyApi(BunjGamesConfig.JEOPARDY_API_ENDPOINT, BunjGamesConfig.JEOPARDY_WS_ENDPOINT);

const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route exact path="/" component={InfoPage}/>
            <Route exact path="/whirligig/auth" component={WhirligigAuth}/>
            <Route exact path="/whirligig/admin" component={WhirligigAdmin}/>
            <Route exact path="/whirligig/view" component={WhirligigView}/>
            <Route exact path="/whirligig/client" component={WhirligigClient}/>

            <Route exact path="/jeopardy/admin/auth" component={JeopardyAdminAuth}/>
            <Route exact path="/jeopardy/admin" component={JeopardyAdmin}/>
        </Switch>
    </BrowserRouter>
};

ReactDOM.render(<App />, document.getElementById("root"));
