import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

import Button from "../../components/common/button/Button";

import Popover from "material-ui/Popover";
import RemoveCircleIcon from "material-ui-icons/RemoveCircle";

import EntityTypeSelector from "./EntityTypeSelector";
import EntityTypeLinker from "./EntityTypeLinker";

import EntityTypeEditorForm from "./EntityTypeEditorForm";
import {
	updateEntityType,
	loadAllEntityTypes,
	deleteEntityType,
	updateBrowser,
	removeParentEntityType
} from "../../../redux/actions/pageEntityTypeActions";

const styles = theme => ({
	paper: {
		"overflow-x": "visible",
		"overflow-y": "visible"
	}
});

class EntityEditor extends Component {
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

		let newActive;

		newActive = this.props.browser.active.slice(0, -1);

		this.updateBrowser({
			selectedEntityType: "",
			active: newActive,
			loadedCustomId: "",
			loadedCustom: "false"
		});

		this.props.deleteEntityType(this.props.browser.selectedEntityType);
	};

	removeParentEntityType = id => {
		this.props.removeParentEntityType(
			this.props.browser.selectedEntityType,
			id,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	removeParentEntityTypeFromChild = id => {
		this.props.removeParentEntityType(
			id,
			this.props.browser.selectedEntityType,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
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

		let sortedEntities = _.orderBy(
			parentEntities,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);

		return (
			<ul className="parents-list">
				{sortedEntities && sortedEntities.length > 0
					? sortedEntities.map(entityType => {
							return (
								<li key={entityType._id}>
									<RemoveCircleIcon
										className="simple-button"
										onClick={() => {
											this.removeParentEntityType(
												entityType._id,
												this.props.browser.selectedEntityType
											);
										}}
									/>
									<span className="empty-type-name">
										{entityType.genericProperties.displayName}
									</span>
								</li>
							);
						})
					: ""}
			</ul>
		);
	};

	renderChildren = () => {
		let childrenEntities = this.getOwnAsParent({
			entityTypeId: this.props.browser.selectedEntityType
		});

		let sortedEntities = _.orderBy(
			childrenEntities,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);

		return (
			<ul className="parents-list">
				{sortedEntities && sortedEntities.length > 0
					? sortedEntities.map(entityType => {
							return (
								<li key={entityType._id}>
									<RemoveCircleIcon
										className="simple-button"
										onClick={() =>
											this.removeParentEntityTypeFromChild(entityType._id)
										}
									/>
									<span className="empty-type-name">
										{entityType.genericProperties.displayName}
									</span>
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

	getOwnAsParent = entity => {
		let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
			if (entityType && entityType.parentEntityTypes) {
				let containsAsParent = _.filter(
					entityType.parentEntityTypes,
					parentEntityType => {
						return parentEntityType.entityTypeId == entity.entityTypeId;
					}
				);
				if (containsAsParent && containsAsParent.length > 0) {
					return true;
				}
			} else {
				return false;
			}
		});
		return ownAsParent;
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

		let entity = this.getEntityType(this.props.browser.selectedEntityType);
		let ownAsParent = [];
		if (entity) {
			ownAsParent = this.getOwnAsParent({ entityTypeId: entity._id });
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
										<h1>
											{
												this.getEntityType(
													this.props.browser.selectedEntityType
												).parentEntityTypes.length
											}{" "}
											Parents
										</h1>
									</div>
									<div className="editor-section-right">
										<ul className="editor-actions">
											<li>
												<EntityTypeLinker intent="addParent" />
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
										<h1>{ownAsParent.length} Children</h1>
									</div>
									<div className="editor-section-right">
										<ul className="editor-actions">
											<li>
												<EntityTypeLinker intent="addChild" />
											</li>
										</ul>
									</div>
								</div>
								<div className="editor-section-content">
									{this.renderChildren()}
								</div>
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
	auth: state.auth,
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
			removeParentEntityType
		})(EntityEditor)
	)
);
