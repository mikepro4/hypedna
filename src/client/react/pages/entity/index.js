import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { loadEntityDetails } from "../../../redux/actions/pageEntityActions";
import EntityDetails from "./EntityDetails";

class EntityPage extends Component {
	static loadData(store, match, route, path, query) {
		return store.dispatch(loadEntityDetails(match.params.entityUrlName));
	}
	componentWillMount() {
		this.props.loadEntityDetails(this.props.match.params.entityUrlName);
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.match.params.entityUrlName !==
			this.props.match.params.entityUrlName
		) {
			this.props.loadEntityDetails(this.props.match.params.entityUrlName);
		}
	};
	renderHead = () => (
		<Helmet>
			<title>Entity Page</title>
			<meta property="og:title" content="Entity Page" />
		</Helmet>
	);
	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				{this.props.entity ? <EntityDetails /> : "not found"}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	entity: state.pageEntity.entity,
	allEntityTypes: state.pageOntology.allEntityTypes
});

export default {
	component: withRouter(
		connect(mapStateToProps, { loadEntityDetails })(EntityPage)
	)
};
