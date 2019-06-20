import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import { updateCurrentVideo } from "../../../../redux/actions/";
import { formatTime } from "../../../../utils/timeFormatter";
import Timeline from "./Timeline";
import { updateHoverTime } from "../../../../redux/actions/pageVideoActions";
import { updatePlaylist, seekToTime } from "../../../../redux/actions/player";

class ProgressBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hoverWidth: 0
		};
	}

	handlePorgressBarClick(event) {
		this.props.updatePlaylist({});
		const relX =
			event.pageX -
			(this.refs.progress_bar_container.offsetLeft +
				this.refs.progress_bar_container.offsetParent.offsetLeft +
				96);
		const progressBarPercent =
			relX *
			100 /
			this.refs.progress_bar_container.getBoundingClientRect().width;
		const seekSeconds = progressBarPercent * this.props.duration / 100;
		this.props.seekToTime(seekSeconds);
		setTimeout(() => {
			this.props.updateCurrentVideo(this.props.currentVideo.videoId, "play");
		}, 500) 
		// this.props.updateCurrentVideo(
		// 	this.props.currentVideo.videoId,
		// 	"seek",
		// 	seekSeconds
		// );
	}

	calculateWidth(event) {
		const relX =
			event.pageX -
			(this.refs.progress_bar_container.offsetLeft +
				this.refs.progress_bar_container.offsetParent.offsetLeft +
				96);
		const progressBarPercent =
			relX *
			100 /
			this.refs.progress_bar_container.getBoundingClientRect().width;
		const seekSeconds = progressBarPercent * this.props.duration / 100;
		return seekSeconds;
	}

	onMouseMove(event) {
		this.props.updateHoverTime(this.calculateWidth(event));
		this.setState({
			hoverWidth: this.calculateWidth(event) * 100 / this.props.duration + "%"
		});

		// Update hover time in analysis reducer
		// this.props.updateHoverTime(this.calculateWidth(event))
	}

	onMouseLeave(event) {
		this.props.updateHoverTime(null);
		this.setState({
			hoverWidth: 0
		});
		// Update hover time in analysis reducer
		// this.props.dispatch(updateHoverTime(null))
	}

	render() {
		const total = formatTime(this.props.duration);
		const current = formatTime(this.props.player.currentTime);
		const progressBarWidth = {
			width: this.props.player.currentTime * 100 / this.props.duration + "%"
		};

		const cursor = {
			left: this.props.player.currentTime * 100 / this.props.duration + "%"
		};

		const cursorHover = {
			left: this.props.hoverTime * 100 / this.props.duration + "%"
		};

		const progressBarHoverWidth = {
			width: this.state.hoverWidth
		};

		// const rangeHighlightStyles = {
		// 	left: this.props.analysis.rangeStart * 100 / this.props.duration + "%",
		// 	width: this.props.analysis.rangeLength * 100 / this.props.duration + "%"
		// };
		return (
			<div className="progress-bar-player-container">
				<div
					className="player-time-wrapper"
					onClick={this.handlePorgressBarClick.bind(this)}
					onMouseMove={this.onMouseMove.bind(this)}
					onMouseLeave={this.onMouseLeave.bind(this)}
					ref="progress_bar_container"
				>
					<Timeline duration={this.props.duration} />
					<div className="progress-bar-wrapper">
						<div className="progress-bar" style={progressBarWidth} />
						<div className="progress-bar-hover" style={progressBarHoverWidth} />
					</div>
					{this.props.hoverTime * 100 / this.props.duration > 0 ? (
						<div className="cursor hover" style={cursorHover}>
							<div className="cursor-time">
								<span>{formatTime(this.props.hoverTime)}</span>
							</div>
						</div>
					) : (
						""
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		currentVideo: state.currentVideo,
		player: state.player,
		hoverTime: state.pageVideo.hoverTime
	};
}

export default connect(mapStateToProps, {
	updateCurrentVideo,
	updateHoverTime,
	updatePlaylist,
	seekToTime
})(ProgressBar);
