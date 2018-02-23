import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import * as _ from "lodash";
import { connect } from "react-redux";
import Select from "react-select";
import { Field } from "redux-form";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

import Checkbox from "../form/Checkbox";
import FilterHistogram from "./FilterHistogram";

class DropdownFilter extends React.Component {
	componentDidUpdate = prevprops => {
		if (!_.isEqual(prevprops.form.values, this.props.form.values)) {
			this.props.updateStats(this.props.property.propertyName);
		}

		if (
			prevprops.entitySearchResults.count !==
			this.props.entitySearchResults.count
		) {
			this.props.updateStats(this.props.property.propertyName);
		}
	};

	componentDidMount = () => {
		this.props.updateStats(this.props.property.propertyName);
	};

	shouldComponentUpdate = () => {
		return true;
	};

	render() {
		let containerClassName = classnames({
			"filter-container": true
		});

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div className="filter-dropdown-container">
						<h1 className="filter-title">{this.props.property.displayName}</h1>
						<div className="filter-options-container">
							{this.props.property.dropdownValues.map(dropdownValue => {
								let propertyStats = _.filter(
									this.props.searchResultsStats[
										this.props.property.propertyName
									],
									result => {
										return result._id == dropdownValue.valuePropertyName;
									}
								);
								return (
									<div
										key={
											this.props.selectedEntityTypeId +
											dropdownValue._id +
											"true"
										}
										className="property-container"
									>
										<Field
											name={`${this.props.property.propertyName}.${
												dropdownValue.valuePropertyName
											}`}
											type="checkbox"
											component={Checkbox}
											inline={true}
											label={dropdownValue.valuePropertyName}
										/>
										<div className="property-stats">
											<div className="property-count">
												{propertyStats[0] ? propertyStats[0].count : 0} /{" "}
												{this.props.entitySearchResults.count}
											</div>
											{propertyStats[0] ? (
												<FilterHistogram
													current={propertyStats[0].count}
													total={this.props.entitySearchResults.count}
												/>
											) : (
												<FilterHistogram
													current={0}
													total={this.props.entitySearchResults.count}
												/>
											)}
										</div>
									</div>
								);
							})}
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
	return {
		selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
		form: state.form.entitySearchForm,
		entitySearchResults: state.pageOntology.entitySearchResults
	};
}

export default connect(mapStateToProps, { searchEntities })(DropdownFilter);
