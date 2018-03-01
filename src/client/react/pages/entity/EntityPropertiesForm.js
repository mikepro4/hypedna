import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";
import update from "immutability-helper";
import { Button, Intent } from "@blueprintjs/core";

import {
	searchEntities,
	getEntityType
} from "../../../redux/actions/pageOntologyActions";

import { validateUrlName } from "../../../redux/actions/pageEntityActions";

import RenderField from "../../components/common/form/RenderField";

class EntityPropertiesEditorForm extends React.Component {
	state = {};

	renderProperty = property => {
		if (property) {
			return (
				<div key={property._id} className="single-form-row">
					{<RenderField property={property} />}
				</div>
			);
		} else return {};
	};

	render() {
		const { handleSubmit } = this.props;

		let fields = this.props.getEntityType(
			this.props.entity.associatedEntityTypes[0].entityTypeId
		).customProperties;

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
							return this.renderProperty(property);
						})}
					</div>

					<div className="form-footer">
						<Button
							intent={Intent.SUCCESS}
							disabled={this.props.pristine}
							type="submit"
							text="Update Entity"
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

EntityPropertiesEditorForm = reduxForm({
	form: "editEntityForm",
	validate,
	asyncValidate: validateUrlName,
	asyncBlurFields: ["entityUrlName"]
})(EntityPropertiesEditorForm);

const mapStateToProps = state => ({
	entity: state.pageEntity.entity,
	allEntityTypes: state.pageOntology.allEntityTypes
});

export default connect(mapStateToProps, {
	searchEntities,
	getEntityType
})(EntityPropertiesEditorForm);
