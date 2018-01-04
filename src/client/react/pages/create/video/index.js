import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import VideoAddForm from "./Video_add_form";
import { youtubeUrlParser } from "../../../../utils/youtube";
import {
	loadYoutubeVideoDetails,
	addYoutubeVideo
} from "../../../../redux/actions";
import { updatePlayerVideo } from "../../../../redux/actions/player";
import YoutubePlayer from "../../../components/common/player/Player";
import moment from "moment";

const styles = theme => ({
	menuText: {}
});

class CreateVideoPage extends Component {
	handleFormSubmit = ({ url }) => {
		this.props.loadYoutubeVideoDetails(youtubeUrlParser(url), history);
	};

	handleAddVideo = () => {
		this.props.addYoutubeVideo(
			this.props.player.playingVideoId,
			this.props.history,
			() => {
				console.log("callback");
			}
		);
	};

	render() {
		console.log(this.props);
		return (
			<div className="route-content-container">
				<h3
					style={{
						margin: "0 0 5px 0",
						fontSize: "20px"
					}}
				>
					Add Video
				</h3>
				<div className="video-add-form">
					<VideoAddForm
						onSubmit={this.handleFormSubmit.bind(this)}
						onChange={values => {
							if (youtubeUrlParser(values.url)) {
								this.handleFormSubmit({ url: values.url });
							} else {
							}
						}}
					/>
				</div>

				<div className="loaded-video-container">
					{this.props.player.playingVideoId ? (
						<div className="loaded-video-container">
							<div className="loaded-video-player-area">
								<YoutubePlayer
									width="680"
									height="380"
									videoId={this.props.player.playingVideoId}
								/>
								<div className="video-description">
									<h2 className="video-title">
										{this.props.video.snippet.title}
									</h2>
								</div>
							</div>
							<button onClick={this.handleAddVideo}>add video</button>
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
		form: state.form,
		video: state.video.singleVideo,
		player: state.player
	};
}

export default {
	component: connect(mapStateToProps, {
		loadYoutubeVideoDetails,
		addYoutubeVideo
	})(withStyles(styles)(withRouter(CreateVideoPage)))
};
