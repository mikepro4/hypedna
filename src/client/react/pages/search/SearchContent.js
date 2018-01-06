import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { deleteVideo } from "../../../redux/actions/objectVideoActions";

class SearchContent extends Component {
	deleteVideo = id => {
		this.props.deleteVideo(id, this.props.refreshSearch);
	};
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
							<a
								onClick={() => {
									this.deleteVideo(video.googleId);
								}}
							>
								delete video
							</a>
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

export default withRouter(
	connect(mapStateToProps, { deleteVideo })(SearchContent)
);
