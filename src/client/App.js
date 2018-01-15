import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import Header from "./react/components/header/Header";
import { withRouter } from "react-router-dom";
import NavigationSidebar from "./react/components/navigation/NavigationSidebar";
import keydown from "react-keydown";

import { fetchCurrentUser } from "./redux/actions";

class App extends Component {
	static loadData(store, match) {
		return store.dispatch(fetchCurrentUser());
	}
	componentDidMount() {
		this.props.fetchCurrentUser();
	}
	@keydown("backspace")
	deleteClip() {
		console.log("delete clip");
	}
	render() {
		return (
			<div className="app-container">
				<Header />

				<div className="navigation-container">
					<NavigationSidebar {...this.props} />
				</div>

				<div className="route-container">
					{renderRoutes(this.props.route.routes)}
				</div>
			</div>
		);
	}
}

function mapStateToProps({}) {
	return {};
}

export default {
	component: connect(mapStateToProps, { fetchCurrentUser })(withRouter(App))
};
