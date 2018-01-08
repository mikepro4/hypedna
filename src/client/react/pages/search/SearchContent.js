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
import SearchResultItem from "./SearchResultItem";

class SearchContent extends Component {
	deleteVideo = id => {
		this.props.deleteVideo(id, this.props.refreshSearch);
	};

	playVideo = id => {
		this.props.updateCurrentVideo(id, "play");
	};

	renderSearchResultItems() {
		if (this.props.isFetching && this.props.searchResults.length === 0) {
			return <div>Loading</div>;
		} else {
			return (
				<div>
					{this.props.searchResults.map(video => (
						<SearchResultItem
							key={video._id}
							video={video}
							refreshSearch={this.props.refreshSearch}
						/>
					))}
				</div>
			);
		}
	}
	render() {
		return (
			<div className="search-content-container">
				<div className="search-content">
					<div className="search-player-area">
						<div className="player-temp-container">
							{this.props.currentVideo.videoId ? (
								<YoutubePlayer
									width="300"
									height="180"
									videoId={this.props.currentVideo.videoId}
								/>
							) : (
								""
							)}
						</div>
					</div>
					{this.renderSearchResultItems()}
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
