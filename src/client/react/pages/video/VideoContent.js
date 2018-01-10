import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import PlayCircleOutline from "material-ui-icons/PlayCircleOutline";
import PauseCircleOutline from "material-ui-icons/PauseCircleOutline";
import IconButton from "material-ui/IconButton";
import {
	addTrack,
	deleteTrack,
	updateTrack
} from "../../../redux/actions/objectVideoActions";
import { formatTime } from "../../../utils/timeFormatter";
import ProgressBar from "../../components/common/player/ProgressBar";
import { updateCurrentVideo } from "../../../redux/actions/";

const styles = theme => ({
	iconClass: {
		width: "30px",
		height: "30px"
	}
});

class VideoContent extends Component {
	render() {
		return (
			<div className="video-content-container">
				<div className="video-timeline-container">
					{this.props.video.contentDetails && this.props.player ? (
						<div className="video-progress-elements">
							<div className="video-progress-time">
								<div className="time-wrapper">
									<div className="time-current-time">
										{formatTime(this.props.player.currentTime)}
									</div>
									<div className="time-divider">/</div>
									<div className="time-duration">
										{formatTime(this.props.video.contentDetails.duration)}
									</div>
								</div>
								<div className="track-global-play-controls">
									{this.props.currentVideo.playerAction == "paused" ||
									this.props.currentVideo.playerAction == "stopped" ||
									this.props.currentVideo.playerAction == "pause" ||
									this.props.currentVideo.playerAction == "play" ||
									this.props.currentVideo.playerAction == "waiting" ? (
										<IconButton
											className={this.props.classes.iconClass}
											onClick={() => {
												this.props.updateCurrentVideo(
													this.props.video.googleId,
													"play"
												);
											}}
										>
											<PlayCircleOutline />
										</IconButton>
									) : (
										""
									)}

									{this.props.currentVideo.playerAction == "playing" ? (
										<IconButton
											className={this.props.classes.iconClass}
											onClick={() => {
												this.props.updateCurrentVideo(
													this.props.video.googleId,
													"pause"
												);
											}}
										>
											<PauseCircleOutline />
										</IconButton>
									) : (
										""
									)}
								</div>
							</div>
							<ProgressBar
								duration={moment
									.duration(this.props.video.contentDetails.duration)
									.asSeconds()}
							/>
						</div>
					) : (
						""
					)}
				</div>
				<div className="video-tracks-container">
					<div className="video-track-groups">
						<div className="video-track-single-group">
							<h1>Group 1</h1>
							<div className="video-track-list">
								{this.props.video.tracks ? (
									<div className="video-tracks">
										{this.props.video.tracks.map(track => (
											<div className="video-single-track" key={track._id}>
												<div className="video-single-track-info">
													<div className="entity-avatar" />
													<div className="enitity-display-name">
														{track.category}
													</div>

													<div className="track-play-button">
														<IconButton
															className={this.props.classes.iconClass}
														>
															<PlayCircleOutline />
														</IconButton>
													</div>
												</div>
												<div className="video-single-track-clips">
													<button
														onClick={() => {
															this.props.deleteTrack(
																this.props.video.googleId,
																track._id
															);
														}}
													>
														delete
													</button>
													<button
														onClick={() => {
															this.props.updateTrack(
																this.props.video.googleId,
																track._id,
																"updated category"
															);
														}}
													>
														update category
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									"no tracks"
								)}
							</div>
							<button
								onClick={() => {
									this.props.addTrack(this.props.video.googleId, {
										category: "created by user _id from backend"
									});
								}}
							>
								add track
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.auth,
	player: state.player,
	video: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching,
	currentVideo: state.currentVideo
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			addTrack,
			deleteTrack,
			updateTrack,
			updateCurrentVideo
		})(VideoContent)
	)
);
