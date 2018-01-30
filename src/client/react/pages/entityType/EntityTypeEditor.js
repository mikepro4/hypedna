import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

import Popover from "material-ui/Popover";

import EntityTypeSelector from "./EntityTypeSelector";

import EntityTypeEditorForm from "./EntityTypeEditorForm";
import {
	updateEntityType,
	loadAllEntityTypes,
	deleteEntityType,
	updateBrowser,
	addParentEntityType
} from "../../../redux/actions/pageEntityTypeActions";

const styles = theme => ({
	paper: {
		"overflow-x": "visible",
		"overflow-y": "visible"
	}
});

class EntityEditor extends Component {
	state = {
		addParentOpen: false,
		addChildOpen: false
	};

	handleAddParentOpen = event => {
		this.setState({ addParentOpen: true, anchorEl: event.currentTarget });
	};

	handleAddParentClose = () => {
		this.setState({ addParentOpen: false });
	};

	handleFormSubmit = values => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.browser.selectedEntityType;
		});

		let newEntityType = _.assign({}, entityType[0], {
			genericProperties: values
		});

		this.props.updateEntityType(
			this.props.browser.selectedEntityType,
			newEntityType,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	deleteEntityType = () => {
		console.log("delete");

		let positionOfActive = _.findIndex(this.props.browser.active, entity => {
			return entity.entityTypeId == this.props.browser.selectedEntityType;
		});

		console.log("positionOfActive: ", positionOfActive);

		let newActive = this.props.browser.active.slice(0, -(positionOfActive - 1));

		this.updateBrowser({
			selectedEntityType: "",
			active: newActive,
			loadedCustomId: "",
			loadedCustom: "false"
		});

		this.props.deleteEntityType(this.props.browser.selectedEntityType);
	};

	addParentEntityType = id => {
		console.log("add parent entity type: ", id);
		this.handleAddParentClose();

		this.props.addParentEntityType(
			this.props.browser.selectedEntityType,
			id,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	addChildEntityType = () => {
		console.log("add child entity type");
	};

	updateBrowser = newState => {
		this.props.updateBrowser(newState);
		this.updateQueryString(newState);
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	updateQueryString = updatedState => {
		let queryParams = this.getQueryParams();
		const updatedQuery = _.assign({}, queryParams, updatedState);
		const str = qs.stringify(updatedQuery);
		this.props.history.push({
			search: "?" + str
		});
	};

	renderParents = () => {
		let parentEntities = [];

		let entityType = this.getEntityType(this.props.browser.selectedEntityType);

		_.forEach(entityType.parentEntityTypes, parentEntityType => {
			if (!_.isEmpty(parentEntityType)) {
				parentEntities.push(this.getEntityType(parentEntityType.entityTypeId));
			}
		});

		return (
			<ul className="parens-list">
				{parentEntities && parentEntities.length > 0
					? parentEntities.map(entityType => {
							return (
								<li key={entityType._id}>
									{entityType.genericProperties.displayName}
								</li>
							);
						})
					: ""}
			</ul>
		);
	};

	findAncestors = id => {
		var ancestors = [];
		var parentEntityTypes = this.getEntityType(id).parentEntityTypes;
	};

	getEntityType = id => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return entityType[0];
	};

	render() {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.browser.selectedEntityType;
		});
		let initialState = {};
		if (!_.isEmpty(entityType[0])) {
			initialState = {
				initialValues: {
					displayName: entityType[0].genericProperties.displayName,
					description: entityType[0].genericProperties.description
				}
			};
		}

		return (
			<div className="entity-editor">
				{this.props.browser.selectedEntityType ? (
					<div className="editor-content">
						<div className="editor-left editor-section">
							<div className="editor-section-header">
								<div className="editor-section-left">
									<h1>Entity Type Details</h1>
								</div>
								<div className="editor-section-right">
									<ul className="editor-actions">
										<li>
											<button onClick={() => this.deleteEntityType()}>
												Delete Entity Type
											</button>
										</li>
									</ul>
								</div>
							</div>
							<div className="editor-section-content">
								<EntityTypeEditorForm
									{...initialState}
									onSubmit={this.handleFormSubmit.bind(this)}
									enableReinitialize="true"
									onChange={values => {
										console.log(values);
									}}
								/>
							</div>
						</div>

						<div className="editor-right">
							<div className="editor-parents editor-section">
								<div className="editor-section-header">
									<div className="editor-section-left">
										<h1> Parents</h1>
									</div>
									<div className="editor-section-right">
										<ul className="editor-actions">
											<li>
												<button
													onClick={event => this.handleAddParentOpen(event)}
												>
													Associate Parent
												</button>

												<Popover
													open={this.state.addParentOpen}
													anchorEl={this.state.anchorEl}
													onClose={this.handleAddParentClose}
													classes={{ paper: this.props.classes.paper }}
													anchorOrigin={{
														vertical: "bottom",
														horizontal: "left"
													}}
												>
													<div className="add-parent-container">
														<EntityTypeSelector
															onChange={this.addParentEntityType}
														/>
													</div>
												</Popover>
											</li>
										</ul>
									</div>
								</div>
								<div className="editor-section-content">
									{this.renderParents()}
								</div>
							</div>
							<div className="editor-children editor-section">
								<div className="editor-section-header">
									<div className="editor-section-left">
										<h1>0 Children</h1>
									</div>
									<div className="editor-section-right">
										<ul className="editor-actions">
											<li>
												<button onClick={() => this.addChildEntityType()}>
													Add Child
												</button>
											</li>
										</ul>
									</div>
								</div>
								<div className="editor-section-content">children here</div>
							</div>
						</div>
					</div>
				) : (
					"Select entity type to edit."
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	form: state.form,
	browser: state.pageEntityType.browser,
	editor: state.pageEntityType.editor,
	isFetchingBrowser: state.pageEntityType.isFetchingBrowser,
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			updateEntityType,
			loadAllEntityTypes,
			deleteEntityType,
			updateBrowser,
			addParentEntityType
		})(EntityEditor)
	)
);
