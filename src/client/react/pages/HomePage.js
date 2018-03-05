import React, { Component } from "react";
import { Helmet } from "react-helmet";

class HomePage extends Component {
	componentDidMount() {
		console.log("render home page");
	}
	renderHead = () => (
		<Helmet>
			<title>Home Page</title>
			<meta property="og:title" content="Homepage" />
		</Helmet>
	);
	render() {
		// console.log(this.props);
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">home page test</div>
			</div>
		);
	}
}

export default { component: HomePage };
