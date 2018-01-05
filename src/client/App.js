import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import Header from "./react/components/header/Header";
import NavigationSidebar from "./react/components/navigation/NavigationSidebar";
import { fetchCurrentUser } from "./redux/actions";

class App extends Component {
	componentDidMount() {
		this.props.fetchCurrentUser();
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
	component: connect(mapStateToProps, { fetchCurrentUser })(App)
	// loadData: ({ dispatch }) => dispatch(fetchCurrentUser())
};
