import React, { Component } from "react";
import { Helmet } from "react-helmet";

class AddVideo extends Component {
	renderHead = () => (
		<Helmet>
			<title>Add Page</title>
			<meta property="og:title" content="Addpage" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">add video</div>
			</div>
		);
	}
}

export default { component: AddVideo };
