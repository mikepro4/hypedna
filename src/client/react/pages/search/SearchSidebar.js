import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class SearchSidebar extends Component {
	render() {
		return (
			<div className="search-sidebar-container">
				<div className="search-sidebar">search sidebar</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(SearchSidebar));
