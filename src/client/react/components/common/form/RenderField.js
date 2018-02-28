import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as _ from "lodash";
import { Field, FieldArray } from "redux-form";

import ReactSelectAsync from "./ReactSelectAsync";
import Input from "./Input";
import DateInput from "./DateInput";
import Textarea from "./Textarea";
import Checkbox from "./Checkbox";
import Select from "./Select";

import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

class RenderField extends Component {
	renderInput = property => {
		switch (property.propertyType) {
			case "string":
				return (
					<Field
						name={property.propertyName}
						component={Input}
						label={property.displayName + ":"}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);
			case "number":
				return (
					<Field
						name={property.propertyName}
						component={Input}
						type="number"
						label={property.displayName + ":"}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);

			case "date":
				return (
					<Field
						name={property.propertyName}
						component={DateInput}
						minDate={new Date("01/01/1100")}
						label={property.displayName + ":"}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);
			default:
				return;
		}
	};

	renderField = property => {
		switch (property.fieldType) {
			case "input":
				return this.renderInput(property);
			case "dropdown":
				return (
					<Field
						name={property.propertyName}
						component={Select}
						label={property.displayName + ":"}
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
						label={property.displayName + ":"}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);

			case "entitySelector":
				return (
					<Field
						name={property.propertyName}
						component={ReactSelectAsync}
						loadOptions={(input, callback) =>
							this.getOptions(input, callback, property.entityType)
						}
						label={property.displayName + ":"}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);
			default:
				return;
		}
	};

	getOptions = (input, callback, entityType) => {
		this.props.searchEntities(
			{ displayName: input, entityType: entityType },
			"displayName",
			0,
			20,
			data => {
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
		return this.renderField(this.props.property);
	}
}

const mapStateToProps = state => ({});

export default withRouter(
	connect(mapStateToProps, { searchEntities })(RenderField)
);
