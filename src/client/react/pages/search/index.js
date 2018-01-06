import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
	searchVideos,
	clearLoadedSearchResults
} from "../../../redux/actions/pageSearchActions";

class SearchPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(searchVideos({}, "snippet.publishedAt"));
	}
	componentDidMount() {
		this.props.searchVideos({}, "snippet.publishedAt");
	}
	componentWillUnmount() {
		this.props.clearLoadedSearchResults();
	}
	renderHead = () => (
		<Helmet>
			<title>Search Page</title>
			<meta property="og:title" content="Searchpage" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">search page</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	searchResults: state.pageSearch.searchResults,
	isFetching: state.pageSearch.isFetching
});

export default {
	component: withRouter(
		connect(mapStateToProps, { searchVideos, clearLoadedSearchResults })(
			SearchPage
		)
	)
};
