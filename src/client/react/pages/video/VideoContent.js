import React, { Component } from "react";
import moment from "moment";
import ButtonBase from "material-ui/ButtonBase";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import PlayCircleOutline from "material-ui-icons/PlayCircleOutline";
import PauseCircleOutline from "material-ui-icons/PauseCircleOutline";
import classNames from "classnames";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem, MenuList } from "material-ui/Menu";
import Popover from "material-ui/Popover";
import {
	addTrack,
	deleteTrack,
	updateTrack
} from "../../../redux/actions/objectVideoActions";
import { formatTime } from "../../../utils/timeFormatter";
import ProgressBar from "../../components/common/player/ProgressBar";
import { updateCurrentVideo } from "../../../redux/actions/";
import ClipsTimeline from "./ClipsTimeline";

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
	state = {
		trackMenuOpen: false,
		anchorEl: null,
		activeTrackId: null
	};

	handleTrackMenuOpen = (event, activeTrackId) => {
		this.setState({
			trackMenuOpen: true,
			anchorEl: event.currentTarget,
			activeTrackId
		});
	};

	handleTrackMenuClose = () => {
		this.setState({ trackMenuOpen: false, activeTrackId: null });
	};

	// cancel editing here

	componentDidMount() {
		window.addEventListener("mouseup", this.mouseRelease, false);
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.mouseRelease, false);
	}

	mouseRelease = event => {
		// console.log(event);
		// console.log("this.mouseIsDownOnClips: ", this.mouseIsDownOnClips);
	};

	mouseDownHandler = () => {
		// this.mouseIsDownOnClips = false;
	};

	mouseUpHandler = () => {
		// this.mouseIsDownOnClips = true;
	};

	render() {
		const { classes } = this.props;
		const { anchorEl, popperOpen, activeTrackId } = this.state;
		return (
			<div className="video-content-container">
				<Popover
					open={this.state.trackMenuOpen}
					anchorEl={this.state.anchorEl}
					onClose={this.handleTrackMenuClose}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
				>
					<div className="track-popover-container">
						<button
							onClick={() => {
								this.props.deleteTrack(
									this.props.video.googleId,
									this.state.activeTrackId
								);
								this.handleTrackMenuClose();
							}}
						>
							delete
						</button>
						<button
							onClick={() => {
								this.props.updateTrack(
									this.props.video.googleId,
									this.state.activeTrackId,
									"updated category"
								);
								this.handleTrackMenuClose();
							}}
						>
							update category
						</button>
					</div>
				</Popover>
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
				<div className="video-tracks-container">
					<div className="video-track-groups">
						<div className="video-track-single-group">
							<h1>Group 1</h1>
							<div className="video-track-list">
								{this.props.video.tracks ? (
									<div className="video-tracks">
										{this.props.video.tracks.map(track => (
											<div className="video-single-track" key={track._id}>
												<div className="video-single-track-info">
													<ButtonBase
														className={classNames(
															this.props.classes.button,
															this.props.classes.root
														)}
														onClick={event => {
															this.handleTrackMenuOpen(event, track._id);
														}}
													>
														<div className="entity-avatar" />
														<div className="enitity-display-name">
															{track.category}
														</div>
													</ButtonBase>
													<div className="track-play-button">
														<IconButton
															className={this.props.classes.iconClass}
														>
															<PlayCircleOutline />
														</IconButton>
													</div>
												</div>

												<ClipsTimeline
													onMouseDown={this.mouseDownHandler}
													onMouseUp={this.mouseUpHandler}
													track={track}
												/>
											</div>
										))}
									</div>
								) : (
									"no tracks"
								)}
							</div>
							<button
								onClick={() => {
									this.props.addTrack(this.props.video.googleId, {
										category: "created by user _id from backend"
									});
								}}
							>
								add track
							</button>
						</div>
					</div>
				</div>
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
			addTrack,
			deleteTrack,
			updateTrack,
			updateCurrentVideo
		})(VideoContent)
	)
);
