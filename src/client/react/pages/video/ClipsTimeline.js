import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import keydown from "react-keydown";
import update from "immutability-helper";
import * as _ from "lodash";
import Clip from "./Clip";
import {
	updateTrackClips,
	optimisticTrackUpdate,
	selectClip
} from "../../../redux/actions/objectVideoActions";

class ClipsTimeline extends Component {
	loadInitialState = () => {
		this.setState({
			movedClip: false,
			startedDrawing: false,
			startedEditing: false,
			startedMoving: false,
			startPercent: 0,
			endPercent: 0,
			ghostWidth: 0,
			ghostDirection: null,
			ghostEndPosition: 0,
			updatedClips: [],
			updatedSingleClip: {},
			originalClips: []
		});
	};

	componentWillMount = () => {
		this.loadInitialState();
	};

	onMouseDown = event => {
		// make a copy of track's clips for editing
		this.setState({
			originalClips: this.props.track.clips,
			startPercent: this.calculatePercentFromClick(event),
			endPercent: 0
		});

		const clickedClip = this.getClickedClip(event);

		if (clickedClip) {
			console.log("clicked on clip : started moving");

			this.props.selectClip(clickedClip);
			this.setState({
				startedMoving: true
			});
		} else {
			console.log("clicked on timeline : started drawing");
			this.setState({
				startedDrawing: true
			});
		}
	};

	onMouseMove = event => {
		if (this.state.startedDrawing) {
			this.handleDrawingClip(event);
		} else if (this.state.startedMoving) {
			this.handleMovingClip(event);
		} else if (this.state.startedResizing) {
		}
	};

	onMouseUp = event => {
		if (this.state.startedDrawing) {
			console.log("create clip after drawing");
			this.handleCreateNewClip();
		} else if (this.state.startedMoving) {
			if (this.state.movedClip) {
				console.log("update track after moving");
				this.handleMoveClip();
			}
		} else if (this.state.startedEditing) {
			// this.handleResizeClip();
		}
		this.loadInitialState();
	};

	onMouseLeave = event => {
		if (this.state.originalClips.length > 0)
			this.props.track.clips = this.state.originalClips;
		this.loadInitialState();
	};

	handleDrawingClip = event => {
		console.log("draw clip here");
		const updatedClips = this.getUpdatedTrackClips(
			{
				start: this.calculateStartEnd(event).newClipStart,
				end: this.calculateStartEnd(event).newClipEnd
			},
			this.state.originalClips
		);

		this.props.track.clips = updatedClips;

		this.setState({
			endPercent: this.calculatePercentFromClick(event),
			updatedClips: updatedClips
		});

		this.calculateGhostStyle(event);
	};

	handleMovingClip = event => {
		console.log("moving");
		const filteredClipArray = _.filter(this.state.originalClips, clip => {
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

			let cliptoUpdateIndex = _.findIndex(this.state.originalClips, {
				_id: this.props.selectedClip._id
			});

			let newClipsArray = update(this.state.originalClips, {
				$splice: [[cliptoUpdateIndex, 1, newMovedClip]]
			});

			const updatedClips = this.getUpdatedTrackClips(
				newMovedClip,
				newClipsArray
			);

			if (updatedClips.length > 0) {
				this.props.optimisticTrackUpdate(
					_.assign({}, this.props.track, { clips: updatedClips })
				);

				this.setState({
					updatedSingleClip: newMovedClip,
					updatedClips: updatedClips
				});
			}
		}
	};

	handleMoveClip = () => {
		this.props.optimisticTrackUpdate(
			_.assign({}, this.props.track, { clips: this.state.updatedClips })
		);
		this.props.updateTrackClips(
			this.props.video.googleId,
			this.props.track._id,
			this.state.updatedClips,
			track => {}
		);
		// refresh clip that's selected to updated start / end
		this.props.selectClip(this.state.updatedSingleClip);
	};

	handleCreateNewClip = () => {
		let { start, end } = 0;
		console.log("endPercent: ", this.state.endPercent);

		if (this.state.endPercent == 0) {
			console.log("create fixed size clip");
			this.addFixSizeClip();
		} else if (this.state.endPercent > 0) {
			start =
				this.state.endPercent > this.state.startPercent
					? this.calculateSecondsFromPercent(this.state.startPercent)
					: this.calculateSecondsFromPercent(this.state.endPercent);
			end =
				this.state.endPercent < this.state.startPercent
					? this.calculateSecondsFromPercent(this.state.startPercent)
					: this.calculateSecondsFromPercent(this.state.endPercent);

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

	addActualSizeClip = (start, end) => {
		if (this.checkIfCanAddClip()) {
			const newClip = {
				start: start,
				end: end,
				name: "Clip Name 2"
			};

			let newClipsArray = this.state.updatedClips;
			newClipsArray.push(newClip);
			this.addNewClipAndSelect(newClipsArray, newClip);
		}
	};

	addFixSizeClip = () => {
		const newClip = {
			start: this.calculateSecondsFromPercent(this.state.startPercent),
			end: this.calculateSecondsFromPercent(this.state.startPercent + 1),
			name: "Clip Name 2"
		};
		let newClipsArray = this.state.originalClips;

		if (this.checkIfCanAddClip(newClip, newClipsArray)) {
			newClipsArray.push(newClip);

			// Update track's clips immediately
			if (this.state.originalClips.length > 0) {
				this.addNewClipAndSelect(newClipsArray, newClip);
			}
		}
	};

	addNewClipAndSelect = (newClipsArray, newClip) => {
		// Update track's clips immediately
		this.props.optimisticTrackUpdate(
			_.assign({}, this.props.track, { clips: newClipsArray })
		);

		// Send request and update in DB
		this.props.updateTrackClips(
			this.props.video.googleId,
			this.props.track._id,
			newClipsArray,
			track => {
				let filteredClip = _.filter(track.clips, clip => {
					return clip.end == newClip.end && clip.start == newClip.start;
				});
				this.props.selectClip(filteredClip[0]);
			}
		);
	};

	checkIfCanAddClip = () => {
		return true;
	};

	calculateHoverSeconds = event => {};

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

		if (this.calculateStartEnd(event).endPosition > this.state.startPercent) {
			ghostWidth =
				this.calculateStartEnd(event).endPosition - this.state.startPercent;
			ghostDirection = "right";
		} else {
			ghostWidth =
				this.state.startPercent - this.calculateStartEnd(event).endPosition;
			ghostEndPosition = this.calculateStartEnd(event).endPosition;
			ghostDirection = "left";
		}

		this.setState({
			ghostWidth: ghostWidth,
			ghostDirection: ghostDirection,
			ghostEndPosition: ghostEndPosition
		});
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
				this.state.startedMoving &&
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
		let matchedClip = _.filter(this.props.track.clips, clip => {
			let clickedSecond = this.calculateSecondsFromClick(event);
			return clickedSecond >= clip.start && clickedSecond <= clip.end;
		});
		return matchedClip[0] ? matchedClip[0] : false;
	};

	calculatePercentFromClick = event => {
		const percent =
			(event.pageX - this.refs.clip_timeline.getBoundingClientRect().x) *
			100 /
			this.refs.clip_timeline.getBoundingClientRect().width;
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

	getGhostStyle = () => {
		let ghostStyle = {};
		if (this.state.ghostDirection === "left") {
			ghostStyle = {
				width: this.state.ghostWidth + "%",
				left: this.state.ghostEndPosition + "%"
			};
		} else if (this.state.ghostDirection === "right") {
			ghostStyle = {
				left: this.state.startPercent + "%",
				width: this.state.ghostWidth + "%"
			};
		}
		return ghostStyle;
	};

	render() {
		return (
			<div className="video-single-track-clips">
				<div
					className="track-clips-timeline"
					ref="clip_timeline"
					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
					onMouseLeave={this.onMouseLeave}
					onMouseMove={this.onMouseMove}
				>
					<div className="ghost-clip" style={this.getGhostStyle()} />
					{this.props.track.clips
						? this.props.track.clips.map((clip, i) => {
								return <Clip clip={clip} clipPosition={i} key={i} />;
							})
						: ""}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const videoDuration = moment
		.duration(state.pageVideo.singleVideo.contentDetails.duration)
		.asSeconds();
	return {
		currentVideo: state.currentVideo,
		video: state.pageVideo.singleVideo,
		videoDuration: videoDuration,
		selectedClip: state.pageVideo.selectedClip
	};
}

export default connect(mapStateToProps, {
	updateTrackClips,
	optimisticTrackUpdate,
	selectClip
})(withRouter(ClipsTimeline));
