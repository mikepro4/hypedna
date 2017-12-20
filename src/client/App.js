import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import Header from "./react/components/Header";

class App extends Component {
	render() {
		return (
			<div>
				<Header />
				{renderRoutes(this.props.route.routes)}
			</div>
		);
	}
}

export default {
	component: App
};
