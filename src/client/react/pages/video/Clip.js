import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import moment from "moment";
import keydown from "react-keydown";
import classNames from "classnames";

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
		console.log("select clip here");
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
			"selected-clip": false
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
				<span
					className="resize-left"
					onMouseDown={this.props.resizeLeft.bind(this, this.props.clip)}
				/>
				<span className="clip-name">{this.props.clip.name}</span>
				<span
					className="resize-right"
					onMouseDown={this.props.resizeRight.bind(this, this.props.clip)}
				/>
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
		videoDuration: videoDuration
	};
}

export default connect(mapStateToProps, {})(
	withStyles(styles)(withRouter(Clip))
);
