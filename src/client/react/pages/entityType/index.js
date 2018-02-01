import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { loadAllEntityTypes } from "../../../redux/actions/pageEntityTypeActions";

import EntityTypeBrowser from "./EntityTypeBrowser";
import EntityTypeEditor from "./EntityTypeEditor";

class EntityPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadAllEntityTypes());
	}
	componentWillMount() {
		this.props.loadAllEntityTypes();
	}
	componentWillUnmount() {}
	renderHead = () => (
		<Helmet>
			<title>Entity Types Page</title>
			<meta property="og:title" content="EntityTypes" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="entity-page-container">
					<EntityTypeBrowser />

					<div className="entity-type-editor-container">
						<EntityTypeEditor />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default {
	component: withRouter(
		connect(mapStateToProps, { loadAllEntityTypes })(EntityPage)
	)
};
