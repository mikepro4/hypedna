import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";

import Popover from "material-ui/Popover";
import ButtonBase from "material-ui/ButtonBase";
import PlayCircleOutline from "material-ui-icons/PlayCircleOutline";
import PauseCircleOutline from "material-ui-icons/PauseCircleOutline";
import IconButton from "material-ui/IconButton";

import ClipsTimeline from "./ClipsTimeline";

import { updateCurrentVideo } from "../../../redux/actions/";
import {
	addTrack,
	deleteTrack,
	updateTrack,
	resetEditor,
	updateEditor,
	selectClip,
	optimisticTrackUpdate,
	updateTrackClips
} from "../../../redux/actions/objectVideoActions";

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

class VideoTracks extends Component {
	loadInitialState = () => {
		this.setState({
			trackMenuOpen: false,
			anchorEl: null,
			activeTrackId: null,
			movedClip: false,
			startedDrawing: false,
			startedEditing: false,
			startedEditingLeft: false,
			startedEditingRight: false,
			startedMoving: false,
			startPercent: 0,
			endPercent: 0,
			ghostWidth: 0,
			ghostDirection: null,
			ghostEndPosition: 0,
			updatedClips: [],
			updatedSingleClip: {},
			editingTrack: null,
			editingTimeline: null
		});
	};

	componentWillMount = () => {
		this.loadInitialState();
	};

	componentDidMount = () => {
		window.addEventListener("mousedown", this.pageMouseDown, false);
		window.addEventListener("mouseup", this.pageMouseUp, false);
		window.addEventListener("mousemove", this.pageMouseMove, false);
	};

	componentWillUnmount = () => {
		window.removeEventListener("mousedown", this.pageMouseDown, false);
		window.removeEventListener("mouseup", this.pageMouseUp, false);
		window.removeEventListener("mousemove", this.pageMouseMove, false);
	};

	pageMouseDown = () => {
		console.log("page mouse down");

		if (this.state.editingTimeline) {
			this.setState({
				startPercent: this.calculatePercentFromClick(event),
				endPercent: 0
			});

			const clickedClip = this.getClickedClip(event);

			if (clickedClip) {
				this.props.selectClip(clickedClip);

				if (
					event.target.className !== "resize-left" &&
					event.target.className !== "resize-right"
				) {
					console.log("clicked on clip : started moving");

					this.setState({
						startedMoving: true
					});
				} else {
					console.log("started resizing");
					this.setState({
						startedEditing: true
					});
				}
			} else {
				console.log("clicked on timeline : started drawing");
				this.setState({
					startedDrawing: true
				});
			}
		}
	};

	pageMouseUp = () => {
		console.log("page mouse up");
		if (this.state.startedDrawing) {
			console.log("create clip after drawing");
			this.handleCreateNewClip();
		} else if (this.state.startedMoving) {
			if (this.state.movedClip) {
				console.log("update track after moving");
				this.handleMoveClip();
			}
		} else if (this.state.startedEditing) {
			this.handleMoveClip();
		}
		this.loadInitialState();
	};

	pageMouseMove = () => {
		if (this.state.startedDrawing) {
			this.handleDrawingClip(event);
		} else if (this.state.startedMoving) {
			this.handleMovingClip(event);
		} else if (this.state.startedEditing) {
			console.log("resizing here");
			this.handleResizingClip(event);
		}
	};

	handleDrawingClip = event => {
		console.log("drawing clip");
		let newClip = {
			start: this.calculateStartEnd(event).newClipStart,
			end: this.calculateStartEnd(event).newClipEnd
		};

		let clipDuration = newClip.end - newClip.start;

		let offsetDiff;

		if (newClip.start < 0) {
			offsetDiff = Math.abs(newClip.start);
			newClip.start = 0;
			newClip.end = clipDuration - offsetDiff;
		} else if (newClip.end > this.props.videoDuration) {
			offsetDiff = this.props.videoDuration - newClip.end;
			newClip.end = this.props.videoDuration;
			newClip.start = this.props.videoDuration - clipDuration - offsetDiff;
		}

		const updatedClips = this.getUpdatedTrackClips(
			newClip,
			this.state.editingTrack.clips
		);

		// this.props.optimisticTrackUpdate(
		// 	_.assign({}, this.state.editingTrack, { clips: updatedClips })
		// );

		let updatedTrack = _.assign({}, this.state.editingTrack, {
			clips: updatedClips
		});

		let tracktoUpdateIndex = _.findIndex(this.props.video.tracks, {
			_id: this.state.editingTrack._id
		});
		// ghetto as fuck but improves performance
		this.props.video.tracks[tracktoUpdateIndex] = updatedTrack;

		let endPercent;
		if (this.calculatePercentFromClick(event) < 0) {
			endPercent = 0;
		} else if (this.calculatePercentFromClick(event) > 100) {
			endPercent = 100;
		} else {
			endPercent = this.calculatePercentFromClick(event);
		}

		// this.setState({
		// 	endPercent: endPercent,
		// 	updatedClips: updatedClips,
		// 	updatedSingleClip: newClip
		// });
		//
		this.calculateGhostStyle(event);
	};

	handleMovingClip = event => {
		console.log("moving clip");
		const filteredClipArray = _.filter(this.state.editingTrack.clips, clip => {
			return clip._id == this.props.selectedClip._id;
		});

		let newMovedClip = {};
		let diff =
			this.calculateStartEnd(event).newClipEnd -
			this.calculateStartEnd(event).newClipStart;

		if (diff > 0) {
			this.setState({
				movedClip: true
			});

			if (
				this.calculateStartEnd(event).endPosition >= this.state.startPercent
			) {
				newMovedClip = _.assign({}, filteredClipArray[0], {
					start: this.props.selectedClip.start + diff,
					end: this.props.selectedClip.end + diff
				});
			} else if (
				this.calculateStartEnd(event).endPosition <= this.state.startPercent
			) {
				newMovedClip = _.assign({}, filteredClipArray[0], {
					start: this.props.selectedClip.start - diff,
					end: this.props.selectedClip.end - diff
				});
			}

			// Provide left / right boundaries

			let clipDuration = newMovedClip.end - newMovedClip.start;

			if (newMovedClip.start < 0) {
				newMovedClip.start = 0;
				newMovedClip.end = clipDuration;
			} else if (newMovedClip.end > this.props.videoDuration) {
				newMovedClip.end = this.props.videoDuration;
				newMovedClip.start = this.props.videoDuration - clipDuration;
			}

			let cliptoUpdateIndex = _.findIndex(this.state.editingTrack.clips, {
				_id: this.props.selectedClip._id
			});

			let newClipsArray = update(this.state.editingTrack.clips, {
				$splice: [[cliptoUpdateIndex, 1, newMovedClip]]
			});

			const updatedClips = this.getUpdatedTrackClips(
				newMovedClip,
				newClipsArray
			);

			if (updatedClips.length > 0) {
				// this.props.optimisticTrackUpdate(
				// 	_.assign({}, this.state.editingTrack, { clips: updatedClips })
				// );

				let updatedTrack = _.assign({}, this.state.editingTrack, {
					clips: updatedClips
				});

				let tracktoUpdateIndex = _.findIndex(this.props.video.tracks, {
					_id: this.state.editingTrack._id
				});
				// ghetto as fuck but improves performance
				this.props.video.tracks[tracktoUpdateIndex] = updatedTrack;

				this.setState({
					updatedSingleClip: newMovedClip,
					updatedClips: updatedClips
				});
			}
		}
	};

	handleResizingClip = event => {
		console.log("resizing clip");
		let newClip = {};
		if (this.state.startedEditingLeft) {
			console.log("editing left handle");

			if (this.calculateSecondsFromClick(event) < this.props.selectedClip.end) {
				newClip = _.assign({}, this.props.selectedClip, {
					start: this.calculateSecondsFromClick(event),
					end: this.props.selectedClip.end
				});
			} else {
				newClip = _.assign({}, this.props.selectedClip, {
					start: this.props.selectedClip.end,
					end: this.calculateSecondsFromClick(event)
				});
			}
		} else if (this.state.startedEditingRight) {
			console.log("editing right handle");
			if (
				this.calculateSecondsFromClick(event) > this.props.selectedClip.start
			) {
				newClip = _.assign({}, this.props.selectedClip, {
					start: this.props.selectedClip.start,
					end: this.calculateSecondsFromClick(event)
				});
			} else {
				newClip = _.assign({}, this.props.selectedClip, {
					start: this.calculateSecondsFromClick(event),
					end: this.props.selectedClip.start
				});
			}
		}

		// boundaries here

		let clipDuration = newClip.end - newClip.start;

		let offsetDiff;

		if (newClip.start < 0) {
			offsetDiff = Math.abs(newClip.start);
			newClip.start = 0;
			newClip.end = clipDuration - offsetDiff;
		} else if (newClip.end > this.props.videoDuration) {
			offsetDiff = this.props.videoDuration - newClip.end;
			newClip.end = this.props.videoDuration;
			newClip.start = this.props.videoDuration - clipDuration - offsetDiff;
		}

		let cliptoUpdateIndex = _.findIndex(this.state.editingTrack.clips, {
			_id: this.props.selectedClip._id
		});

		let newClipsArray = update(this.state.editingTrack.clips, {
			$splice: [[cliptoUpdateIndex, 1, newClip]]
		});

		const updatedClips = this.getUpdatedTrackClips(newClip, newClipsArray);

		if (updatedClips.length > 0) {
			this.props.optimisticTrackUpdate(
				_.assign({}, this.state.editingTrack, { clips: updatedClips })
			);
			this.setState({
				updatedSingleClip: newClip,
				updatedClips: updatedClips
			});
		}
	};

	handleCreateNewClip = () => {
		let { start, end } = 0;

		if (this.state.endPercent == 0 && this.state.ghostWidth == 0) {
			console.log("create fixed size clip");
			this.addFixSizeClip();
		} else if (this.state.endPercent > 0 || this.state.ghostWidth > 0) {
			start =
				this.state.endPercent > this.state.startPercent
					? this.calculateSecondsFromPercent(this.state.startPercent)
					: this.calculateSecondsFromPercent(this.state.endPercent);
			end =
				this.state.endPercent < this.state.startPercent
					? this.calculateSecondsFromPercent(this.state.startPercent)
					: this.calculateSecondsFromPercent(this.state.endPercent);

			if (start < 0) {
				start = 0;
			} else if (end > this.props.vidoeDuration) {
				end = this.props.videoDuration;
			}
			console.log(start, end);

			const clipLength = end - start;
			if (clipLength < 1) {
				console.log("create fixed size clip because less than 1 second");
				this.addFixSizeClip();
			} else {
				console.log("create actual size clip");
				this.addActualSizeClip(start, end);
			}
		}
	};

	addFixSizeClip = () => {
		console.log("addFixSizeClip");
		const newClip = {
			start: this.calculateSecondsFromPercent(this.state.startPercent),
			end: this.calculateSecondsFromPercent(this.state.startPercent + 1),
			name: "Clip Name 2"
		};
		let newClipsArray = this.state.editingTrack.clips;

		newClipsArray.push(newClip);

		if (this.state.editingTrack.clips.length > 0) {
			this.addNewClipAndSelect(newClipsArray, newClip);
		}
	};

	addNewClipAndSelect = (newClipsArray, newClip) => {
		console.log("addNewClipAndSelect");
		// Update track's clips immediately
		this.props.optimisticTrackUpdate(
			_.assign({}, this.state.editingTrack, { clips: newClipsArray })
		);

		// Send request and update in DB
		this.props.updateTrackClips(
			this.props.video.googleId,
			this.state.editingTrack._id,
			newClipsArray,
			track => {
				let filteredClip = _.filter(track.clips, clip => {
					return clip.end == newClip.end && clip.start == newClip.start;
				});
				this.props.selectClip(filteredClip[0]);
			}
		);
	};

	addActualSizeClip = (start, end) => {
		console.log(start, end);
		const newClip = {
			start: start,
			end: end,
			name: "Clip Name 2"
		};

		let newClipsArray = this.state.updatedClips;
		newClipsArray.push(newClip);
		this.addNewClipAndSelect(newClipsArray, newClip);
	};

	handleMoveClip = () => {
		console.log("handleMoveClip");
		this.props.optimisticTrackUpdate(
			_.assign({}, this.state.editingTrack, {
				clips: this.state.updatedClips
			})
		);
		this.props.updateTrackClips(
			this.props.video.googleId,
			this.state.editingTrack._id,
			this.state.updatedClips,
			track => {}
		);
		// refresh clip that's selected to updated start / end
		this.props.selectClip(this.state.updatedSingleClip);
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

	getUpdatedTrackClips = (newClip, clipsArray) => {
		// trim and filter overlapping clips
		const filteredClips = this.filterOverlappingClips(newClip, clipsArray);
		const trimmedClips = this.trimOverlappingClips(newClip, filteredClips);
		return trimmedClips;
	};

	filterOverlappingClips = (newClip, clipsArray) => {
		const newClipStart = newClip.start;
		const newClipEnd = newClip.end;

		// filter completely overlapping clips
		const filteredClips = _.filter(clipsArray, clip => {
			if (
				(this.state.startedMoving || this.state.startedEditing) &&
				this.props.selectedClip &&
				clip._id == this.props.selectedClip._id
			) {
				// don't filter the selected clip while moving
				return true;
			} else {
				let start = clip.start;
				let end = clip.end;

				const startInRange = start >= newClipStart && start <= newClipEnd;
				const endInRange = end >= newClipStart && end <= newClipEnd;

				let inRange = startInRange && endInRange ? true : false;

				return !inRange;
			}
		});
		return filteredClips;
	};

	trimOverlappingClips = (newClip, filteredClips) => {
		const newClipStart = newClip.start;
		const newClipEnd = newClip.end;

		const updatedChannelClips = _.map(filteredClips, clip => {
			let start = clip.start;
			let end = clip.end;
			if (newClipStart > start && newClipStart < end) {
				let diff = clip.end - newClipStart;
				end = clip.end - diff;
			}
			if (newClipEnd > start && newClipEnd < end) {
				if (newClipEnd > clip.start) {
					let diff = newClipEnd - clip.start;
					start = clip.start + diff;
				}
			}

			return {
				...clip,
				start: start,
				end: end
			};
		});

		return updatedChannelClips;
	};

	getClickedClip = event => {
		let matchedClip = _.filter(this.state.editingTrack.clips, clip => {
			let clickedSecond = this.calculateSecondsFromClick(event);
			return clickedSecond >= clip.start && clickedSecond <= clip.end;
		});
		return matchedClip[0] ? matchedClip[0] : false;
	};

	calculateStartEnd = event => {
		const endPosition = this.calculatePercentFromClick(event);
		let { newClipStart, newClipEnd } = 0;

		// select start and end based on left / right direction
		if (endPosition > this.state.startPercent) {
			newClipStart = this.state.startPercent * this.props.videoDuration / 100;
			newClipEnd = endPosition * this.props.videoDuration / 100;
		} else {
			newClipEnd = this.state.startPercent * this.props.videoDuration / 100;
			newClipStart = endPosition * this.props.videoDuration / 100;
		}
		return { newClipStart, newClipEnd, endPosition };
	};

	calculateGhostStyle = event => {
		let ghostWidth;
		let ghostDirection = "";
		let ghostEndPosition = 0;

		console.log(
			this.calculateStartEnd(event).endPosition > this.state.startPercent
		);

		let endPosition;
		if (this.calculateStartEnd(event).endPosition < 0) {
			endPosition = 0;
		} else if (this.calculateStartEnd(event).endPosition > 100) {
			endPosition = 100;
		} else {
			endPosition = this.calculateStartEnd(event).endPosition;
		}

		if (this.calculateStartEnd(event).endPosition > this.state.startPercent) {
			if (this.calculateStartEnd(event).endPosition > 100) {
				ghostWidth =
					this.calculateStartEnd(event).endPosition -
					this.state.startPercent -
					(this.calculateStartEnd(event).endPosition - 100);
			} else {
				ghostWidth =
					this.calculateStartEnd(event).endPosition - this.state.startPercent;
			}

			ghostDirection = "right";
		} else {
			if (this.calculateStartEnd(event).endPosition < 0) {
				ghostWidth =
					this.state.startPercent -
					this.calculateStartEnd(event).endPosition -
					Math.abs(this.calculateStartEnd(event).endPosition);
			} else {
				ghostWidth =
					this.state.startPercent - this.calculateStartEnd(event).endPosition;
			}
			ghostEndPosition = endPosition;
			ghostDirection = "left";
		}

		this.setState({
			ghostWidth: ghostWidth,
			ghostDirection: ghostDirection,
			ghostEndPosition: ghostEndPosition
		});

		// if(this.state.updatedSingleClip.end > this.state.updatedSingleClip.start) {
		//   	ghostWidth =
		// 			(this.state.updatedSingleClip.end -
		// 			this.state.updatedSingleClip.start) * this.props.videoDuration / 100;
		// 		ghostDirection = "right";
		// }
	};

	calculatePercentFromClick = event => {
		const timeline = this.state.editingTimeline;
		const percent = (event.pageX - timeline.x) * 100 / timeline.width;
		return percent;
	};

	calculateSecondsFromClick = event => {
		return (
			this.calculatePercentFromClick(event) * this.props.videoDuration / 100
		);
	};

	calculateSecondsFromPercent = percent => {
		return percent * this.props.videoDuration / 100;
	};

	updateEditor = state => {
		this.setState(state);
	};

	render() {
		const { classes } = this.props;
		const { anchorEl, popperOpen, activeTrackId } = this.state;
		return (
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
													<IconButton className={this.props.classes.iconClass}>
														<PlayCircleOutline />
													</IconButton>
												</div>
											</div>

											<ClipsTimeline
												onMouseDown={this.mouseDownHandler}
												onMouseUp={this.mouseUpHandler}
												editor={this.state}
												updateEditor={this.updateEditor}
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
		);
	}
}

function mapStateToProps(state) {
	let videoDuration;
	if (state.pageVideo.singleVideo.contentDetails) {
		videoDuration = moment
			.duration(state.pageVideo.singleVideo.contentDetails.duration)
			.asSeconds();
	} else {
		videoDuration = 0;
	}

	return {
		currentVideo: state.currentVideo,
		video: state.pageVideo.singleVideo,
		videoDuration: videoDuration,
		selectedClip: state.pageVideo.selectedClip,
		editor: state.pageVideo.editor
	};
}

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			addTrack,
			deleteTrack,
			updateTrack,
			updateCurrentVideo,
			resetEditor,
			updateEditor,
			selectClip,
			optimisticTrackUpdate,
			updateTrackClips
		})(VideoTracks)
	)
);
