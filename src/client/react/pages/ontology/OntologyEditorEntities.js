import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";

import { Classes, Spinner } from "@blueprintjs/core";

import EntitySearchForm from "./EntitySearchForm";

import {
	searchEntityResults,
	getEntityType
} from "../../../redux/actions/pageOntologyActions";

class OntologyEditorEntities extends Component {
	state = {};

	componentDidMount = () => {
		this.props.searchEntityResults(
			{
				entityType: this.props.selectedEntityTypeId
			},
			"displayName",
			0,
			20
		);
	};

	componentDidUpdate = prevProps => {
		if (this.props.selectedEntityTypeId !== prevProps.selectedEntityTypeId) {
			this.props.searchEntityResults(
				{
					entityType: this.props.selectedEntityTypeId
				},
				"displayName",
				0,
				20
			);
		}
	};

	handleSubmit = values => {
		console.log(values);

		let newValues = _.assign(values, {
			entityType: this.props.selectedEntityTypeId
		});
		this.props.searchEntityResults(
			newValues,
			"displayName",
			0,
			20,
			this.props.getEntityType(this.props.selectedEntityTypeId).customProperties
		);
	};

	render() {
		console.log(this.props.entitySearchResults);
		return (
			<div className="ontology-entities-properties">
				<div className="properties-section property-section-filters">
					<div className="properties-section-header">
						<div className="header-left">
							<span className="pt-icon-large pt-icon-filter" />
							<h1>Filter by Properties</h1>
						</div>
						<div className="header-right">
							<a
								className="anchor-button"
								onClick={() => console.log("filter")}
							>
								Clear
							</a>
						</div>
					</div>

					<div className="properties-section-content">
						<EntitySearchForm
							onSubmit={this.handleSubmit.bind(this)}
							onChange={this.handleSubmit.bind(this)}
							enableReinitialize={true}
						/>
					</div>
				</div>

				<div className="properties-section property-section-results">
					<div className="properties-section-header">
						<div className="header-left">
							<h2 className="result-count">
								{this.props.entitySearchResults.all
									? this.props.entitySearchResults.all.length
									: "0"}{" "}
								Results
							</h2>
						</div>
						<div className="header-right">
							<div className="sort-container">
								<span className="sort-label">Sort By: </span>
								<a
									className="anchor-button"
									onClick={() => console.log("sort")}
								>
									Recently Added{" "}
									<span className="pt-icon-standard pt-icon-caret-down" />
								</a>
							</div>
						</div>
					</div>

					<div className="properties-section-content">
						{this.props.entitySearchResults.fetchingEntityResults ? (
							<div className="entities-loader">
								<Spinner />
							</div>
						) : (
							<div className="entities-list">
								{this.props.entitySearchResults.all &&
								this.props.entitySearchResults.all.length > 0
									? this.props.entitySearchResults.all.map((entity, i) => {
											return <div key={i}>{entity.properties.displayName}</div>;
										})
									: ""}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	entitySearchResults: state.pageOntology.entitySearchResults
});

export default withRouter(
	connect(mapStateToProps, { searchEntityResults, getEntityType })(
		OntologyEditorEntities
	)
);
