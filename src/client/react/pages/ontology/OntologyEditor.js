import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

import { Tab2, Tabs2 } from "@blueprintjs/core";

import { updateQueryString } from "../../../redux/actions/";

import OntologyEditorRelations from "./OntologyEditorRelations";
import OntologyEditorProperties from "./OntologyEditorProperties";

import {
	Button,
	Classes,
	EditableText,
	Intent,
	NumericInput,
	Switch
} from "@blueprintjs/core";

import {
	updateEntityType,
	deleteEntityType,
	loadAllEntityTypes,
	selectEntityType
} from "../../../redux/actions/pageOntologyActions";

const styles = theme => ({});

class OntologyEditor extends Component {
	state = {
		title: "",
		description: "",
		edited: false,
		selectedTabId: "0"
	};

	handleTitleChange = title => {
		this.setState({
			title
		});
	};

	handleDescriptionChange = description => {
		this.setState({
			description
		});
	};

	handleFormSubmit = () => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.selectedEntityTypeId;
		});

		let newEntityType = _.assign({}, entityType[0], {
			genericProperties: {
				displayName: this.state.title,
				description: this.state.description
			}
		});

		this.props.updateEntityType(
			this.props.selectedEntityTypeId,
			newEntityType,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	componentDidMount = () => {
		if (this.props.location.search) {
			let queryParams = this.getQueryParams();
			this.setState({
				selectedTabId: queryParams.selectedTabId
			});
		}
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	componentDidUpdate = (prevProps, prevState) => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.selectedEntityTypeId;
		});

		if (entityType[0]) {
			if (
				!_.isEqual(
					prevState.title,
					entityType[0].genericProperties.displayName
				) &&
				!this.state.edited
			) {
				this.setState({
					title: entityType[0].genericProperties.displayName,
					description: entityType[0].genericProperties.description,
					edited: true
				});
			}
		}

		if (
			!_.isEqual(
				prevProps.selectedEntityTypeId,
				this.props.selectedEntityTypeId
			)
		) {
			this.setState({
				edited: false,
				description: ""
			});
		}
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

	getEntityType = () => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.selectedEntityTypeId;
		});

		return entityType[0];
	};

	deleteEntityType = () => {
		this.props.deleteEntityType(this.getEntityType()._id);
		this.props.updateSelectedEntityType("");
	};

	render() {
		if (!this.props.selectedEntityTypeId) {
			return <div>Select entity Type</div>;
		}
		return (
			<div className="ontology-editor-content">
				<div className="ontology-editor-header">
					<div className="header-left">
						<div className="entity-type-avatar">
							<img src="http://via.placeholder.com/200x200" />
						</div>
						<div className="entity-type-info">
							<div className="entity-type-info-element">
								<div>
									<EditableText
										intent={Intent.DEFAULT}
										maxLength="500"
										placeholder="Edit entityType Title..."
										className="entity-type-title"
										selectAllOnFocus={true}
										value={this.state.title}
										confirmOnEnterKey="true"
										onChange={this.handleTitleChange}
										onConfirm={this.handleFormSubmit}
									/>
								</div>
								<div>
									<EditableText
										intent={Intent.DEFAULT}
										maxLength="500"
										placeholder="Type description here..."
										className="entity-type-description"
										selectAllOnFocus={true}
										value={this.state.description}
										confirmOnEnterKey="true"
										onChange={this.handleDescriptionChange}
										onConfirm={this.handleFormSubmit}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="header-right">
						<ul className="actions">
							<li>
								<Button
									iconName="trash"
									text="Delete Entity Type"
									onClick={() => {
										this.deleteEntityType();
									}}
									intent={Intent.DEFAULT}
								/>
							</li>
						</ul>
					</div>
				</div>
				<div className="ontology-editor-tabs-container">
					<Tabs2
						id="Tabs2Example"
						onChange={this.handleTabChange}
						selectedTabId={this.state.selectedTabId}
						large={true}
					>
						<Tab2
							id="0"
							title="Overview"
							panel={<div style={{ height: "3000px" }}>overview</div>}
						/>
						<Tab2
							id="1"
							title="Properties"
							panel={
								<div>
									<OntologyEditorProperties />
								</div>
							}
						/>
						<Tab2
							id="2"
							title="Relations"
							panel={
								<div>
									<OntologyEditorRelations />
								</div>
							}
						/>

						<Tab2 id="3" title="Entities" panel={<div>entities</div>} />
					</Tabs2>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageEntityType.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			loadAllEntityTypes,
			updateEntityType,
			deleteEntityType,
			updateQueryString
		})(OntologyEditor)
	)
);
