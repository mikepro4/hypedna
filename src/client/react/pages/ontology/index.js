import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { loadAllEntityTypes } from "../../../redux/actions/pageEntityTypeActions";

import OntologyBrowser from "./OntologyBrowser";
import OntologyEditor from "./OntologyEditor";

class OntologyPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadAllEntityTypes());
	}
	componentWillMount() {
		this.props.loadAllEntityTypes();
	}
	componentWillUnmount() {}
	renderHead = () => (
		<Helmet>
			<title>Ontology Manager Page</title>
			<meta property="og:title" content="EntityTypes" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="ontology-page-container">
					<OntologyBrowser />

					<div className="ontology-editor-container">
						<OntologyEditor />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default {
	component: withRouter(
		connect(mapStateToProps, { loadAllEntityTypes })(OntologyPage)
	)
};
