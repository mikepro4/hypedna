import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EntityTypeEditorForm from "./EntityTypeEditorForm";
import {
	updateEntityType,
	loadAllEntityTypes
} from "../../../redux/actions/pageEntityTypeActions";
import update from "immutability-helper";

import qs from "qs";

class EntityEditor extends Component {
	handleFormSubmit = values => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.browser.selectedEntityType;
		});

		let newEntityType = entityType[0];

		newEntityType.genericProperties = values;

		console.log("values from submit: ", newEntityType);
		this.props.updateEntityType(
			this.props.browser.selectedEntityType,
			newEntityType,
			test => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	updateQueryString = updatedState => {
		let queryParams = this.getQueryParams();
		const updatedQuery = _.assign({}, queryParams, updatedState);
		const str = qs.stringify(updatedQuery);
		this.props.history.push({
			search: "?" + str
		});
	};

	render() {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.browser.selectedEntityType;
		});
		let initialState = {};
		if (!_.isEmpty(entityType[0])) {
			initialState = {
				initialValues: {
					displayName: entityType[0].genericProperties.displayName
				}
			};
		}

		return (
			<div className="entity-editor">
				{this.props.browser.selectedEntityType ? (
					<EntityTypeEditorForm
						{...initialState}
						onSubmit={this.handleFormSubmit.bind(this)}
						enableReinitialize="true"
						onChange={values => {
							console.log(values);
						}}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	form: state.form,
	browser: state.pageEntityType.browser,
	editor: state.pageEntityType.editor,
	isFetchingBrowser: state.pageEntityType.isFetchingBrowser,
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(
	connect(mapStateToProps, { updateEntityType, loadAllEntityTypes })(
		EntityEditor
	)
);
