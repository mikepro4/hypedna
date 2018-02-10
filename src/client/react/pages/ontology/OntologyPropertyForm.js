import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";

import Input from "../../components/common/form/Input";
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

		return (
			<Form
				onSubmit={handleSubmit}
				autoComplete="off"
				role="presentation"
				className=""
			>
				<Field
					name="displayName"
					component={Input}
					label="Display Name:"
					placeholder="Enter display name..."
					ref="displayName"
				/>

				<Field
					name="propertyName"
					component={Input}
					label="Property Name:"
					placeholder="Enter property name..."
					ref="propertyName"
				/>

				<Field
					name="description"
					component={Textarea}
					label="Property Description:"
					placeholder="Enter description..."
					ref="textarea"
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
						ref="defaultValue"
						type="checkbox"
						component={Checkbox}
						label="Default Value:"
					/>
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
				<div className="form-footer">
					<Button text="Clear Values" onClick={this.props.reset} />
					<Button
						intent={Intent.SUCCESS}
						disabled={this.props.pristine}
						type="submit"
						text="Create Property"
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
		propertyTypeValue
	};
})(PropertyEditorForm);

export default PropertyEditorForm;
