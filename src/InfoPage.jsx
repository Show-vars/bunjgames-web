import React from "react";
import { Link } from "react-router-dom";

const InfoPage = () => {
    return <div>
        <Link to={'/whirligig/admin'}>Admin </Link>
        <Link to={'/whirligig/view'}>View </Link>
        <Link to={'/whirligig/client'}>Client </Link>
    </div>
}

export default InfoPage;
