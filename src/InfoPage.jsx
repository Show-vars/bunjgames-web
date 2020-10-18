import React from "react";
import { Link } from "react-router-dom";

const InfoPage = () => {
    return <div>
        <div>
            <Link to={'/whirligig/admin'}>Admin </Link>
            <Link to={'/whirligig/view'}>View </Link>
            <Link to={'/whirligig/client'}>Client </Link>
        </div>
        <div>
            <Link to={'/jeopardy/admin'}>Admin </Link>
            <Link to={'/jeopardy/view'}>View </Link>
            <Link to={'/jeopardy/client'}>Client </Link>
        </div>
    </div>
}

export default InfoPage;
