import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import moment from "moment";
import keydown from "react-keydown";
import Clip from "./Clip";
import { updateTrackClips } from "../../../redux/actions/objectVideoActions";

const styles = theme => ({});

class ClipsTimeline extends Component {
	state = {
		startedDragging: false,
		startedEditing: false,
		startedMoving: false,
		startPercent: 0,
		endPercent: 0,
		ghostWidth: 0,
		ghostDirection: null,
		ghostEndPosition: 0
	};

	@keydown("backspace")
	deleteClip() {
		console.log("delete clip");
	}

	calculateWidth = event => {
		const percent =
			(event.pageX - this.refs.clip_timeline.getBoundingClientRect().x) *
			100 /
			this.refs.clip_timeline.getBoundingClientRect().width;
		return percent;
	};

	onMouseDown = event => {
		if (
			event.target.className !== "clip" &&
			event.target.className !== "clip-name" &&
			event.target.className !== "resize-left" &&
			event.target.className !== "resize-right"
		) {
			this.calculateWidth(event);
			this.setState({
				startedDragging: true,
				startPercent: this.calculateWidth(event)
			});
		} else if (
			event.target.className == "clip" ||
			event.target.className == "clip_name"
		) {
			this.setState({
				startedMoving: true,
				startPercent: this.calculateWidth(event)
			});
		}
	};

	onMouseUp = event => {
		if (this.state.startedDragging) {
			this.calculateWidth(event);
			this.setState(
				{
					startedDragging: false,
					endPercent: this.calculateWidth(event),
					ghostWidth: 0,
					ghostEndPosition: 0
				},
				() => {
					this.createClip();
				}
			);
		}

		this.setState({
			startedEditing: false,
			startedEditingLeft: false,
			startedEditingRight: false,
			startedMoving: false
		});
	};

	onMouseLeave = event => {
		this.setState({
			startedDragging: false,
			startedEditing: false,
			startedMoving: false,
			startPercent: 0,
			endPercent: 0,
			ghostWidth: 0,
			ghostEndPosition: 0,
			startedEditingLeft: false,
			startedEditingRight: false
		});
	};

	onMouseMove = event => {
		// Initial drawing logic
		if (this.state.startedDragging) {
			let ghostWidth;
			let ghostDirection = "";
			let ghostEndPosition = 0;
			const endPosition = this.calculateWidth(event);

			if (endPosition > this.state.startPercent) {
				ghostWidth = endPosition - this.state.startPercent;
				ghostDirection = "right";
			} else {
				ghostWidth = this.state.startPercent - endPosition;
				ghostEndPosition = endPosition;
				ghostDirection = "left";
			}
			this.setState(
				{
					ghostWidth: ghostWidth,
					ghostDirection: ghostDirection,
					ghostEndPosition: ghostEndPosition
				},
				() => {
					let ghostStyle;
					if (this.state.ghostDirection === "left") {
						ghostStyle = {
							width: this.state.ghostWidth * this.props.videoDuration / 100,
							left: this.state.ghostEndPosition * this.props.videoDuration / 100
						};
						// this.props.dispatch(updateRangeTime(ghostStyle.left, ghostStyle.width, 'left'))
					} else if (this.state.ghostDirection === "right") {
						ghostStyle = {
							left: this.state.startPercent * this.props.videoDuration / 100,
							width: this.state.ghostWidth * this.props.videoDuration / 100
						};
						// this.props.dispatch(updateRangeTime(ghostStyle.left, ghostStyle.width, 'right'))
					}
				}
			);
		}

		// Resizing logic

		// Moving logic
	};

	calculateHoverSeconds = event => {
		const seekSeconds =
			this.calculateWidth(event) * this.props.videoDuration / 100;
		return seekSeconds;
	};

	createClip() {
		let { start, end } = 0;

		start =
			this.state.endPercent > this.state.startPercent
				? this.state.startPercent
				: this.state.endPercent;
		end =
			this.state.endPercent < this.state.startPercent
				? this.state.startPercent
				: this.state.endPercent;

		const newClip = {
			start: start * this.props.videoDuration / 100,
			end: end * this.props.videoDuration / 100,
			name: "Clip Name"
		};

		if (
			end * this.props.videoDuration / 100 -
				start * this.props.videoDuration / 100 >
			1
		) {
			let newClipArray = this.props.track.clips;
			newClipArray.push(newClip);
			this.props.updateTrackClips(
				this.props.video.googleId,
				this.props.track._id,
				newClipArray
			);
		}
	}

	resizeLeft = clip => {};
	resizeRight = clip => {};
	selectClip = clip => {};

	render() {
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
					<div className="ghost-clip" style={ghostStyle} />
					{this.props.track.clips
						? this.props.track.clips.map((clip, i) => {
								return (
									<Clip
										clip={clip}
										resizeLeft={this.resizeLeft.bind(this)}
										resizeRight={this.resizeRight.bind(this)}
										clipPosition={i}
										key={i}
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
		videoDuration: videoDuration
	};
}

export default connect(mapStateToProps, { updateTrackClips })(
	withStyles(styles)(withRouter(ClipsTimeline))
);
