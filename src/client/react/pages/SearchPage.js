import React, { Component } from "react";
import { Helmet } from "react-helmet";

class SearchPage extends Component {
	renderHead = () => (
		<Helmet>
			<title>Search Page</title>
			<meta property="og:title" content="Searchpage" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">search page</div>
			</div>
		);
	}
}

export default { component: SearchPage };
