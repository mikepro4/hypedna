import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import { Position, Toaster, Classes, Intent } from "@blueprintjs/core";

import EntityPropertiesForm from "./EntityPropertiesForm";

import { updateEntity } from "../../../redux/actions/pageEntityActions";

class EntityProperties extends Component {
	state = {};

	handleSubmit = values => {
		let newEntity = _.assign({}, this.props.entity, {
			properties: values
		});

		this.props.updateEntity(this.props.entity._id, newEntity, () => {
			this.showSuccessToast("Entity Updated");
		});
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
			<div className="entity-properties-container">
				<div className="properties-section">
					<div className="properties-section-content">
						<EntityPropertiesForm
							ref="editEntityForm"
							enableReinitialize={true}
							initialValues={this.props.entity.properties}
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
	entity: state.pageEntity.entity
});

export default withRouter(
	connect(mapStateToProps, { updateEntity })(EntityProperties)
);
