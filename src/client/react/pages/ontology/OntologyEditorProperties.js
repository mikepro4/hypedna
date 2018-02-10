import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";

import {
	loadAllEntityTypes,
	getEntityType,
	showPropertyCreator,
	removeCustomProperty
} from "../../../redux/actions/pageOntologyActions";

import Input from "../../components/common/form/Input";
import Textarea from "../../components/common/form/Textarea";
import Checkbox from "../../components/common/form/Checkbox";
import Select from "../../components/common/form/Select";

import OntologyAddEntityForm from "./OntologyAddEntityForm";

class OntologyEditorProperties extends Component {
	state = {};

	removeCustomProperty = propertyId => {
		this.props.removeCustomProperty(
			this.props.selectedEntityTypeId,
			propertyId
		);
	};

	handleSubmit = values => {
		console.log(values);
	};

	getInitialValues = entityType => {
		let initial = _.map(entityType.customProperties, property => {
			return {
				key: property.propertyName,
				value: property.defaultValue
			};
		});

		let initialObject = {};
		for (let i = 0; i < initial.length; i++) {
			let value;

			if (initial[i].value == "true") {
				value = true;
			} else if (initial[i].value == "false") {
				value = false;
			} else {
				value = initial[i].value;
			}

			_.extend(initialObject, {
				[initial[i].key]: value
			});
		}

		console.log(initialObject);

		return initialObject;
	};

	render() {
		let entityType = this.props.getEntityType(this.props.selectedEntityTypeId);

		return (
			<div className="ontology-editor-properties">
				<div className="properties-section">
					<div className="properties-section-header">
						<div className="header-left">
							<span className="pt-icon-large pt-icon-form" />
							<h1>10 Properties</h1>
						</div>
						<div className="header-right">
							<a
								className="anchor-button"
								onClick={this.props.showPropertyCreator}
							>
								<span className="pt-icon-standard pt-icon-add" />Create New
								Property
							</a>
						</div>
					</div>

					<div className="properties-section-content">
						<OntologyAddEntityForm
							ref="addEntityForm"
							initialValues={this.getInitialValues(entityType)}
							customProperties={entityType.customProperties}
							onSubmit={this.handleSubmit.bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withRouter(
	connect(mapStateToProps, {
		loadAllEntityTypes,
		getEntityType,
		showPropertyCreator,
		removeCustomProperty
	})(OntologyEditorProperties)
);
