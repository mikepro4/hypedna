import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class SearchSidebar extends Component {
	render() {
		return (
			<div className="search-sidebar-container">
				<div className="search-sidebar-content">
					<div className="sidebar-description">
						<h3 className="sidebar-title">Search Videos</h3>
						<p className="sidebar-subtitle">
							Search for people, topics, activities, locations etc.
						</p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(SearchSidebar));
