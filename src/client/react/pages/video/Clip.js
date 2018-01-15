import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import moment from "moment";
import keydown from "react-keydown";
import classNames from "classnames";
import { selectClip } from "../../../redux/actions/objectVideoActions";

const styles = theme => ({});

class Clip extends Component {
	state = {
		mousePressed: false
	};

	calculateClipPosition = seconds => {
		const left = seconds * 100 / this.props.videoDuration + "%";
		return left;
	};

	calculateClipWidth = (start, end) => {
		const width = (end - start) * 100 / this.props.videoDuration + "%";
		return width;
	};

	onClipClick = event => {
		this.setState({
			mousePressed: true
		});
		// if (this.props.selectedClip && this.props.selectedClip._id) {
		// 	if (this.props.clip._id === this.props.selectedClip._id) {
		// 		this.deselectClip();
		// 	} else {
		// 		console.log("select clip here");
		//
		// 		this.props.selectClip(this.props.clip);
		// 	}
		// } else {
		// 	if (this.props.clip._id) {
		// 		console.log("select clip here");
		// 		this.props.selectClip(this.props.clip);
		// 	}
		// }
	};

	onMouseUp = () => {
		this.setState({
			mousePressed: false
		});
	};

	onMouseLeave = () => {
		this.setState({
			mousePressed: false
		});
	};

	onDoubleClick = event => {
		console.log("start playing clip");
	};

	@keydown("esc")
	deselectClip = () => {
		console.log("deselect clip");
	};

	render() {
		let clipStyle = {
			left: this.calculateClipPosition(this.props.clip.start),
			width: this.calculateClipWidth(this.props.clip.start, this.props.clip.end)
		};

		let clipClasses = classNames({
			clip: true,
			"selected-clip":
				this.props.selectedClip && this.props.selectedClip._id
					? this.props.clip._id === this.props.selectedClip._id
					: false
		});

		return (
			<div
				style={clipStyle}
				className={clipClasses}
				onMouseDown={this.onClipClick.bind(this)}
				onDoubleClick={this.onDoubleClick.bind(this)}
				onMouseUp={this.onMouseUp.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
			>
				{this.props.clip._id ? (
					<span className="clip-name">{this.props.clip.name}</span>
				) : (
					"saving..."
				)}

				{this.props.clip._id ? <div className="resize-left" /> : ""}
				{this.props.clip._id ? <div className="resize-right" /> : ""}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const videoDuration = moment
		.duration(state.pageVideo.singleVideo.contentDetails.duration)
		.asSeconds();
	return {
		video: state.pageVideo.singleVideo,
		videoDuration: videoDuration,
		selectedClip: state.pageVideo.selectedClip
	};
}

export default connect(mapStateToProps, { selectClip })(
	withStyles(styles)(withRouter(Clip))
);
