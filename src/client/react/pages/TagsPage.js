import React, { Component } from "react";
import { Helmet } from "react-helmet";

class TagsPage extends Component {
	renderHead = () => (
		<Helmet>
			<title>Tags Page</title>
			<meta property="og:title" content="Tagspage" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">tags page</div>
			</div>
		);
	}
}

export default { component: TagsPage };
