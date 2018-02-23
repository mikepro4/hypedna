import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import qs from "qs";
import * as _ from "lodash";

import {
	Button,
	Classes,
	EditableText,
	Intent,
	NumericInput,
	Switch
} from "@blueprintjs/core";

import { Tab2, Tabs2, NonIdealState } from "@blueprintjs/core";

import { getEntityType } from "../../../redux/actions/pageOntologyActions";

import { updateQueryString } from "../../../redux/actions/";

import { loadEntityDetails } from "../../../redux/actions/pageEntityActions";

class EntityDetails extends Component {
	state = {
		entityTitle: "",
		edited: false,
		selectedTabId: "1"
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.entity._id !== this.props.entity._id) {
			this.setState({
				entityTitle: this.props.entity.properties.displayName
			});
		}

		if (prevState.selectedTabId !== this.getQueryParams().selectedTabId) {
			this.setState({
				selectedTabId: this.getQueryParams().selectedTabId
			});
		}
	};

	handleTitleChange = title => {
		this.setState({
			entityTitle: title
		});
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	componentDidMount = () => {
		if (this.props.location.search) {
			let queryParams = this.getQueryParams();
			this.setState({
				selectedTabId: queryParams.selectedTabId
			});
		}
		this.setState({
			entityTitle: this.props.entity.properties.displayName
		});
	};

	handleTabChange = value => {
		this.setState({
			selectedTabId: value
		});

		this.props.updateQueryString(
			{ selectedTabId: value },
			this.props.location,
			this.props.history
		);
	};

	handleFormSubmit = () => {
		console.log(this.state);
	};

	render() {
		console.log(this.props.history);
		return (
			<div className="entity-details-container">
				<div className="entity-details-header">
					<div className="header-left">
						<div className="header-left">
							<div className="entity-avatar">
								<img src="http://via.placeholder.com/100x100" />
							</div>
							<div className="entity-info">
								<div className="entity-info-element">
									<div>{
										this.props.getEntityType(
											this.props.entity.associatedEntityTypes[0].entityTypeId
										).genericProperties.displayName
									}</div>
									{this.props.match.params.entityUrlName ==
									this.props.entity.properties.entityUrlName ? (
										<EditableText
											intent={Intent.DEFAULT}
											maxLength="500"
											placeholder="Edit Entity Title..."
											className="entity-title"
											selectAllOnFocus={true}
											value={this.state.entityTitle}
											confirmOnEnterKey="true"
											onChange={this.handleTitleChange}
											onConfirm={this.handleFormSubmit}
										/>
									) : (
										"Loading..."
									)}
									<div />
								</div>
							</div>
						</div>
					</div>
					<div className="header-right">right</div>
				</div>
				<div className="entity-details-content">
					<div className="ontology-editor-tabs-container">
						<Tabs2
							id="Tabs2Example"
							onChange={this.handleTabChange}
							selectedTabId={this.state.selectedTabId}
							large={true}
						>
							<Tab2 id="1" title="Timeline" panel={<div>Timeline</div>} />

							<Tab2 id="2" title="Properties" panel={<div>Properties</div>} />
						</Tabs2>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	entity: state.pageEntity.entity,
	allEntityTypes: state.pageOntology.allEntityTypes
});

export default withRouter(
	connect(mapStateToProps, {
		loadEntityDetails,
		updateQueryString,
		getEntityType
	})(EntityDetails)
);
