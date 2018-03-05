import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import * as objTraverse from "obj-traverse/lib/obj-traverse";

import { Dialog, Button, Intent, ButtonGroup } from "@blueprintjs/core";

import {
	hidePropertyCreator,
	loadAllEntityTypes,
	addCustomProperty,
	updateCustomProperty
} from "../../../redux/actions/pageOntologyActions";

import { submit } from "redux-form";

import PropertyEditorForm from "./OntologyPropertyForm";

class OntologyPropertyCreator extends Component {
	componentDidUpdate = (prevProps, prevState) => {};

	onClose = () => {
		this.props.hidePropertyCreator();
	};

	handleSubmit = values => {
		let newValues;

		if (values.fieldType == "entitySelector") {
			newValues = _.assign({}, values, { propertyName: values.entityType });
		} else {
			newValues = values;
		}
		console.log(newValues);

		this.onClose();
		if (this.props.selectedProperty && this.props.selectedProperty._id) {
			this.props.updateCustomProperty(
				this.props.selectedEntityTypeId,
				this.props.selectedProperty._id,
				newValues
			);
		} else {
			this.props.addCustomProperty(this.props.selectedEntityTypeId, values);
		}
	};

	render() {
		return (
			<div>
				<Dialog
					isOpen={this.props.propertyCreatorOpen}
					onClose={this.onClose}
					title="Property Creator"
					className="property-creator"
				>
					<div className="pt-dialog-body" className="property-creator-dialog">
						{this.props.selectedProperty && this.props.selectedProperty._id ? (
							<div className="dialog-header">
								<span className="pt-icon-large pt-icon-edit" />
								<h1>
									Editing Property: {this.props.selectedProperty.displayName}
								</h1>
							</div>
						) : (
							<div className="dialog-header">
								<span className="pt-icon-large pt-icon-add" />
								<h1>New Custom Property</h1>
							</div>
						)}

						<div className="dialog-content">
							<PropertyEditorForm
								ref="propertyForm"
								initialValues={this.props.selectedProperty}
								enableReinitialize={true}
								onSubmit={this.handleSubmit.bind(this)}
							/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	allEntityTypes: state.pageOntology.allEntityTypes,
	propertyCreatorOpen: state.pageOntology.propertyCreatorOpen,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	selectedProperty: state.pageOntology.selectedProperty
});

export default withRouter(
	connect(mapStateToProps, {
		hidePropertyCreator,
		loadAllEntityTypes,
		addCustomProperty,
		updateCustomProperty
	})(OntologyPropertyCreator)
);
