import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import keydown from "react-keydown";

import {
	loadHypednaVideoDetails,
	clearLoadedHypednaVideo
} from "../../../redux/actions/pageVideoActions";
import {
	resizeClipRight,
	resizeClipLeft,
	moveClipRight,
	moveClipLeft
} from "../../../redux/actions/objectTrackActions";

import { updateTime } from "../../../redux/actions/player";
import VideoSidebar from "./VideoSidebar";
import VideoContent from "./VideoContent";

class VideoPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadHypednaVideoDetails(match.params.googleId));
	}
	componentDidMount() {
		this.props.loadHypednaVideoDetails(this.props.match.params.googleId);
	}
	componentWillUnmount() {
		this.props.clearLoadedHypednaVideo();
		this.props.updateTime(0, 0);
	}
	renderHead = () => (
		<Helmet>
			<title>Video Page</title>
			<meta property="og:title" content="Videopage" />
		</Helmet>
	);

	@keydown(39)
	moveClipRight() {
		this.props.moveClipRight();
	}

	@keydown(37)
	moveClipLeft() {
		this.props.moveClipLeft();
	}

	@keydown(["shift + right"])
	longMoveClipRight() {
		this.props.moveClipRight();
	}

	@keydown(["shift + left"])
	longMoveClipLeft() {
		this.props.moveClipLeft();
	}

	@keydown(["cmd + right", "ctrl + right"])
	resizeClipRight(event) {
		event.preventDefault();
		this.props.resizeClipRight();
	}

	@keydown(["cmd + left", "ctrl + left"])
	resizeClipLeft(event) {
		event.preventDefault();
		this.props.resizeClipLeft();
	}

	@keydown(["shift + cmd + right", "shift + ctrl + right"])
	longResizeClipRight(event) {
		event.preventDefault();
		this.props.resizeClipRight();
	}

	@keydown(["shift + cmd + left", "shift + ctrl + left"])
	longResizeClipLeft(event) {
		console.log("here");
		event.preventDefault();
		this.props.resizeClipLeft();
	}
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}
				<VideoSidebar />
				<VideoContent />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	singleVideo: state.pageVideo.singleVideo,
	isFetching: state.pageVideo.isFetching
});

export default {
	component: withRouter(
		connect(mapStateToProps, {
			loadHypednaVideoDetails,
			clearLoadedHypednaVideo,
			updateTime,
			resizeClipRight,
			resizeClipLeft,
			moveClipRight,
			moveClipLeft
		})(VideoPage)
	)
};
