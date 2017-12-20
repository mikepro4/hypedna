import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import Header from "./react/components/header/Header";
import NavigationSidebar from "./react/components/navigation/NavigationSidebar";

class App extends Component {
	render() {
		return (
			<div className="app-container">
				<Header />

				<div className="navigation-container">
					<NavigationSidebar />
				</div>

				<div className="route-container">
					{renderRoutes(this.props.route.routes)}
				</div>
			</div>
		);
	}
}

export default {
	component: App
};
