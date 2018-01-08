import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { updateCurrentVideo } from "../../../../redux/actions";
import { updateTime } from "../../../../redux/actions/player";
import _ from "lodash";

class PlayerControls extends React.Component {
	onPlay() {
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "play");
	}

	onPause() {
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "pause");
	}

	onStop() {
		this.props.updateCurrentVideo(this.props.currentVideo.videoId, "stop");
		setTimeout(() => {
			this.props.updateTime(0, 0, null);
		}, 500);
	}

	render() {
		let { Play, Pause, Stop } = false;

		switch (this.props.currentVideo.playerAction) {
			case undefined:
				Play = true;
				break;
			case "playing":
				Play = false;
				Pause = true;
				Stop = true;
				break;
			case "play":
				Play = false;
				Pause = true;
				Stop = true;
				break;
			case "waiting":
				Play = false;
				Pause = true;
				Stop = true;
				break;
			case "pause":
				Play = true;
				Pause = false;
				Stop = true;
				break;
			case "paused":
				Play = true;
				Pause = false;
				Stop = true;
				break;
			case "stopped" || "stop":
				Play = true;
				Pause = false;
				Stop = false;
				break;
			case "stopped" || "stop":
				Play = true;
				Pause = false;
				Stop = false;
				break;
		}

		return (
			<ul className="player_controls_container">
				{Play ? (
					<li className="play">
						<button onClick={this.onPlay.bind(this)} className="button">
							Play
						</button>
					</li>
				) : (
					""
				)}

				{Pause ? (
					<li className="pause">
						<button onClick={this.onPause.bind(this)} className="button">
							Pause
						</button>
					</li>
				) : (
					""
				)}

				{Stop ? (
					<li className="stop">
						<button onClick={this.onStop.bind(this)} className="button">
							Stop
						</button>
					</li>
				) : (
					""
				)}
			</ul>
		);
	}
}

function mapStateToProps(state) {
	return { player: state.player, currentVideo: state.currentVideo };
}

export default connect(mapStateToProps, {
	updateCurrentVideo,
	updateTime
})(PlayerControls);
