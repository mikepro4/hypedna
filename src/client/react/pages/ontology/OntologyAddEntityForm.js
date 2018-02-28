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

import update from "immutability-helper";

import Input from "../../components/common/form/Input";
import RenderField from "../../components/common/form/RenderField";

import DraggableField from "./DraggableField";

@DragDropContext(HTML5Backend)
class OntologyAddEntityForm extends React.Component {
	state = {
		dragging: false
	};

	renderProperty = property => {
		if (property) {
			return (
				<div key={property._id} className="single-form-row">
					{<RenderField property={property} />}
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
						<RenderField
							key="1"
							property={{
								description: "Enter Display Name...",
								defaultValue: "",
								displayName: "Display Name",
								propertyName: "displayName",
								fieldType: "input",
								propertyType: "string"
							}}
						/>

						<RenderField
							key="2"
							property={{
								description: "Enter Entity URL Name...",
								defaultValue: "",
								displayName: "Entity URL Name",
								propertyName: "entityUrlName",
								fieldType: "input",
								propertyType: "string"
							}}
						/>

						<RenderField
							key="3"
							property={{
								description: "description",
								defaultValue: "",
								displayName: "Description",
								propertyName: "description",
								fieldType: "input",
								propertyType: "string"
							}}
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
