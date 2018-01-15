import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import YoutubePlayer from "../../components/common/player/Player";
import { updateCurrentVideo } from "../../../redux/actions/";

class VideoSidebar extends Component {
	componentDidUpdate() {
		if (this.props.video.googleId !== this.props.currentVideo.videoId) {
			this.props.updateCurrentVideo(this.props.video.googleId, "paused");
		}
	}
	render() {
		return (
			<div className="video-sidebar-container">
				<div className="video-sidebar-content">
					<div className="sidebar-video-container" style={{ display: "none" }}>
						{this.props.currentVideo.videoId ? (
							<YoutubePlayer
								width="430"
								height="260"
								videoId={this.props.currentVideo.videoId}
							/>
						) : (
							""
						)}

						<button
							className="button"
							onClick={() => {
								this.props.updateCurrentVideo(
									this.props.video.googleId,
									"play"
								);
							}}
						>
							Play
						</button>

						<button
							className="button"
							onClick={() => {
								this.props.updateCurrentVideo(
									this.props.video.googleId,
									"pause"
								);
							}}
						>
							Pause
						</button>

						<button
							className="button"
							onClick={() => {
								this.props.updateCurrentVideo(
									this.props.video.googleId,
									"stop"
								);
							}}
						>
							Stop
						</button>
						{this.props.video.snippet ? (
							<div>{this.props.video.snippet.title}</div>
						) : (
							"nothing"
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	player: state.player,
	video: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching,
	currentVideo: state.currentVideo
});

export default withRouter(
	connect(mapStateToProps, { updateCurrentVideo })(VideoSidebar)
);
