import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
	addTrack,
	deleteTrack,
	updateTrack
} from "../../../redux/actions/objectVideoActions";

class VideoContent extends Component {
	render() {
		return (
			<div className="video-content-container">
				<div className="video-timeline-container">timeline</div>
				<div className="video-tracks-container">
					<div className="video-track-groups">
						<div className="video-track-single-group">
							<h1>Group 1</h1>
							<div className="video-track-list">
								{this.props.video.tracks ? (
									<div>
										{this.props.video.tracks.map(track => (
											<div key={track._id}>
												<div> Category: {track.category}</div>
												<div>
													Actions:
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
	isFetching: state.pageVideo.isFetching
});

export default withRouter(
	connect(mapStateToProps, { addTrack, deleteTrack, updateTrack })(VideoContent)
);
