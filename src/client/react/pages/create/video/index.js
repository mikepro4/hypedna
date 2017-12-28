import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";

class CreateVideoPage extends Component {
	render() {
		return (
			<div className="route-content-container">
				<div style={{ height: "1000px" }}>Video form and player here</div>
			</div>
		);
	}
}

export default { component: CreateVideoPage };
