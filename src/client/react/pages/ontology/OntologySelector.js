import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import classNames from "classnames";
import qs from "qs";
import Select from "react-select";

class OntologySelector extends Component {
	state = {
		value: ""
	};
	onChange = value => {
		this.props.onChange(value);
		this.setState({ value });
	};

	onNewOptionClick = value => {
		console.log(value);
	};

	shouldComponentUpdate = () => {
		return true;
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
			<Select
				ref="citySelect"
				options={entityTypes}
				simpleValue
				clearable
				value={
					_.isEmpty(this.state.value)
						? this.props.initialState
						: this.state.value
				}
				name="select-city"
				onChange={this.onChange}
				onNewOptionClick={this.onNewOptionClick}
				searchable
				labelKey="name"
				valueKey="id"
				placeholder={<span>Type Entity Type Name...</span>}
			/>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(connect(mapStateToProps, {})(OntologySelector));
