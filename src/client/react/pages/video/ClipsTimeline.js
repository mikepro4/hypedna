import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import keydown from "react-keydown";
import update from "immutability-helper";
import * as _ from "lodash";
import Clip from "./Clip";
import shouldPureComponentUpdate from "react-pure-render/function";

class ClipsTimeline extends Component {
	shouldComponentUpdate = shouldPureComponentUpdate;
	componentWillMount = () => {};

	onMouseDown = event => {
		console.log("mouse down on timeline");
		this.props.updateEditor({
			editingTrack: this.props.track,
			editingTimeline: this.refs.clip_timeline.getBoundingClientRect()
		});
	};

	resizeLeft = () => {
		this.props.updateEditor({
			startedEditingLeft: true
		});
	};

	resizeRight = () => {
		this.props.updateEditor({
			startedEditingRight: true
		});
	};

	getGhostStyle = () => {
		let ghostStyle = {};
		if (
			this.props.editor.editingTrack &&
			this.props.track._id == this.props.editor.editingTrack._id
		) {
			if (this.props.editor.ghostDirection === "left") {
				ghostStyle = {
					width: this.props.editor.ghostWidth + "%",
					left: this.props.editor.ghostEndPosition + "%"
				};
			} else if (this.props.editor.ghostDirection === "right") {
				ghostStyle = {
					left: this.props.editor.startPercent + "%",
					width: this.props.editor.ghostWidth + "%"
				};
			}
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
				>
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

export default connect(mapStateToProps, {})(withRouter(ClipsTimeline));
