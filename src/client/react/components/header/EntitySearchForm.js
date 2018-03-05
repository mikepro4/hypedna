import React, { PropTypes } from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { searchEntities } from "../../../redux/actions/pageOntologyActions";

import ReactSelectAsync from "../common/form/ReactSelectAsync";

class EntitySearchForm extends React.Component {
	getOptions = (input, callback, entityType) => {
		this.props.searchEntities(
			{ displayName: input, entityType: entityType ? entityType : "" },
			"displayName",
			0,
			20,
			data => {
				callback(null, {
					options: data.all.map(entity => ({
						value: entity.properties.entityUrlName,
						label: entity.properties.displayName
					})),
					complete: true
				});
			}
		);
	};

	render() {
		const { handleSubmit } = this.props;

		return (
			<Form
				onSubmit={handleSubmit}
				autoComplete="off"
				role="presentation"
				className=""
			>
				<Field
					name="entityUrlName"
					component={ReactSelectAsync}
					loadOptions={(input, callback) => this.getOptions(input, callback)}
					placeholder="Search people, sounds, instruments and other entities..."
					ref="entitySearch"
				/>
			</Form>
		);
	}
}

const validate = values => {
	const errors = {};

	return errors;
};

EntitySearchForm = reduxForm({
	form: "mainEntitySearchForm",
	validate
})(EntitySearchForm);

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
	searchEntities
})(EntitySearchForm);
