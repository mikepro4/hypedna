import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { selectClip } from "../../../redux/actions/objectVideoActions";
import { updatePlaylist } from "../../../redux/actions/player";

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
		this.props.updatePlaylist({
			current: {}
		});

		let current = {
			video: this.props.video,
			track: this.props.track,
			clip: this.props.clip
		};

		setTimeout(() => {
			this.props.updatePlaylist(current);
		}, 1);
	};

	getPlayedLength = () => {
		let playedLength = this.props.player.currentTime - this.props.clip.start;
		let clipLength = this.props.clip.end - this.props.clip.start;
		let percent = playedLength * 100 / clipLength;

		if (percent > 100) return 100;

		return percent;
	};

	render() {
		let clipStyle = {
			left: this.calculateClipPosition(this.props.clip.start),
			width: this.calculateClipWidth(this.props.clip.start, this.props.clip.end)
		};

		let playing = false;

		if (
			this.props.playlist &&
			this.props.playlist.current &&
			this.props.playlist.current.clip &&
			this.props.playlist.current.clip._id == this.props.clip._id
		) {
			playing = true;
		}

		let clipClasses = classNames({
			clip: true,
			playing: playing,
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

				{this.props.clip._id && playing ? (
					<div
						className="played-time"
						style={{ width: `${this.getPlayedLength()}%` }}
					/>
				) : (
					""
				)}

				{this.props.clip._id ? (
					<div
						className="resize-left"
						onMouseDown={this.props.resizeLeft.bind(this, this.props.clip)}
					/>
				) : (
					""
				)}
				{this.props.clip._id ? (
					<div
						className="resize-right"
						onMouseDown={this.props.resizeRight.bind(this, this.props.clip)}
					/>
				) : (
					""
				)}
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
		player: state.player,
		playlist: state.player.playlist,
		videoDuration: videoDuration,
		selectedClip: state.pageVideo.selectedClip
	};
}

export default connect(mapStateToProps, { selectClip, updatePlaylist })(
	withStyles(styles)(withRouter(Clip))
);
