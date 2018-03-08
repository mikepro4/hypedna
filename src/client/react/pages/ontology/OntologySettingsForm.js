import React, { PropTypes } from "react";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import classnames from "classnames";
import { Form } from "redux-form";
import { connect } from "react-redux";
import update from "immutability-helper";
import { Button, Intent } from "@blueprintjs/core";

import { getEntityType } from "../../../redux/actions/pageOntologyActions";

import RenderField from "../../components/common/form/RenderField";

class OntologySettingsForm extends React.Component {
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
		if (!this.props.getEntityType(this.props.selectedEntityTypeId)) {
			return "";
		}

		const { handleSubmit } = this.props;

		let fields = this.props.getEntityType(this.props.selectedEntityTypeId)
			.genericProperties;

		return (
			<div>
				<Form
					onSubmit={handleSubmit}
					autoComplete="off"
					role="presentation"
					className=""
				>
					<div className="generic-properties">
						<h1 className="form-headline">Entity Type Settings:</h1>
						<RenderField
							key="canContainEntities"
							property={{
								displayName: "Can Contain Entities",
								propertyName: "canContainEntities",
								fieldType: "checkbox"
							}}
						/>
						<RenderField
							key="isHidden"
							property={{
								displayName: "Is Hidden?",
								propertyName: "isHidden",
								fieldType: "checkbox"
							}}
						/>
						<RenderField
							key="root"
							property={{
								displayName: "Root",
								propertyName: "root",
								fieldType: "checkbox"
							}}
						/>

						<RenderField
							key="hasByRefs"
							property={{
								displayName: "Has By references",
								propertyName: "hasByRefs",
								fieldType: "checkbox"
							}}
						/>

						<RenderField
							key="hasOfRefs"
							property={{
								displayName: "Has Of references",
								propertyName: "hasOfRefs",
								fieldType: "checkbox"
							}}
						/>

						<RenderField
							key="isRef"
							property={{
								displayName: "Is Reference",
								propertyName: "isRef",
								fieldType: "checkbox"
							}}
						/>

						<RenderField
							key="isByRef"
							property={{
								displayName: "Is BY reference",
								propertyName: "isByRef",
								fieldType: "checkbox"
							}}
						/>

						<RenderField
							key="isOfRef"
							property={{
								displayName: "Is OF reference",
								propertyName: "isOfRef",
								fieldType: "checkbox"
							}}
						/>
					</div>

					<div className="form-footer">
						<Button
							intent={Intent.SUCCESS}
							disabled={this.props.pristine}
							type="submit"
							text="Update Entity Type"
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

OntologySettingsForm = reduxForm({
	form: "OntologySettingsForm",
	validate
})(OntologySettingsForm);

const mapStateToProps = state => ({
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default connect(mapStateToProps, {
	getEntityType
})(OntologySettingsForm);
