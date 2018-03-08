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
import {
	loadAllEntityTypes,
	getEntityType
} from "../../../redux/actions/appActions";
import ClipsTimeline from "./ClipsTimeline";

import TrackDetails from "./TrackDetails";

import * as _ from "lodash";

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

	componentDidMount() {
		window.addEventListener("mouseup", this.mouseRelease, false);
		console.log("mounted");
		this.props.loadAllEntityTypes();
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.mouseRelease, false);
	}

	renderTrack = track => {
		return (
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
						{track.imageUrl ? (
							<div className="entity-avatar">
								<img src={track.imageUrl} />
							</div>
						) : (
							""
						)}

						<div className="enitity-display-name">{track.title}</div>
					</ButtonBase>
					<div className="track-play-button">
						<IconButton className={this.props.classes.iconClass}>
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
		);
	};

	renderSingleGroup = entityType => {
		let tracks = _.filter(this.props.video.tracks, track => {
			if (track.references) {
				return track.references.rootEntityType == entityType._id;
			} else return false;
		});
		return (
			<div className="video-track-single-group" key={entityType._id}>
				<h1>{entityType.genericProperties.displayName}</h1>

				<div className="video-track-list">
					<div className="video-tracks">
						{tracks.map(track => {
							return this.renderTrack(track);
						})}
					</div>
				</div>
				<button
					onClick={() => {
						this.props.addTrack(this.props.video.googleId, {
							title: `Untitled ${entityType.genericProperties.displayName}`,
							references: {
								rootEntityType: entityType._id
							}
						});
					}}
				>
					add track
				</button>
			</div>
		);
	};

	renderRootGroups = () => {
		if (this.props.allEntityTypes) {
			let rootEntityTypes = _.filter(this.props.allEntityTypes, entityType => {
				return entityType.genericProperties.root == true;
			});

			let rootGroups = rootEntityTypes.map(entityType => {
				return this.renderSingleGroup(entityType);
			});

			let groups = this.props.video.tracks.map(track => {
				return this.renderTrack(track);
			});

			return rootGroups;
		} else {
			return "";
		}
	};

	getTrack = id => {
		let filteredTracks = _.filter(this.props.video.tracks, track => {
			return track._id == id;
		});
		if (filteredTracks[0]) {
			return filteredTracks[0];
		}
	};

	render() {
		const { classes } = this.props;
		const { anchorEl, popperOpen, activeTrackId } = this.state;
		return (
			<div className="video-content-container">
				{this.getTrack(this.state.activeTrackId) ? (
					<TrackDetails
						track={this.getTrack(this.state.activeTrackId)}
						open={this.state.trackMenuOpen}
						anchorEl={this.state.anchorEl}
						handleClose={() => {
							this.handleTrackMenuClose();
						}}
					/>
				) : (
					""
				)}

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
						{this.props.video.tracks ? this.renderRootGroups() : "nothing"}
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
	currentVideo: state.currentVideo,
	allEntityTypes: state.app.allEntityTypes,
	loadedUsers: state.app.loadedUsers
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			addTrack,
			deleteTrack,
			updateTrack,
			updateCurrentVideo,
			loadAllEntityTypes,
			getEntityType
		})(VideoContent)
	)
);
