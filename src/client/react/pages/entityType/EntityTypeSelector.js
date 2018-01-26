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

	onChange = value => {
		this.props.onChange(value);
	};

	render() {
		let sortedEntities = _.orderBy(
			this.props.allEntityTypes,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);
		let entityTypes = _.map(sortedEntities, entityType => {
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
					onChange={this.onChange}
					searchable
					labelKey="name"
					valueKey="id"
					placeholder="Type Entity Type Name..."
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(connect(mapStateToProps, {})(EntityTypeSelector));
