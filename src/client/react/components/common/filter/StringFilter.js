import React, { PropTypes } from "react";
import YouTube from "react-youtube";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import Select from "react-select";
import { Field } from "redux-form";
import * as _ from "lodash";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

import InputFilter from "./InputFilter";

class StringFilter extends React.Component {
	getOptions = (input, callback, propertyName, entityType) => {
		let propertyToSearch = propertyName;

		if (this.props.searchDisplayName) {
			propertyToSearch = "displayName";
		}
		this.props.searchEntities(
			{ [propertyToSearch]: input, entityType: entityType },
			propertyName,
			0,
			20,
			data => {
				let options = data.all.map(entity => ({
					value: entity._id,
					label: entity.properties[propertyToSearch]
				}));

				let filteredOptions = _.filter(options, option => {
					return !_.isEmpty(option.label);
				});

				callback(null, {
					options: _.uniqBy(filteredOptions, "label"),
					complete: true
				});
			}
		);
	};
	render() {
		let containerClassName = classnames({
			"filter-container": true
		});

		let entityTypeToSearch;

		if (this.props.entityTypeToSearch) {
			entityTypeToSearch = this.props.entityTypeToSearch;
		} else {
			entityTypeToSearch = this.props.selectedEntityTypeId;
		}

		return (
			<div className={containerClassName}>
				{this.props.property ? (
					<div className="filter-string-container">
						<h1 className="filter-title">{this.props.property.displayName}</h1>
						<Field
							name={this.props.property.propertyName}
							type="text"
							component={InputFilter}
							loadOptions={(input, callback) =>
								this.getOptions(
									input,
									callback,
									this.props.property.propertyName,
									entityTypeToSearch
								)
							}
							placeholder={this.props.property.description}
							key={this.props.selectedEntityTypeId + this.props.property._id}
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

export default connect(mapStateToProps, { searchEntities })(StringFilter);
