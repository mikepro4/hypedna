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
	updateAllCustomProperties
} from "../../../redux/actions/pageOntologyActions";

import Input from "../../components/common/form/Input";
import DateInput from "../../components/common/form/DateInput";
import Textarea from "../../components/common/form/Textarea";
import Checkbox from "../../components/common/form/Checkbox";
import Select from "../../components/common/form/Select";
import update from "immutability-helper";

import DraggableField from "./DraggableField";

const fieldTarget = {
	drop() {}
};

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
						label={property.displayName}
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
						label={property.displayName}
						placeholder={property.description}
						ref={property.propertyName}
					/>
				);

			case "date":
				return (
					<Field
						name={property.propertyName}
						component={DateInput}
						label={property.displayName}
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
						onClick={() => this.props.showPropertyCreator(property)}
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

	findField = id => {
		const fields = this.props.customProperties;
		const field = fields.filter(field => field._id === id)[0];

		return {
			field,
			index: fields.indexOf(field)
		};
	};

	dragStart = () => {
		console.log("drag start");
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

						{fields.map((property, i) => {
							return (
								<DraggableField
									key={property._id}
									id={property._id}
									moveField={this.moveField}
									findField={this.findField}
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
							text="create New Entity"
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

OntologyAddEntityForm = reduxForm({
	form: "addEntityForm",
	validate
})(OntologyAddEntityForm);

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	selectedProperty: state.pageOntology.selectedProperty
});

export default connect(mapStateToProps, {
	removeCustomProperty,
	showPropertyCreator,
	updateAllCustomProperties
})(OntologyAddEntityForm);
