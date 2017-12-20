import React, { Component } from "react";
import { connect } from "react-redux";

class NavigationSidebar extends Component {
	render() {
		return <div>connected component</div>;
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(NavigationSidebar);

