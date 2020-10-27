import React from "react";
import ReactPlayer from "react-player";
import styles from "./Common.scss";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const getMediaUrl = (game, url) => url.startsWith("/") ? `${BunjGamesConfig.MEDIA}${game.name}/${game.token}${url}` : url;

const ImagePlayer = ({game, url}) => (
    <img src={getMediaUrl(game, url)} alt="Image"/>
);

const AudioPlayer = ({game, url, controls, autoPlay}) => (
    <ReactPlayer controls={controls} playing={autoPlay} url={getMediaUrl(game, url)} width="100%" height="100%"/>
);

const VideoPlayer = ({game, url, controls, autoPlay}) => (
    <ReactPlayer controls={controls} playing={autoPlay} url={getMediaUrl(game, url)} width="100%" height="100%"/>
);

const Loading = () => (
    <div className={styles.loadingScreen}>Loading...</div>
)

const Toast = () => (
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
)

export {
    ImagePlayer, AudioPlayer, VideoPlayer, Loading, Toast
}