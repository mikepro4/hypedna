import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import Select from "react-select";
import { Field } from "redux-form";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

import Checkbox from "../form/Checkbox";

class DropdownFilter extends React.Component {
	render() {
		let containerClassName = classnames({
			"filter-input-group": true
		});

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div>
						<h1>{this.props.property.displayName}</h1>
						{this.props.property.dropdownValues.map(dropdownValue => {
							return (
								<Field
									name={`${this.props.property.propertyName}.${
										dropdownValue.valuePropertyName
									}`}
									type="checkbox"
									component={Checkbox}
									inline={true}
									label={dropdownValue.valuePropertyName}
									key={
										this.props.selectedEntityTypeId + dropdownValue._id + "true"
									}
								/>
							);
						})}
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

export default connect(mapStateToProps, { searchEntities })(DropdownFilter);
