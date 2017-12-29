import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import {
	updatePlayerStatus,
	updateTime
} from "../../../../redux/actions/player";

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
	}

	componentDidUpdate(event) {
		switch (this.props.player.status) {
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

	playPauseSwitch() {}

	seekToClip() {}

	playVideo() {
		console.log("play video");
		clearInterval(this.state.timeInterval);
		this.props.updatePlayerStatus("waiting");

		// fake delay needed for the video switch
		setTimeout(() => {
			this.state.player.playVideo();
			this.props.updatePlayerStatus("playing");
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
		this.props.updatePlayerStatus("stopped");
	}

	seekVideo() {
		console.log("seek to");
		if (this.state.player) {
			clearInterval(this.state.timeInterval);
			const seekToSeconds = this.props.player.seekToTime;
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
		this.props.updatePlayerStatus("playing");
		this.startTimeInterval();
	}

	onPause(event) {
		console.log("onPause");
		clearInterval(this.state.timeInterval);
		this.props.updatePlayerStatus("paused");
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
		this.props.updatePlayerStatus("cleared");
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
			"video-loaded": this.props.player.playingVideoId
		});

		return (
			<div className={videoClasses}>
				<YouTube
					videoId={this.props.player.playingVideoId}
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
	return { player: state.player };
}

export default connect(mapStateToProps, {
	updatePlayerStatus,
	updateTime
})(YoutubePlayer);
