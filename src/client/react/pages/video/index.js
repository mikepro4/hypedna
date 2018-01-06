import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
	loadHypednaVideoDetails,
	clearLoadedHypednaVideo
} from "../../../redux/actions/pageVideoActions";

class VideoPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadHypednaVideoDetails(match.params.googleId));
	}
	componentDidMount() {
		this.props.loadHypednaVideoDetails(this.props.match.params.googleId);
	}
	componentWillUnmount() {
		this.props.clearLoadedHypednaVideo();
	}
	renderHead = () => (
		<Helmet>
			<title>Video Page</title>
			<meta property="og:title" content="Videopage" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}
				{this.props.singleVideo.snippet ? (
					<div>{this.props.singleVideo.snippet.title}</div>
				) : (
					"nothing"
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	singleVideo: state.pageVideo.singleVideo
});

export default {
	component: withRouter(
		connect(mapStateToProps, {
			loadHypednaVideoDetails,
			clearLoadedHypednaVideo
		})(VideoPage)
	)
};
