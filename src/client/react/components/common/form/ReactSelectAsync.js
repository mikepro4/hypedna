import React, { PropTypes } from "react";
import classnames from "classnames";
import Select from "react-select";
import * as _ from 'lodash'

const ReactSelect = ({
	input,
	label,
	placeholder,
	large,
	type,
	minDate,
	loadOptions,
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
				<Select.Async
					{...input}
					onChange={value => input.onChange(value)}
					onBlur={() => input.onBlur(input.value)}
					loadOptions={_.throttle(loadOptions, 500)}
					autoload={true}
					placeholder={placeholder}
					simpleValue
					clearable
					searchable
				/>

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

export default ReactSelect;
