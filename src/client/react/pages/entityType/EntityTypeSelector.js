import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import classNames from "classnames";
import qs from "qs";
import Select from "react-select";

class EntityTypeSelector extends Component {
	state = {};

	updateValue = value => {
		this.props.loadCustomEntity(value);
	};

	render() {
		let entityTypes = _.map(this.props.allEntityTypes, entityType => {
			return {
				id: entityType._id,
				name: entityType.genericProperties.displayName
			};
		});
		return (
			<div>
				<Select
					ref="citySelect"
					options={entityTypes}
					simpleValue
					clearable
					name="select-city"
					onChange={this.updateValue}
					searchable
					labelKey="name"
					valueKey="id"
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(connect(mapStateToProps, {})(EntityTypeSelector));
