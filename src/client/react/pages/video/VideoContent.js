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
import { formatTime } from "../../../utils/timeFormatter";
import ProgressBar from "../../components/common/player/ProgressBar";
import { updateCurrentVideo, resetInitial } from "../../../redux/actions/";
import { updatePlaylist } from "../../../redux/actions/player";
import {
	searchTracks,
	addTrack,
	clearLoadedTracks
} from "../../../redux/actions/objectTrackActions";
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
			background: "rgba(50,50,51,0.03)"
		},

		"&:active": {
			color: "#323233"
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
		activeTrackId: null,
		notLoadedTracks: true
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
		this.props.loadAllEntityTypes();
		if (this.state.notLoadedTracks && !_.isEmpty(this.props.video._id)) {
			this.searchTracks();
		}
		this.initialVideoLoad();
	}

	initialVideoLoad = () => {
		this.props.updateCurrentVideo(this.props.video.googleId, "play", true);
		this.setState({
			initialLoad: true
		});
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.video._id !== this.props.video._id) {
			if (!_.isEmpty(this.props.video._id)) {
				this.searchTracks();
				this.initialVideoLoad();
			}
		}

		if (this.state.initialLoad) {
			if (prevProps.player.currentVideo.playerAction == "playing") {
				this.props.updateCurrentVideo(this.props.video.googleId, "pause");
				this.props.resetInitial();
				this.setState({
					initialLoad: false
				});
			}
		}
	};

	searchTracks = () => {
		this.props.searchTracks(
			{ videoId: this.props.video.googleId },
			"createdAt",
			0,
			0,
			() => {
				this.setState({
					notLoadedTracks: false
				});
			}
		);
	};

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.mouseRelease, false);
		this.props.clearLoadedTracks();
	}

	renderTrackInfo = track => {
		if (
			track.references.rootEntityType &&
			this.props.getEntityType(track.references.rootEntityType) &&
			this.props.getEntityType(track.references.rootEntityType)
				.genericProperties.hasOfRefs
		) {
			if (!_.isEmpty(track.references.ofRefs.entity)) {
				return (
					<div className="video-single-track-info-content">
						{track.references.ofRefs.entity.imageUrl ? (
							<div className="entity-avatar">
								<img src={track.references.ofRefs.entity.imageUrl} />
							</div>
						) : (
							""
						)}
						<div>
							<div className="enitity-display-name single-line first-line">
								{track.references.ofRefs.entity.displayName}
							</div>
							{!_.isEmpty(track.references.byRefs.entity) ? (
								<div className="enitity-display-name single-line second-line">
									By: {track.references.byRefs.entity.displayName}
								</div>
							) : (
								""
							)}
						</div>
					</div>
				);
			} else {
				return <div className="empty-entity">Select entity...</div>;
			}
		} else {
			return (
				<div className="video-single-track-info-content">
					{track.metadata.customOfInfo.imageUrl ? (
						<div className="entity-avatar">
							<img src={track.metadata.customOfInfo.imageUrl} />
						</div>
					) : (
						""
					)}

					<div className="enitity-display-name">
						{track.metadata.customOfInfo.title}
					</div>
				</div>
			);
		}
	};

	playTrack = track => {
		let sortedClips = _.sortBy(track.clips, clip => {
			return clip.start;
		});

		this.props.updatePlaylist({
			current: {}
		});

		let current;

		current = {
			video: this.props.video,
			track: track,
			clip: sortedClips[0]
		};

		if (!_.isEmpty(this.props.selectedClip)) {
			let filteredClips = _.filter(sortedClips, clip => {
				return clip._id == this.props.selectedClip._id;
			});

			if (filteredClips && filteredClips.length > 0) {
				current = {
					video: this.props.video,
					track: track,
					clip: filteredClips[0]
				};
			}
		}

		setTimeout(() => {
			this.props.updatePlaylist(current);
		}, 1);
	};

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
						{this.renderTrackInfo(track)}
					</ButtonBase>
					<div className="track-play-button">
						<IconButton
							className={this.props.classes.iconClass}
							onClick={() => {
								this.playTrack(track);
							}}
						>
							<PlayCircleOutline />
						</IconButton>
					</div>
				</div>

				<ClipsTimeline track={track} />
			</div>
		);
	};

	renderSingleGroup = entityType => {
		let tracks = _.filter(this.props.tracks, track => {
			if (track.references) {
				return track.references.rootEntityType == entityType._id;
			} else return false;
		});

		let sortedTracks = _.sortBy(tracks, track => {
			return new Date(track.metadata.createdAt);
		});
		return (
			<div className="video-track-single-group" key={entityType._id}>
				<h1>
					<span
						onClick={() =>
							this.props.history.push(
								`/ontology?selectedTabId=4&selectedEntityTypeId=${
									entityType._id
								}`
							)
						}
					>
						{entityType.genericProperties.displayName}
					</span>
				</h1>
				{tracks.length && tracks.length > 0 ? (
					<div className="video-track-list">
						<div className="video-tracks">
							{sortedTracks.map(track => {
								return this.renderTrack(track);
							})}
						</div>
					</div>
				) : (
					<div className="empty-track">No tracks added...</div>
				)}
				<button
					className="button white-button squared-button"
					onClick={() => {
						this.props.addTrack(
							{
								metadata: {
									customOfInfo: {
										title: `Untitled ${
											entityType.genericProperties.displayName
										}`
									},
									video: {
										videoId: this.props.video.googleId,
										channelId: this.props.video.snippet.channelId,
										channelTitle: this.props.video.snippet.channelTitle,
										thumbnails: this.props.video.snippet.thumbnails
									}
								},
								references: {
									rootEntityType: entityType._id
								}
							},
							() => {
								this.searchTracks();
							}
						);
					}}
				>
					<span className="pt-icon-standard pt-icon-add" />
					<span className="button-label">Add Track</span>
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

			return rootGroups;
		} else {
			return "";
		}
	};

	getTrack = id => {
		let filteredTracks = _.filter(this.props.tracks, track => {
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
					{this.state.notLoadedTracks ? (
						"loading tracks..."
					) : (
						<div className="video-track-groups">{this.renderRootGroups()}</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.auth,
	player: state.player,
	selectedClip: state.pageVideo.selectedClip,
	video: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching,
	currentVideo: state.currentVideo,
	allEntityTypes: state.app.allEntityTypes,
	loadedUsers: state.app.loadedUsers,
	tracks: state.pageVideo.tracks,
	isFetchingTracks: state.pageVideo.isFetchingTracks
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			updateCurrentVideo,
			loadAllEntityTypes,
			getEntityType,
			searchTracks,
			addTrack,
			clearLoadedTracks,
			updatePlaylist,
			resetInitial
		})(VideoContent)
	)
);
