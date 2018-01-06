import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

class SearchContent extends Component {
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
						</li>
					))}
				</ul>
			);
		}
	}
	render() {
		return (
			<div className="search-content-container">
				<div className="search-content">{this.renderResults()}</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(SearchContent));
