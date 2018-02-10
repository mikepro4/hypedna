import React, { PropTypes } from "react";
import classnames from "classnames";
import { DateInput } from "@blueprintjs/datetime";

const Date = ({
	input,
	label,
	placeholder,
	icon,
	large,
	type,
	meta: { touched, error }
}) => {
	let containerClassName = classnames({
		"input-group": true,
		"pt-large": large,
		"input-valid": touched && !error,
		"input-invalid": touched && error
	});

	let inputClassName = classnames({
		"pt-input": true,
		"pt-intent-success": touched && !error,
		"pt-intent-danger": touched && error
	});

	return (
		<div className={containerClassName}>
			<div className="input-group-left">
				{label ? <div className="input-label">{label}</div> : ""}
			</div>

			<div className="input-group-right">
				<DateInput {...input} className={inputClassName} type={type} />

				{touched && error ? (
					<div className="input-error">
						{touched && error && <span>{error}</span>}
					</div>
				) : (
					""
				)}

				{touched && !error ? (
					<div className="input-valid">
						<span className="pt-icon pt-icon-small-tick" />
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default Date;
