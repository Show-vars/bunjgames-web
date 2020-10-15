import React from "react";
import ReactDOM from "react-dom";
import s from './App.scss';
import { BrowserRouter, withRouter } from 'react-router-dom'
import { Switch, Route } from "react-router";
import InfoPage from "./InfoPage.jsx";
import WhirligigAuth from "./whirligig/Auth.jsx";
import WhirligigAdmin from "./whirligig/Admin.jsx";
import WhirligigView from "./whirligig/View.jsx";
import WhirligigClient from "./whirligig/Client.jsx";
import WhirligigApi from "./whirligig/WhirligigApi.js";

window.WHIRLIGIG_API = new WhirligigApi(BunjGamesConfig.WHIRLIGIG_API_ENDPOINT, BunjGamesConfig.WHIRLIGIG_WS_ENDPOINT);
//window.JEOPARDY_API = new JeopardyClient(BunjGamesConfig.JEOPARDY_API_ENDPOINT, BunjGamesConfig.JEOPARDY_WS_ENDPOINT);

Math.clamp = (x, a, b) => x > a ? a : x < b ? b : x;
Math.randomRange = (min, max) => Math.random() * (max - min) + min;
Math.randomRangeInt = (min, max) => Math.round(Math.randomRange(min, max));
Math.angleNormalize = (a) => {
    const normalized = a % (2 * Math.PI);
    return normalized < 0 ? 2 * Math.PI + normalized : normalized
}
Math.normalize = (a, norm) => {
    const normalized = a % norm;
    return normalized < 0 ? norm + normalized : normalized
}

window.css = (...a) => a.join(" ");

const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route exact path="/" component={InfoPage}/>
            <Route exact path="/whirligig/auth" component={WhirligigAuth}/>
            <Route exact path="/whirligig/admin" component={WhirligigAdmin}/>
            <Route exact path="/whirligig/view" component={WhirligigView}/>
            <Route exact path="/whirligig/client" component={WhirligigClient}/>
        </Switch>
    </BrowserRouter>
};

ReactDOM.render(<App />, document.getElementById("root"));
