import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { deleteVideo } from "../../../redux/actions/objectVideoActions";
import {
	updatePlayerVideo,
	updatePlayerStatus
} from "../../../redux/actions/player";
import { updateCurrentVideo } from "../../../redux/actions/";
import YoutubePlayer from "../../components/common/player/Player";
import PlayerControls from "../../components/common/player/PlayerControls";

class SearchContent extends Component {
	deleteVideo = id => {
		this.props.deleteVideo(id, this.props.refreshSearch);
	};

	playVideo = id => {
		this.props.updateCurrentVideo(id, "play");
	};
	renderResults() {
		if (this.props.isFetching && this.props.searchResults.length === 0) {
			return <div>Loading</div>;
		} else {
			return (
				<ul>
					{this.props.searchResults.map(video => (
						<li key={video.googleId}>
							{video.googleId}
							<Link to={`/video/${video.googleId}`}>Open Video</Link>
							<a
								onClick={() => {
									this.deleteVideo(video.googleId);
								}}
							>
								delete video
							</a>

							<a
								onClick={() => {
									this.props.updateCurrentVideo(video.googleId, "play");
								}}
							>
								play video
							</a>

							<a
								onClick={() => {
									this.props.updateCurrentVideo(video.googleId, "pause");
								}}
							>
								pause video
							</a>
						</li>
					))}
				</ul>
			);
		}
	}
	render() {
		return (
			<div className="search-content-container">
				<div className="search-content">
					<div className="search-player-area">
						{this.props.currentVideo.videoId ? (
							<div className="player-temp-container">
								<YoutubePlayer
									width="300"
									height="180"
									videoId={this.props.currentVideo.videoId}
								/>
							</div>
						) : (
							""
						)}
					</div>
					{this.renderResults()}
				</div>
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
	})(SearchContent)
);
