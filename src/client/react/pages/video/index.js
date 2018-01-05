import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { loadHypednaVideoDetails } from "../../../redux/actions/videoPageActions";
import { matchRoutes } from "react-router-config";

class VideoPage extends Component {
	componentDidMount() {
		this.props.loadHypednaVideoDetails(this.props.match.params.googleId);
	}
	renderHead = () => (
		<Helmet>
			<title>Video Page</title>
			<meta property="og:title" content="Videopage" />
		</Helmet>
	);
	render() {
		console.log(this.props.match.params.googleId);
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">video page</div>
			</div>
		);
	}
}

function mapStateToProps({}) {
	return {};
}

export default {
	component: connect(mapStateToProps, { loadHypednaVideoDetails })(
		withRouter(VideoPage)
	),
	loadData: ({ dispatch }) => {
		// dispatch(loadHypednaVideoDetails("y7-AucZ9aSY"));
	}
};
