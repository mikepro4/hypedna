import React, { PropTypes } from "react";
import { Field, reduxForm } from "redux-form";
import classnames from "classnames";
import TextField from "material-ui/TextField";

class EntityTypeEditorForm extends React.Component {
	render() {
		const { handleSubmit } = this.props;

		return (
			<form
				onSubmit={handleSubmit}
				autoComplete="off"
				role="presentation"
				className="pt-dark pt-large pt-vertical"
			>
				<Field
					name="displayName"
					component={renderTextField}
					placeholder="Display name..."
					label="Display Name"
					ref="displayName"
				/>
				<button
					action="submit"
					className="pt-button pt-intent-primary button_submit"
				>
					Add
				</button>
			</form>
		);
	}
}

const renderTextField = ({
	input,
	label,
	placeholder,
	meta: { touched, error },
	...custom
}) => (
	<TextField
		placeholder={placeholder}
		style={{
			width: "100%"
		}}
		label={label}
		error={touched && error && error.length > 0}
		helperText={touched && error}
		{...input}
		{...custom}
	/>
);

const validate = values => {
	const errors = {};
	return errors;
};

export default reduxForm({
	form: "entity_type_editor",
	validate
})(EntityTypeEditorForm);
