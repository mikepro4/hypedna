import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { deleteVideo } from "../../../redux/actions/objectVideoActions";
import {
	updatePlayerVideo,
	updatePlayerStatus
} from "../../../redux/actions/player";
import { updateCurrentVideo } from "../../../redux/actions/";
import classNames from "classnames";

class SearchResultItem extends Component {
	deleteVideo = () => {
		this.props.deleteVideo(this.props.video.googleId, this.props.refreshSearch);
	};
	playVideo = () => {
		this.props.updateCurrentVideo(this.props.video.googleId, "play");
	};
	render() {
		const { googleId, snippet } = this.props.video;
		const activeVideo =
			this.props.video.googleId == this.props.currentVideo.videoId;
		let controlsClasses = classNames({
			video_actions: true,
			play:
				!activeVideo ||
				(this.props.currentVideo.playerAction != "playing" && activeVideo),
			pause: this.props.currentVideo.playerAction === "playing" && activeVideo,
			stop: this.props.currentVideo.playerAction === "playing" && activeVideo,
			seek: true
		});
		return (
			<div className="search-result-item">
				<h1>{snippet.title}</h1>
				<img src={snippet.thumbnails.default.url} />
				<ul className={controlsClasses}>
					<li>
						<a
							className="button"
							onClick={() => {
								this.deleteVideo();
							}}
						>
							Delete
						</a>
					</li>
					<li>
						<Link to={`/video/edit/${googleId}`} className="button">
							Edit
						</Link>
					</li>
					<li>
						<Link to={`/video/${googleId}`} className="button">
							View
						</Link>
					</li>
					<li className="play">
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
					</li>
					<li className="pause">
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
					</li>
					<li className="stop">
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
					</li>
					<li className="seek">
						<button
							className="button"
							onClick={() => {
								this.props.updateCurrentVideo(
									this.props.video.googleId,
									"seek",
									30
								);
							}}
						>
							Seek to 0:30
						</button>
					</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	player: state.player,
	currentVideo: state.currentVideo
});

export default withRouter(
	connect(mapStateToProps, {
		deleteVideo,
		updateCurrentVideo
	})(SearchResultItem)
);
