import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";
import update from "immutability-helper";

import InputFilter from "../../components/common/filter/InputFilter";

import { searchEntities } from "../../../redux/actions/pageOntologyActions";

import ReactSelectAsync from "../../components/common/form/ReactSelectAsync";

class EntitySearchForm extends React.Component {
	state = {};

	componentDidUpdate = prevProps => {
		if (this.props.selectedEntityTypeId !== prevProps.selectedEntityTypeId) {
			console.log(this.props);
			this.props.reset();
		}
	};

	getOptions = (input, callback) => {
		this.props.searchEntities(
			{ displayName: input, entityType: this.props.selectedEntityTypeId },
			"displayName",
			0,
			20,
			data => {
				console.log(data.all);
				callback(null, {
					options: data.all.map(entity => ({
						value: entity._id,
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
			<div className="entity-search-form">
				<Form
					onSubmit={handleSubmit}
					autoComplete="off"
					role="presentation"
					className=""
				>
					<Field
						name="displayName"
						type="text"
						component={InputFilter}
						loadOptions={(input, callback) => this.getOptions(input, callback)}
						label="Display Name:"
						placeholder="Type value display name..."
						key={this.props.selectedEntityTypeId}
					/>

					<div className="form-footer">
						<Button text="Clear Values" onClick={this.props.reset} />

						<Button
							intent={Intent.SUCCESS}
							disabled={this.props.pristine}
							type="submit"
							text="Search"
						/>
					</div>
				</Form>
			</div>
		);
	}
}

const validate = values => {
	const errors = {};

	if (!values.displayName) {
		errors.displayName = "Display name is required";
	}

	return errors;
};

EntitySearchForm = reduxForm({
	form: "entitySearchForm",
	validate
})(EntitySearchForm);

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default connect(mapStateToProps, {
	searchEntities
})(EntitySearchForm);
