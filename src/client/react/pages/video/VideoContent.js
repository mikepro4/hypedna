import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";

import ButtonBase from "material-ui/ButtonBase";
import PlayCircleOutline from "material-ui-icons/PlayCircleOutline";
import PauseCircleOutline from "material-ui-icons/PauseCircleOutline";
import IconButton from "material-ui/IconButton";

import VideoTracks from "./VideoTracks";
import ProgressBar from "../../components/common/player/ProgressBar";

import { formatTime } from "../../../utils/timeFormatter";
import { updateCurrentVideo } from "../../../redux/actions/";

const styles = theme => ({
	iconClass: {
		width: "28px",
		height: "28px"
	},
	root: {
		transition: "all .1s",

		"&:hover": {
			color: "#000000",
			background: "rgba(0,0,0,0.02)"
		},

		"&:active": {
			color: "#ccc"
		}
	},
	button: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		textAlign: "left",
		width: "100%",
		justifyContent: "left",
		fontWeight: 300,
		paddingRight: "40px"
	}
});

class VideoContent extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className="video-content-container">
				<div className="video-timeline-container">
					{this.props.video.contentDetails && this.props.player ? (
						<div className="video-progress-elements">
							<div className="video-progress-time">
								<div className="time-wrapper">
									<div className="time-current-time">
										{formatTime(this.props.player.currentTime)}
									</div>
									<div className="time-divider">/</div>
									<div className="time-duration">
										{formatTime(this.props.video.contentDetails.duration)}
									</div>
								</div>
								<div className="track-global-play-controls">
									{this.props.currentVideo.playerAction == "paused" ||
									this.props.currentVideo.playerAction == "stopped" ||
									this.props.currentVideo.playerAction == "pause" ||
									this.props.currentVideo.playerAction == "play" ||
									this.props.currentVideo.playerAction == "waiting" ? (
										<IconButton
											className={this.props.classes.iconClass}
											onClick={() => {
												this.props.updateCurrentVideo(
													this.props.video.googleId,
													"play"
												);
											}}
										>
											<PlayCircleOutline />
										</IconButton>
									) : (
										""
									)}

									{this.props.currentVideo.playerAction == "playing" ? (
										<IconButton
											className={this.props.classes.iconClass}
											onClick={() => {
												this.props.updateCurrentVideo(
													this.props.video.googleId,
													"pause"
												);
											}}
										>
											<PauseCircleOutline />
										</IconButton>
									) : (
										""
									)}
								</div>
							</div>
							<ProgressBar
								duration={moment
									.duration(this.props.video.contentDetails.duration)
									.asSeconds()}
							/>
						</div>
					) : (
						""
					)}
				</div>
				<VideoTracks />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.auth,
	player: state.player,
	video: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching,
	currentVideo: state.currentVideo
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			updateCurrentVideo
		})(VideoContent)
	)
);
