import React from "react";
import ReactDOM from "react-dom";
import s from './App.scss';
import { HashRouter } from 'react-router-dom'
import { Switch, Route } from "react-router";
import InfoPage from "./InfoPage.jsx";
import WhirligigAdmin from "./whirligig/Admin.jsx";
import WhirligigView from "./whirligig/View.jsx";
import WhirligigClient from "./whirligig/Client.jsx";
import ClientApi from "./ClientApi.js";

const WhirligigApi = new ClientApi(BunjGamesConfig.WHIRLIGIG_API_ENDPOINT);
window.WHIRLIGIG_API = WhirligigApi;

const App = () => {
    return <HashRouter>
        <Switch>
            <Route exact path="/" component={InfoPage}/>
            <Route exact path="/whirligig/admin" component={WhirligigAdmin}/>
            <Route exact path="/whirligig/view" component={WhirligigView}/>
            <Route exact path="/whirligig/client" component={WhirligigClient}/>
        </Switch>
    </HashRouter>
}

ReactDOM.render(<App />, document.getElementById("root"));
