import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";
import update from "immutability-helper";

import InputFilter from "../../components/common/filter/InputFilter";
import StringFilter from "../../components/common/filter/StringFilter";
import DateFilter from "../../components/common/filter/DateFilter";
import NumberFilter from "../../components/common/filter/NumberFilter";
import DropdownFilter from "../../components/common/filter/DropdownFilter";
import CheckboxFilter from "../../components/common/filter/CheckboxFilter";
import Input from "../../components/common/form/Input";
import Checkbox from "../../components/common/form/Checkbox";

import {
	searchEntities,
	getEntityType,
	getPropertyStats
} from "../../../redux/actions/pageOntologyActions";

import ReactSelectAsync from "../../components/common/form/ReactSelectAsync";

class EntitySearchForm extends React.Component {
	state = {};

	renderInputFilter = property => {
		switch (property.propertyType) {
			case "string":
				return this.renderStringFilter(property);
			case "number":
				return this.renderNumberFilter(property);
			case "date":
				return this.renderDateFilter(property);
			default:
				return;
		}
	};

	renderStringFilter = property => {
		return <StringFilter property={property} key={property.propertyName} />;
	};

	renderNumberFilter = property => {
		return <NumberFilter property={property} key={property.propertyName} />;
	};

	renderDateFilter = property => {
		return <DateFilter property={property} key={property.propertyName} />;
	};

	renderDropdownFilter = property => {
		return (
			<DropdownFilter
				property={property}
				key={property.propertyName}
				updateStats={this.updateStats}
				searchResultsStats={this.props.searchResultsStats}
			/>
		);
	};

	renderCheckboxFilter = property => {
		return (
			<CheckboxFilter
				property={property}
				key={property.propertyName}
				updateStats={this.updateStats}
				searchResultsStats={this.props.searchResultsStats}
			/>
		);
	};

	renderEntitySelectorFilter = property => {
		return (
			<StringFilter
				property={property}
				key={property.propertyName}
				searchDisplayName="true"
				entityTypeToSearch={property.entityType}
			/>
		);
	};

	renderPropertyFilter = property => {
		switch (property.fieldType) {
			case "input":
				return this.renderInputFilter(property);
			case "dropdown":
				return this.renderDropdownFilter(property);
			case "checkbox":
				return this.renderCheckboxFilter(property);
			case "entitySelector":
				return this.renderEntitySelectorFilter(property);
			default:
				return;
		}
	};

	updateStats = property => {
		const customProperties = this.props.getEntityType(
			this.props.selectedEntityTypeId
		).customProperties;

		let values = { entityType: this.props.selectedEntityTypeId };

		if (this.props.entitySearchForm && this.props.entitySearchForm.values) {
			values = this.props.entitySearchForm.values;
		}
		this.props.getPropertyStats(values, property, customProperties, () => {
			this.props.blur();
		});
	};

	render() {
		const { handleSubmit } = this.props;

		const customProperties = this.props.getEntityType(
			this.props.selectedEntityTypeId
		).customProperties;

		return (
			<div className="entity-search-form">
				<Form
					onSubmit={handleSubmit}
					autoComplete="off"
					role="presentation"
					className=""
				>
					{this.renderPropertyFilter({
						displayName: "Display Name ",
						fieldType: "input",
						propertyName: "displayName",
						propertyType: "string"
					})}

					{this.renderPropertyFilter({
						displayName: "Entity URL Name:",
						fieldType: "input",
						propertyName: "entityUrlName",
						propertyType: "string"
					})}

					{customProperties.map((property, i) => {
						return this.renderPropertyFilter(property);
					})}

					<div className="form-footer" style={{ display: "none" }}>
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
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	entitySearchForm: state.form.entitySearchForm,
	searchResultsStats: state.pageOntology.searchResultsStats
});

export default connect(mapStateToProps, {
	searchEntities,
	getEntityType,
	getPropertyStats
})(EntitySearchForm);
