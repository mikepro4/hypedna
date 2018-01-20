import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { loadAllEntityTypes } from "../../../redux/actions/pageEntityTypeActions";

import EntityTypeBrowser from "./EntityTypeBrowser";
import EntityTypeEditor from "./EntityTypeEditor";

class EntityPage extends Component {
	componentDidMount() {
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
					<div className="entity-type-browser-container">
						<EntityTypeBrowser />
					</div>

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
