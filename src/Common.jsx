import React from "react";
import ReactPlayer from "react-player";

const getMediaUrl = (game, url) => url.startsWith("/") ? `${BunjGamesConfig.WHIRLIGIG_MEDIA}${game.token}${url}` : url;

const ImagePlayer = ({game, url}) => (
    <img src={getMediaUrl(game, url)} alt="Image"/>
);

const AudioPlayer = ({game, url, controls, autoPlay}) => (
    <ReactPlayer controls={controls} playing={autoPlay} url={getMediaUrl(game, url)} width="100%" height="100%"/>
);

const VideoPlayer = ({game, url, controls, autoPlay}) => (
    <ReactPlayer controls={controls} playing={autoPlay} url={getMediaUrl(game, url)} width="100%" height="100%"/>
);

export {
    ImagePlayer, AudioPlayer, VideoPlayer
}