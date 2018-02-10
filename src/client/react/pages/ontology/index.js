import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import { updateQueryString } from "../../../redux/actions/";

import {
	loadAllEntityTypes,
	selectEntityType
} from "../../../redux/actions/pageOntologyActions";

import OntologyBrowser from "./OntologyBrowser";
import OntologyEditor from "./OntologyEditor";
import OntologyLinker from "./OntologyLinker";
import OntologyPropertyCreator from "./OntologyPropertyCreator";

class OntologyPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadAllEntityTypes());
	}

	componentWillMount() {
		this.props.loadAllEntityTypes();
	}

	updateSelectedEntityType = value => {
		this.props.selectEntityType(value);
		this.props.updateQueryString(
			{ selectedEntityTypeId: value },
			this.props.location,
			this.props.history
		);
	};

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
					<div className="ontology-browser-container">
						<OntologyBrowser
							updateSelectedEntityType={this.updateSelectedEntityType}
						/>
					</div>

					<div className="ontology-editor-container">
						<OntologyEditor
							updateSelectedEntityType={this.updateSelectedEntityType}
						/>
					</div>
				</div>

				{this.props.isFetchingEntityTypes ? (
					<div className="ontology-loader">Loading...</div>
				) : (
					""
				)}

				<OntologyLinker />
				<OntologyPropertyCreator />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isFetchingEntityTypes: state.pageOntology.isFetchingEntityTypes
});

export default {
	component: withRouter(
		connect(mapStateToProps, {
			loadAllEntityTypes,
			updateQueryString,
			selectEntityType
		})(OntologyPage)
	)
};
