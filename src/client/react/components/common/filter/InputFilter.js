import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import Select from "react-select";

class InputFilter extends React.Component {
	render() {
		const {
			input,
			label,
			placeholder,
			large,
			type,
			minDate,
			loadOptions,
			meta: { touched, error }
		} = this.props;

		let containerClassName = classnames({
			"input-group": true,
			"input-valid": touched && !error,
			"input-invalid": touched && error
		});

		return (
			<div className={containerClassName}>
				{label ? (
					<div className="input-group-left">
						<div className="input-label">{label}</div>
					</div>
				) : (
					""
				)}

				<div className="input-group-right">
					<Select.Async
						{...input}
						onChange={value => input.onChange(value)}
						onBlur={() => input.onBlur(input.value)}
						loadOptions={loadOptions}
						autoload={true}
						clearable
						searchable
						multi
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
	}
}

function mapStateToProps(state) {
	return {};
}

export default connect(mapStateToProps, {})(InputFilter);
