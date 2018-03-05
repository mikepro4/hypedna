import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";

import Input from "../../components/common/form/Input";
import ReactSelect from "../../components/common/form/ReactSelect";
import Textarea from "../../components/common/form/Textarea";
import Checkbox from "../../components/common/form/Checkbox";
import Select from "../../components/common/form/Select";

class PropertyEditorForm extends React.Component {
	renderDropdownValues = ({ fields }) => {
		if (fields.length == 0) {
			fields.push({});
		}
		return (
			<div className="dropdow-values-container">
				{fields.map((value, index) => (
					<div key={index} className="single-dropdown-value-container">
						<div className="single-dropdown-value-header">
							<h1>Value {index + 1}</h1>

							{index > 0 ? (
								<a
									className="anchor-button"
									onClick={() => fields.remove(index)}
								>
									<span className="pt-icon-standard pt-icon-trash" /> Remove
									Value
								</a>
							) : (
								""
							)}
						</div>

						<Field
							name={`${value}.valueDisplayName`}
							type="text"
							component={Input}
							label="Value Display Name:"
							placeholder="Type value display name..."
						/>
						<Field
							name={`${value}.valuePropertyName`}
							type="text"
							component={Input}
							label="Value Property Name:"
							placeholder="Type value property name..."
						/>
					</div>
				))}

				<a className="anchor-button" onClick={() => fields.push({})}>
					<span className="pt-icon-standard pt-icon-add" /> Add Value
				</a>
			</div>
		);
	};

	render() {
		const { handleSubmit } = this.props;

		let sortedEntities = _.orderBy(
			this.props.allEntityTypes,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);
		let entityTypes = _.map(sortedEntities, entityType => {
			return {
				value: entityType._id,
				label: entityType.genericProperties.displayName
			};
		});

		return (
			<Form onSubmit={handleSubmit} autoComplete="off">
				<Field
					name="displayName"
					component={Input}
					label="Display Name:"
					placeholder="Enter display name..."
					ref="displayName"
				/>

				{this.props.fieldTypeValue != "entitySelector" ? (
					<Field
						name="propertyName"
						component={Input}
						label="Property Name:"
						placeholder="Enter property name..."
						ref="propertyName"
					/>
				) : (
					""
				)}

				<Field
					name="description"
					component={Input}
					label="Property Placeholder:"
					placeholder="Enter placeholder text..."
					ref="description"
				/>

				<Field
					name="fieldType"
					component={Select}
					label="Field Type:"
					ref="fieldType"
				>
					<option />
					<option value="input">Input</option>
					<option value="dropdown">Dropdown</option>
					<option value="checkbox">Checkbox</option>
					<option value="entitySelector">Entity Selector</option>
				</Field>

				{this.props.fieldTypeValue == "input" ? (
					<Field
						name="propertyType"
						component={Select}
						label="Property Type:"
						ref="propertyType"
					>
						<option />
						<option value="string">String</option>
						<option value="number">Number</option>
						<option value="date">Date</option>
					</Field>
				) : (
					""
				)}

				{this.props.propertyTypeValue == "string" ? (
					<Field
						name="defaultValue"
						component={Input}
						label="Default Value:"
						placeholder="Enter default value..."
						ref="defaultValue"
					/>
				) : (
					""
				)}

				{this.props.propertyTypeValue == "number" ? (
					<Field
						name="defaultValue"
						component={Input}
						type="number"
						label="Default Value:"
						placeholder="Enter default value (only numbers)..."
						ref="defaultValue"
					/>
				) : (
					""
				)}

				{this.props.fieldTypeValue == "checkbox" ? (
					<Field
						name="defaultValue"
						component={Select}
						label="Defaul Type:"
						ref="defaultValue"
					>
						<option />
						<option value="false">false</option>
						<option value="true">true</option>
					</Field>
				) : (
					""
				)}

				{this.props.fieldTypeValue == "dropdown" ? (
					<FieldArray
						name="dropdownValues"
						component={this.renderDropdownValues}
					/>
				) : (
					""
				)}

				{this.props.fieldTypeValue == "entitySelector" ? (
					<Field
						name="entityType"
						options={entityTypes}
						component={ReactSelect}
						label="Slect Entities of Type:"
					/>
				) : (
					""
				)}

				<div className="form-footer">
					<Button text="Clear Values" onClick={this.props.reset} />
					<Button
						intent={Intent.SUCCESS}
						disabled={this.props.pristine}
						type="submit"
						text={
							this.props.selectedProperty && this.props.selectedProperty._id
								? "Update Entity Type"
								: "Create New Entity Type"
						}
					/>
				</div>
			</Form>
		);
	}
}

const validate = values => {
	const errors = {};

	if (!values.displayName) {
		errors.displayName = "Display name is required";
	}

	if (!values.propertyName) {
		errors.propertyName = "Property name is required";
	}

	if (!values.fieldType || _.isEmpty(values.fieldType)) {
		errors.fieldType = "Select Field Type";
	}

	if (
		(values.fieldType == "input" && !values.propertyType) ||
		_.isEmpty(values.propertyType)
	) {
		errors.propertyType = "Select Property Type";
	}

	if (
		values.fieldType == "dropdown" &&
		values.dropdownValues &&
		values.dropdownValues.length
	) {
		const dropdownArrayErrors = [];

		values.dropdownValues.forEach((value, valueIndex) => {
			const valueErrors = {};
			if (!value || !value.valueDisplayName) {
				valueErrors.valueDisplayName = "Required";
				dropdownArrayErrors[valueIndex] = valueErrors;
			}

			if (!value || !value.valuePropertyName) {
				valueErrors.valuePropertyName = "Required";
				dropdownArrayErrors[valueIndex] = valueErrors;
			}
		});

		if (dropdownArrayErrors.length) {
			errors.dropdownValues = dropdownArrayErrors;
		}
	}

	if (values.propertyName) {
		let containsSpaces = values.propertyName.indexOf(" ") >= 0;
		if (containsSpaces) {
			errors.propertyName = "Can't contain spaces";
		}
	}

	if (values.fieldType == "checkbox") {
		if (_.isEmpty(values.defaultValue)) {
			errors.defaultValue = "Please select default value";
		}
	}

	return errors;
};
//
// export default reduxForm({
// 	form: "property_editor",
// 	validate
// })(PropertyEditorForm);

PropertyEditorForm = reduxForm({
	form: "property_editor",
	validate
})(PropertyEditorForm);

const selector = formValueSelector("property_editor"); // <-- same as form name

PropertyEditorForm = connect(state => {
	const fieldTypeValue = selector(state, "fieldType");
	const propertyTypeValue = selector(state, "propertyType");
	return {
		fieldTypeValue,
		propertyTypeValue,
		allEntityTypes: state.pageOntology.allEntityTypes,
		selectedProperty: state.pageOntology.selectedProperty
	};
})(PropertyEditorForm);

export default PropertyEditorForm;
