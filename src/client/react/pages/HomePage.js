import React, { Component } from "react";
import { Helmet } from "react-helmet";

class HomePage extends Component {
	componentDidMount() {
		console.log("test");
	}
	renderHead = () => (
		<Helmet>
			<title>Hello</title>
			<meta property="og:title" content="Homepage" />
		</Helmet>
	);
	render() {
		// console.log(this.props);
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">home page</div>
			</div>
		);
	}
}

export default { component: HomePage };
