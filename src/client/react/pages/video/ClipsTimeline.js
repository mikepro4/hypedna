import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import keydown from "react-keydown";
import update from "immutability-helper";
import * as _ from "lodash";
import { formatTime } from "../../../utils/timeFormatter";
import Clip from "./Clip";
import {
	updateTrackClips,
	optimisticTrackUpdate,
	selectClip
} from "../../../redux/actions/objectVideoActions";

class ClipsTimeline extends Component {
	loadInitialState = () => {
		this.setState({
			showCursor: false,
			showRange: false,
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
			originalClips: [],
			editingTrackId: null,
			hoverTime: null,
			range: null
		});
	};

	componentWillMount = () => {
		this.loadInitialState();
	};
	componentDidMount = () => {
		window.addEventListener("mousemove", this.onMouseMove, false);
	};

	componentWillUnmount = () => {
		window.removeEventListener("mousemove", this.onMouseMove, false);
	};

	onMouseDown = event => {
		// make a copy of track's clips for editing
		window.addEventListener("mouseup", this.onMouseUp, false);

		this.setState({
			originalClips: this.props.track.clips,
			startPercent: this.calculatePercentFromClick(event),
			endPercent: 0,
			editingTrackId: this.props.track._id
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
	};

	onMouseMove = event => {
		if (this.state.startedDrawing) {
			this.handleDrawingClip(event);
		} else if (this.state.startedMoving) {
			this.handleMovingClip(event);
		} else if (this.state.startedEditing) {
			console.log("resizing here");
			this.handleResizingClip(event);
		}

		this.updateHoverTime(event);
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
			this.handleMoveClip();
		}

		this.loadInitialState();
		window.removeEventListener("mouseup", this.onMouseUp, false);
		// window.removeEventListener("mousemove", this.onMouseMove, false);
	};

	// onMouseLeave = event => {
	//
	// 	this.loadInitialState();
	// };

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
			this.state.originalClips
		);

		this.props.track.clips = updatedClips;

		let endPercent;
		if (this.calculatePercentFromClick(event) < 0) {
			endPercent = 0;
		} else if (this.calculatePercentFromClick(event) > 100) {
			endPercent = 100;
		} else {
			endPercent = this.calculatePercentFromClick(event);
		}

		this.setState({
			endPercent: endPercent,
			updatedClips: updatedClips,
			updatedSingleClip: newClip
		});
		this.calculateGhostStyle(event);
	};

	handleMovingClip = event => {
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

			// Provide left / right boundaries

			let clipDuration = newMovedClip.end - newMovedClip.start;

			if (newMovedClip.start < 0) {
				newMovedClip.start = 0;
				newMovedClip.end = clipDuration;
			} else if (newMovedClip.end > this.props.videoDuration) {
				newMovedClip.end = this.props.videoDuration;
				newMovedClip.start = this.props.videoDuration - clipDuration;
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
				this.props.track.clips = updatedClips;

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

		let cliptoUpdateIndex = _.findIndex(this.state.originalClips, {
			_id: this.props.selectedClip._id
		});

		let newClipsArray = update(this.state.originalClips, {
			$splice: [[cliptoUpdateIndex, 1, newClip]]
		});

		const updatedClips = this.getUpdatedTrackClips(newClip, newClipsArray);

		if (updatedClips.length > 0) {
			this.props.track.clips = updatedClips;
			this.setState({
				updatedSingleClip: newClip,
				updatedClips: updatedClips
			});
		}
	};

	handleMoveClip = () => {
		if (this.state.updatedClips.length > 0) {
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

	calculatePercentFromSeconds = seconds => {
		return seconds * 100 / this.props.videoDuration;
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

	resizeLeft = () => {
		this.setState({
			startedEditingLeft: true
		});
	};

	resizeRight = () => {
		this.setState({
			startedEditingRight: true
		});
	};

	updateHoverTime = event => {
		if (this.state.editingTrackId == this.props.track._id) {
			const endPosition = this.calculatePercentFromClick(event);
			let { start, end, hoverTime } = 0;
			let range = null;

			// select start and end based on left / right direction
			if (endPosition > this.state.startPercent) {
				start = this.calculateSecondsFromPercent(this.state.startPercent);
				end = this.calculateSecondsFromPercent(endPosition);
			} else {
				end = this.calculateSecondsFromPercent(this.state.startPercent);
				start = this.calculateSecondsFromPercent(endPosition);
			}

			hoverTime = this.calculateSecondsFromPercent(endPosition);

			if (start < 0) {
				start = 0;
				hoverTime = 0;
			}

			if (end > this.props.videoDuration) {
				end = this.props.videoDuration;
				hoverTime = this.props.videoDuration;
			}

			if (this.state.startedDrawing) {
				range = {
					startTime: start,
					endTime: end
				};
			} else if (this.state.startedMoving || this.state.startedEditing) {
				range = {
					startTime: this.state.updatedSingleClip.start,
					endTime: this.state.updatedSingleClip.end
				};
			}

			console.log(hoverTime, range);
			this.setState({
				showRange: true,
				range,
				hoverTime
			});
		} else {
			this.setState({
				showRange: false,
				range: null
			});
		}
	};

	updateOnlyHover = event => {
		if (
			this.state.editingTrackId != this.props.track._id &&
			!this.getClickedClip(event)
		) {
			let { start, end, hoverTime } = 0;
			hoverTime = this.calculateSecondsFromClick(event);

			if (this.calculateSecondsFromClick(event) > this.state.startPercent) {
				start = this.calculateSecondsFromPercent(this.state.startPercent);
				end = this.calculateSecondsFromClick(event);
			} else {
				end = this.calculateSecondsFromPercent(this.state.startPercent);
				start = this.calculateSecondsFromClick(event);
			}

			if (start < 0) {
				hoverTime = 0;
			}

			if (end > this.props.videoDuration) {
				hoverTime = this.props.videoDuration;
			}
			console.log(hoverTime);
			this.setState({
				showCursor: true,
				hoverTime: hoverTime
			});
		} else {
			this.setState({
				showCursor: false,
				hoverTime: null
			});
		}
	};

	hideCursor = () => {
		this.setState({
			showCursor: false,
			hoverTime: null
		});
	};

	getCursorStyle = () => {
		return {
			left: this.calculatePercentFromSeconds(this.state.hoverTime) + "%"
		};
	};

	render() {
		return (
			<div className="video-single-track-clips">
				<div
					className="track-clips-timeline"
					ref="clip_timeline"
					onMouseDown={this.onMouseDown}
					onMouseMove={this.updateOnlyHover}
					onMouseLeave={this.hideCursor}
				>
					{this.state.showCursor ? (
						<div className="timeline-cursor" style={this.getCursorStyle()}>
							<span className="cursor" />
							<div className="cursor-time-container">
								<span className="cursor-time">
									{formatTime(this.state.hoverTime)}
								</span>
							</div>
						</div>
					) : (
						""
					)}

					{this.state.showRange ? (
						<div
							className={classNames({
								"cursor-range": true,
								"range-left": this.state.ghostDirection === "left",
								"range-right": this.state.ghostDirection === "right"
							})}
							style={this.getCursorStyle()}
						>
							<span className="cursor" />
							<div className="range-container">
								<span className="range">
									<span className="range-time">
										{formatTime(this.state.range.startTime)} –{" "}
										{formatTime(this.state.range.endTime)}
									</span>{" "}
									<span className="duration-container">
										({formatTime(
											this.state.range.endTime - this.state.range.startTime
										)})
									</span>
								</span>
							</div>
						</div>
					) : (
						""
					)}

					<div className="ghost-clip" style={this.getGhostStyle()} />
					{this.props.track.clips
						? this.props.track.clips.map((clip, i) => {
								return (
									<Clip
										clip={clip}
										clipPosition={i}
										key={i}
										resizeLeft={this.resizeLeft.bind(this)}
										resizeRight={this.resizeRight.bind(this)}
									/>
								);
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
