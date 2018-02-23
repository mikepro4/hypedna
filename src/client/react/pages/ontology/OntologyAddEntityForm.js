import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";

import { Button, Intent } from "@blueprintjs/core";

import { DropTarget, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {
	removeCustomProperty,
	showPropertyCreator,
	updateAllCustomProperties,
	searchEntities,
	validateUrlName
} from "../../../redux/actions/pageOntologyActions";

import ReactSelectAsync from "../../components/common/form/ReactSelectAsync";
import Input from "../../components/common/form/Input";
import DateInput from "../../components/common/form/DateInput";
import Textarea from "../../components/common/form/Textarea";
import Checkbox from "../../components/common/form/Checkbox";
import Select from "../../components/common/form/Select";
import update from "immutability-helper";

import DraggableField from "./DraggableField";

@DragDropContext(HTML5Backend)
class OntologyAddEntityForm extends React.Component {
	state = {
		dragging: false
	};

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

	renderProperty = property => {
		if (property) {
			return (
				<div key={property._id} className="single-form-row">
					{this.renderField(property)}
					<a
						className="anchor-button"
						onClick={() => this.props.showPropertyCreator(property)}
					>
						<span className="pt-icon-standard pt-icon-edit" />
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

	moveField = (dragIndex, hoverIndex) => {
		const { fields } = this.state;
		const dragField = fields[dragIndex];

		this.setState(
			update(this.state, {
				fields: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragField]]
				}
			})
		);
	};

	dragStart = () => {
		this.setState({
			dragging: true,
			fields: this.props.customProperties
		});
	};

	dragEnd = () => {
		this.props.updateAllCustomProperties(
			this.props.selectedEntityTypeId,
			this.state.fields,
			() => {
				this.setState({
					dragging: false,
					fields: []
				});
			}
		);
	};

	render() {
		const { handleSubmit } = this.props;

		let fields;

		if (this.state.dragging) {
			fields = this.state.fields;
		} else {
			fields = this.props.customProperties;
		}

		return (
			<div>
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
							name="entityUrlName"
							component={Input}
							label="Entity Url Name:"
							placeholder="Enter entity url name (no spaces)..."
							ref="entityUrlName"
						/>

						<Field
							name="description"
							component={Input}
							label="Description:"
							placeholder="Description here"
							ref="description"
						/>
					</div>

					<div className="custom-properties">
						<h1 className="form-headline">Custom Properties</h1>

						{fields.map((property, i) => {
							return (
								<DraggableField
									key={property._id}
									id={property._id}
									moveField={this.moveField}
									index={i}
									dragStart={this.dragStart}
									dragEnd={this.dragEnd}
								>
									{this.renderProperty(property)}
								</DraggableField>
							);
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
			</div>
		);
	}
}

function hasWhiteSpace(s) {
	return s;
}

const validate = values => {
	const errors = {};

	if (!values.displayName) {
		errors.displayName = "Display name is required";
	}

	if (!values.entityUrlName) {
		errors.entityUrlName = "Entity URL name is required";
	}

	if (values.entityUrlName) {
		let containsSpaces = values.entityUrlName.indexOf(" ") >= 0;
		if (containsSpaces) {
			errors.entityUrlName = "Can't contain spaces";
		}
	}

	return errors;
};

OntologyAddEntityForm = reduxForm({
	form: "addEntityForm",
	validate,
	asyncValidate: validateUrlName,
	asyncBlurFields: ["entityUrlName"]
})(OntologyAddEntityForm);

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	selectedProperty: state.pageOntology.selectedProperty
});

export default connect(mapStateToProps, {
	removeCustomProperty,
	showPropertyCreator,
	updateAllCustomProperties,
	searchEntities
})(OntologyAddEntityForm);
