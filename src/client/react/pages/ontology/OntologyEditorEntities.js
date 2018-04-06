import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import moment from "moment";

import { Classes, Spinner, NonIdealState } from "@blueprintjs/core";

import EntitySearchForm from "./EntitySearchForm";
import EntityResult from "./EntityResult";

import {
	searchEntityResults,
	getEntityType,
	loadMoreEntityResults,
	resetForm,
	deleteEntity,
	submitForm
} from "../../../redux/actions/pageOntologyActions";

class OntologyEditorEntities extends Component {
	state = {};

	componentDidMount = () => {
		this.initialSearch();
	};

	componentDidUpdate = prevProps => {
		if (
			qs.parse(prevProps.location.search.substring(1)).selectedTabId !==
			qs.parse(this.props.location.search.substring(1)).selectedTabId
		) {
			this.initialSearch();
		}
		if (this.props.selectedEntityTypeId !== prevProps.selectedEntityTypeId) {
			this.initialSearch();
		}
	};

	initialSearch = () => {
		this.props.resetForm("entitySearchForm");
		this.props.searchEntityResults(
			{
				entityType: this.props.selectedEntityTypeId
			},
			"created",
			0,
			20
		);
	};

	handleSubmit = values => {
		console.log(values);

		let newValues = _.assign(values, {
			entityType: this.props.selectedEntityTypeId
		});
		this.props.searchEntityResults(
			newValues,
			"created",
			0,
			20,
			this.props.getEntityType(this.props.selectedEntityTypeId).customProperties
		);
	};

	loadMoreResults = () => {
		let formValues = _.assign(this.props.form.values, {
			entityType: this.props.selectedEntityTypeId
		});
		this.props.loadMoreEntityResults(
			formValues,
			"created",
			this.props.entitySearchResults.offset + 20,
			this.props.entitySearchResults.limit + 20,
			this.props.getEntityType(this.props.selectedEntityTypeId).customProperties
		);
	};

	renderLoadMoreButton = () => {
		if (
			this.props.entitySearchResults.count >
			this.props.entitySearchResults.limit
		) {
			return (
				<a className="anchor-button" onClick={() => this.loadMoreResults()}>
					Load More
				</a>
			);
		}
	};

	renderEntityResult = (entity, i) => {
		return (
			<div className="entity-result-container" key={i}>
				<div className="entity-result-left">
					<div className="entity-avatar">
						<img src="http://via.placeholder.com/88x88" />
					</div>

					<div className="entity-result-description">
						<h1 className="entity-title">{entity.properties.displayName}</h1>
						<ul className="entity-metadata-list">
							<li className="entity-single-metadata-option">
								{entity.properties.entityUrlName}
							</li>
							<li className="entity-single-metadata-option">
								Added {moment(entity.properties.createdAt).fromNow()}
							</li>
						</ul>
					</div>
				</div>

				<div className="entity-result-right">
					<ul className="entity-result-actions">
						<li className="entity-single-result-action">
							<a className="anchor-button">
								<span className="pt-icon-standard pt-icon-edit" />
							</a>
						</li>
						<li className="entity-single-result-action">
							<a
								className="anchor-button"
								onClick={() => this.props.deleteEntity(entity._id)}
							>
								<span className="pt-icon-standard pt-icon-trash" />
							</a>
						</li>
						<li className="entity-single-result-action">
							<a className="anchor-button">
								<span className="pt-icon-standard pt-icon-chevron-right" />
							</a>
						</li>
					</ul>
				</div>
			</div>
		);
	};

	render() {
		if (
			qs.parse(this.props.location.search.substring(1)).selectedTabId !== "2"
		) {
			return "";
		}
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
								onClick={() => this.props.resetForm("entitySearchForm")}
							>
								Clear
							</a>
						</div>
					</div>

					<div className="properties-section-content">
						<EntitySearchForm
							ref="form"
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
								{this.props.entitySearchResults.count ? (
									<div>
										{this.props.entitySearchResults.count} Result{this.props
											.entitySearchResults.count > 1
											? "s"
											: ""}
									</div>
								) : (
									""
								)}
							</h2>
						</div>
						<div className="header-right">
							<div className="sort-container">
								<span className="sort-label">Sort By: </span>
								<a
									className="anchor-button"
									onClick={() => this.props.submitForm("entitySearchForm")}
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
								this.props.entitySearchResults.all.length > 0 ? (
									this.props.entitySearchResults.all.map((entity, i) => {
										return (
											<div key={entity._id + i}>
												<EntityResult entity={entity} />
											</div>
										);
										return this.renderEntityResult(entity, i);
									})
								) : (
									<NonIdealState
										visual="search"
										title={`No entities found`}
										description={
											<div>
												Adjust filters or create new entities that match this
												criteria.
											</div>
										}
									/>
								)}
								{this.renderLoadMoreButton()}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	form: state.form.entitySearchForm,
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	entitySearchResults: state.pageOntology.entitySearchResults
});

export default withRouter(
	connect(mapStateToProps, {
		searchEntityResults,
		getEntityType,
		loadMoreEntityResults,
		resetForm,
		submitForm,
		deleteEntity
	})(OntologyEditorEntities)
);
