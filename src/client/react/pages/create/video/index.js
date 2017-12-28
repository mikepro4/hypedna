import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";

class CreateVideoPage extends Component {
	render() {
		return (
			<div className="route-content-container">Video form and player here</div>
		);
	}
}

export default { component: CreateVideoPage };
