import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class VideoContent extends Component {
	render() {
		return <div className="video-content-container">channels here</div>;
	}
}

const mapStateToProps = state => ({
	player: state.player,
	video: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching
});

export default withRouter(connect(mapStateToProps, {})(VideoContent));
