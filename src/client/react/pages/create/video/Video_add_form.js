import React, { PropTypes } from "react";
import { Field, reduxForm } from "redux-form";
import classnames from "classnames";
import TextField from "material-ui/TextField";
import { youtubeUrlParser } from "../../../../utils/youtube";

class VideoAddFormComponent extends React.Component {
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
					name="url"
					component={renderTextField}
					placeholder="For example https://www.youtube.com/watch?v=SSjmM9WF720"
					label="Paste Youtube video URL here…"
					ref="url"
				/>
				<button
					action="submit"
					className="pt-button pt-intent-primary button_submit"
					style={{
						display: "none"
					}}
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

	if (!values.url) {
		errors.url = "Enter url ";
	}

	if (!youtubeUrlParser(values.url)) {
		errors.url = "Wrong youtube url";
	}

	return errors;
};

export default reduxForm({
	form: "addvideo",
	validate
})(VideoAddFormComponent);
