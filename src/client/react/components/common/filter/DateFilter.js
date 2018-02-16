import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import Select from "react-select";
import { Field } from "redux-form";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

import DateInput from "../form/DateInput";

class DateFilter extends React.Component {
	render() {
		let containerClassName = classnames({
			"filter-input-group": true
		});

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div>
						<h1>{this.props.property.displayName}</h1>
						<Field
							name={`${this.props.property.propertyName}.from`}
							type="text"
							component={DateInput}
							key={
								this.props.selectedEntityTypeId +
								this.props.property._id +
								"from"
							}
						/>

						<Field
							name={`${this.props.property.propertyName}.to`}
							type="text"
							component={DateInput}
							key={
								this.props.selectedEntityTypeId + this.props.property._id + "to"
							}
						/>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { selectedEntityTypeId: state.pageOntology.selectedEntityTypeId };
}

export default connect(mapStateToProps, { searchEntities })(DateFilter);
