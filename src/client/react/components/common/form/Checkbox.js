import React, { PropTypes } from "react";
import classnames from "classnames";

const Checkbox = ({ input, label, large, meta: { touched, error } }) => {
	let containerClassName = classnames({
		"input-group": true,
		"pt-large": large,
		"input-valid": touched && !error,
		"input-invalid": touched && error
	});

	return (
		<div className={containerClassName}>
			<div className="input-group-left">
				{label ? <div className="input-label">{label}</div> : ""}
			</div>

			<div className="input-group-right">
				<label className="pt-checkbox pt-control">
					<input {...input} type="checkbox" />
					<span className="pt-control-indicator" />
				</label>

				{touched && error ? (
					<div className="input-error">
						{touched && error && <span>{error}</span>}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default Checkbox;
