import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import { Position, Toaster, Classes, Intent } from "@blueprintjs/core";

import OntologySettingsForm from "./OntologySettingsForm";

import {
	getEntityType,
	updateEntityType,
	loadAllEntityTypes
} from "../../../redux/actions/pageOntologyActions";

class OntologySettings extends Component {
	state = {};

	handleSubmit = values => {
		let entityType = this.props.getEntityType(this.props.selectedEntityTypeId);
		let updatedProperties = _.assign({}, entityType.genericProperties, values);
		let newEntityType = _.assign({}, entityType, {
			genericProperties: updatedProperties
		});

		this.props.updateEntityType(
			this.props.selectedEntityTypeId,
			newEntityType,
			() => {
				this.props.loadAllEntityTypes();
				this.showSuccessToast("Entity Type Updated");
			}
		);
	};

	showSuccessToast = (message, id) => {
		this.refs.toaster.show({
			message: message,
			intent: Intent.SUCCESS,
			iconName: "tick"
		});
	};

	render() {
		return (
			<div className="ontology-settings-container">
				<div className="settings-section">
					<div className="settings-section-content">
						<OntologySettingsForm
							ref="OntologySettingsForm"
							enableReinitialize={true}
							initialValues={
								this.props.getEntityType(this.props.selectedEntityTypeId)
									.genericProperties
							}
							onSubmit={this.handleSubmit.bind(this)}
						/>
						<Toaster position={Position.BOTTOM_RIGHT} ref="toaster" />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withRouter(
	connect(mapStateToProps, {
		getEntityType,
		updateEntityType,
		loadAllEntityTypes
	})(OntologySettings)
);
