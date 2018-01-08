import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import {
	updatePlayerStatus,
	updateTime
} from "../../../../redux/actions/player";
import { updateCurrentVideo } from "../../../../redux/actions/";

class YoutubePlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			player: null,
			timeInterval: null
		};
	}

	onReady(event) {
		this.setState({
			player: event.target
		});
	}

	onStateChange(event) {
		clearInterval(this.state.timeInterval);
		if (this.props.currentVideo.videoId != this.props.player.playingVideoId) {
			this.clearTime();
		}
	}

	componentDidUpdate(event) {
		switch (this.props.currentVideo.playerAction) {
			case "play":
				return this.playVideo();
			case "pause":
				return this.pauseVideo();
			case "stop":
				return this.stopVideo();
			case "seek":
				return this.seekVideo();
		}
	}

	playPauseSwitch() {
		switch (this.props.currentVideo.playerAction) {
			case "playing":
				return this.pauseVideo();
			case "paused":
				return this.playVideo();
			case "stopped":
				return this.playVideo();
			case undefined:
				return this.playVideo();
			default:
				return this.playVideo();
		}
	}

	seekToClip() {}

	playVideo() {
		console.log("play video");
		clearInterval(this.state.timeInterval);
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "waiting");

		// fake delay needed for the video switch
		setTimeout(() => {
			this.state.player.playVideo();
			this.props.updateCurrentVideo(this.props.currentVideo.videoId, "playing");
		}, 1);
	}

	pauseVideo() {
		console.log("pause video");
		this.state.player.pauseVideo();
	}

	stopVideo() {
		this.clearTime();
		console.log("stop video");
		this.state.player.stopVideo();
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "stopped");
	}

	seekVideo() {
		console.log("seek to");
		if (this.state.player) {
			clearInterval(this.state.timeInterval);
			const seekToSeconds = this.props.currentVideo.seconds;
			this.playVideo();

			// fake delay needed for the video switch/seek
			setTimeout(() => {
				this.state.player.seekTo(seekToSeconds);
			}, 2);
		}
	}

	onEnd() {
		this.stopVideo();
	}

	onPlay(event) {
		console.log("onPlay");
		this.setState({ timeInterval: null });
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "playing");
		this.startTimeInterval();
	}

	onPause(event) {
		console.log("onPause");
		clearInterval(this.state.timeInterval);
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "paused");
	}

	startTimeInterval() {
		const timeInterval = setInterval(() => {
			this.props.updateTime(this.state.player.getCurrentTime());
		}, 100);

		this.setState({ timeInterval });
	}

	componentWillMount() {
		clearInterval(this.state.timeInterval);
	}

	componentWillUnmount() {
		clearInterval(this.state.timeInterval);
		this.props.updateCurrentVideo(null, "cleared");
	}

	clearTime() {
		this.props.updateTime(0);
	}

	onStop() {
		this.props.updateTime(0);
	}

	render() {
		const videoPlayerOptions = {
			height: this.props.height ? this.props.height : "170",
			width: this.props.width ? this.props.width : "270",
			playerVars: {
				controls: 0,
				showinfo: 0,
				modestbranding: 1
			}
		};

		let videoClasses = classnames({
			"video-container": true,
			"video-loaded": this.props.currentVideo.videoId
		});

		return (
			<div className={videoClasses}>
				<YouTube
					videoId={this.props.currentVideo.videoId}
					opts={videoPlayerOptions}
					onReady={this.onReady.bind(this)}
					onPlay={this.onPlay.bind(this)}
					onStop={this.onStop.bind(this)}
					onPause={this.onPause.bind(this)}
					onEnd={this.onEnd.bind(this)}
					onStateChange={this.onStateChange.bind(this)}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { player: state.player, currentVideo: state.currentVideo };
}

export default connect(mapStateToProps, {
	updateCurrentVideo,
	updateTime
})(YoutubePlayer);
