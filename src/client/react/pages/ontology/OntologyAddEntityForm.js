import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";

import { removeCustomProperty } from "../../../redux/actions/pageOntologyActions";

import Input from "../../components/common/form/Input";
import Textarea from "../../components/common/form/Textarea";
import Checkbox from "../../components/common/form/Checkbox";
import Select from "../../components/common/form/Select";

class OntologyAddEntityForm extends React.Component {
	renderField = property => {
		switch (property.fieldType) {
			case "input":
				return (
					<Field
						name={property.propertyName}
						component={Input}
						label={property.displayName}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);
			case "dropdown":
				return (
					<Field
						name={property.propertyName}
						component={Select}
						label={property.displayName}
						placeholder={property.description}
						ref={property.propertyName}
					>
						<option />
						{property.dropdownValues.map(value => {
							return (
								<option key={value._id} value={value.valuePropertyName}>
									{value.valueDisplayName}
								</option>
							);
						})}
					</Field>
				);
			case "checkbox":
				return (
					<Field
						name={property.propertyName}
						component={Checkbox}
						type="checkbox"
						label={property.displayName}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);
			default:
				return;
		}
	};
	renderProperty = property => {
		if (property) {
			return (
				<div key={property._id} className="single-form-row">
					{this.renderField(property)}
					<a
						className="anchor-button"
						onClick={() => this.removeCustomProperty(property._id)}
					>
						<span className="pt-icon-standard pt-icon-cog" />
					</a>
					<a
						className="anchor-button"
						onClick={() => this.removeCustomProperty(property._id)}
					>
						<span className="pt-icon-standard pt-icon-trash" />
					</a>
				</div>
			);
		} else return {};
	};

	removeCustomProperty = propertyId => {
		this.props.removeCustomProperty(
			this.props.selectedEntityTypeId,
			propertyId
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
				<h1 className="form-headline">Generic Properties</h1>
				<div className="generic-properties">
					<Field
						name="displayName"
						component={Input}
						label="Display Name:"
						placeholder="Enter display name..."
						ref="displayName"
					/>

					<Field
						name="description"
						component={Input}
						label="Description:"
						placeholder="Description here"
						ref="description"
					/>

					<Field
						name="entityUrlName"
						component={Input}
						label="Entity Url Name:"
						placeholder="Enter entity url name (english, no spaces)..."
						ref="entityUrlName"
					/>
				</div>

				<div className="custom-properties">
					<h1 className="form-headline">Custom Properties</h1>

					{this.props.customProperties.map(property => {
						return this.renderProperty(property);
					})}
				</div>

				<div className="form-footer">
					<Button text="Clear Values" onClick={this.props.reset} />
					<Button
						intent={Intent.SUCCESS}
						disabled={this.props.pristine}
						type="submit"
						text="Create New Entity"
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

	return errors;
};

OntologyAddEntityForm = reduxForm({
	form: "addEntityForm",
	validate
})(OntologyAddEntityForm);

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default connect(mapStateToProps, { removeCustomProperty })(
	OntologyAddEntityForm
);
