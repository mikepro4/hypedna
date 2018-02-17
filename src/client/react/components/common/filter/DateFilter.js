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
			"filter-container": true
		});

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div className="filter-date-container">
						<h1 className="filter-title">{this.props.property.displayName}</h1>

						<div className="filter-options-container">
							<Field
								name={`${this.props.property.propertyName}.from`}
								type="date"
								component={DateInput}
								key={
									this.props.selectedEntityTypeId +
									this.props.property._id +
									"from"
								}
							/>

							<span className="range-divider">TO</span>

							<Field
								name={`${this.props.property.propertyName}.to`}
								type="date"
								component={DateInput}
								key={
									this.props.selectedEntityTypeId +
									this.props.property._id +
									"to"
								}
							/>
						</div>
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
