import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import Select from "react-select";
import { Field } from "redux-form";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

import Checkbox from "../form/Checkbox";
import FilterHistogram from "./FilterHistogram";

class CheckboxFilter extends React.Component {
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

	render() {
		let containerClassName = classnames({
			"filter-container": true
		});

		let truePropertyStats = _.filter(
			this.props.searchResultsStats[this.props.property.propertyName],
			result => {
				return result._id == true;
			}
		);

		let falsePropertyStats = _.filter(
			this.props.searchResultsStats[this.props.property.propertyName],
			result => {
				return result._id == false;
			}
		);

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div className="filter-checkbox-container">
						<h1 className="filter-title">{this.props.property.displayName}</h1>

						<div className="filter-options-container">
							<div className="property-container">
								<Field
									name={`${this.props.property.propertyName}.true`}
									type="checkbox"
									component={Checkbox}
									label="true"
									inline={true}
									key={
										this.props.selectedEntityTypeId +
										this.props.property._id +
										"true"
									}
								/>
								<div className="property-stats">
									<div className="property-count">
										{truePropertyStats[0] ? truePropertyStats[0].count : 0} /{" "}
										{this.props.entitySearchResults.count}
									</div>
									{truePropertyStats[0] ? (
										<FilterHistogram
											current={truePropertyStats[0].count}
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
							<div className="property-container">
								<Field
									name={`${this.props.property.propertyName}.false`}
									type="checkbox"
									component={Checkbox}
									inline={true}
									label="false"
									key={
										this.props.selectedEntityTypeId +
										this.props.property._id +
										"false"
									}
								/>
								<div className="property-stats">
									<div className="property-count">
										{falsePropertyStats[0] ? falsePropertyStats[0].count : 0} /{" "}
										{this.props.entitySearchResults.count}
									</div>
									{falsePropertyStats[0] ? (
										<FilterHistogram
											current={falsePropertyStats[0].count}
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

export default connect(mapStateToProps, { searchEntities })(CheckboxFilter);
