import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import classNames from "classnames";
import qs from "qs";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import ReactDOM from "react-dom";

import {
	addEntityType,
	updateBrowser,
	loadEntityTypeDetails,
	resetBrowser
} from "../../../redux/actions/pageEntityTypeActions";

import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";

import EntityTypeLinker from "./EntityTypeLinker";

class EntityTypeBrowserGroup extends Component {
	componentDidMount = () => {
		this.scrollToSelectedElement();
	};

	scrollToSelectedElement = () => {
		var selectedItem = this.refs.selected;
		if (selectedItem) {
			var domNode = ReactDOM.findDOMNode(selectedItem);
			var parentNode = ReactDOM.findDOMNode(this.refs.scrollable_container);
			parentNode.scrollTop = domNode.offsetTop;
		}
	};

	resetBrowser = () => {
		console.log("reset");
		this.props.closeEntityType(
			this.props.group._id,
			this.props.group.parentId,
			this.props.position
		);
	};

	checkActive = id => {
		return this.props.browser.selectedEntityType == id;
	};
	checkSubActive = id => {
		return this.props.group.activeEntityTypeId == id;
	};

	toggleEntityType = id => {
		this.props.toggleEntityType(id, this.props.group, this.props.position);
	};

	addEntityType = () => {
		console.log("add entity type");
		this.props.addEntityTypeToGroup(
			this.props.group.parentId,
			this.props.group,
			this.props.position,
			() => {
				this.scrollToSelectedElement();
			}
		);
	};

	getParentName = () => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.group.parentId;
		});
		if (entityType[0] && entityType[0].genericProperties) {
			return entityType[0].genericProperties.displayName;
		} else {
			return "";
		}
	};

	getParentsCount = id => {
		let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
			if (entityType.parentEntityTypes) {
				let containsAsParent = _.filter(
					entityType.parentEntityTypes,
					parentEntityType => {
						return parentEntityType.entityTypeId == id;
					}
				);
				if (containsAsParent && containsAsParent.length > 0) {
					return true;
				}
			} else {
				return false;
			}
		});

		return ownAsParent.length;
	};

	getRefValue = id => {
		const refValue =
			this.props.group.activeEntityTypeId == id ? "selected" : "";
		return refValue;
	};

	toggleEntityType = id => {
		this.props.toggleEntityType(id, this.props.group, this.props.position);
		this.scrollToSelectedElement();
	};

	render() {
		let topLevel = _.isEmpty(this.props.group.parentId);
		if (this.props.group.single) {
			let entityTypeId = this.props.group.entityTypes[0]._id;
			return (
				<div className="single-result-container">
					<div
						className={classNames({
							"single-result": true,
							selected: this.checkActive(entityTypeId),
							"sub-selected": this.checkSubActive(entityTypeId)
						})}
						onClick={() => {
							this.toggleEntityType(entityTypeId);
						}}
					>
						<div className="result-name">
							{this.props.group.entityTypes[0].genericProperties.displayName}
						</div>
					</div>

					<div className="browser-arrow">
						<ChevronRightIcon />
					</div>
				</div>
			);
		}

		return (
			<div
				className="browser-single-group"
				className={classNames({
					"browser-single-group": true,
					hasArrow: this.props.group.activeEntityTypeId ? true : false,
					"browser-single-group-selected":
						this.props.browser.selectedEntityType ==
						this.props.group.activeEntityTypeId
				})}
			>
				<div className="entity-single-group-content">
					<div className="single-group-header">
						<div className="header-left">
							<div className="header-count">
								{this.props.group.entityTypes
									? this.props.group.entityTypes.length
									: ""}
							</div>
							<div className="header-count-label">
								<span className="entity-type-level">
									{topLevel ? "Top Level" : "Sub types of"}
								</span>
								<span className="entity-type-reference">
									{topLevel ? "Entity Types" : `"${this.getParentName()}"`}
								</span>
							</div>
						</div>

						<div className="header-right">
							<ul className="header-actions">
								<li className="single-action">
									<button
										className="header-button"
										onClick={() => this.addEntityType()}
									>
										<AddCircleIcon />
										<span className="button-label">New</span>
									</button>
								</li>

								<li className="single-action">
									<EntityTypeLinker
										intent="addChild"
										idToLink={this.props.group.parentId}
										toggleEntityType={this.toggleEntityType}
									/>
								</li>

								<li className="single-action">
									<button
										className="header-button"
										onClick={() => this.resetBrowser()}
									>
										<CloseIcon />
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="single-group-search">search here</div>
					<div className="single-group-results" ref="scrollable_container">
						{this.props.group.entityTypes &&
						this.props.group.entityTypes.length > 0
							? this.props.group.entityTypes.map(entityType => {
									return (
										<div
											className={classNames({
												"single-group-result": true,
												selected: this.checkActive(entityType._id),
												"sub-selected": this.checkSubActive(entityType._id)
											})}
											ref={this.getRefValue(entityType._id)}
											onClick={() => {
												this.toggleEntityType(entityType._id);
											}}
											key={entityType._id}
										>
											{entityType.genericProperties.displayName} ({this.getParentsCount(
												entityType._id
											)})
										</div>
									);
								})
							: ""}
					</div>
				</div>

				<div className="browser-arrow">
					<ChevronRightIcon />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	browser: state.pageEntityType.browser,
	isFetchingBrowser: state.pageEntityType.isFetchingBrowser,
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(
	connect(mapStateToProps, {
		addEntityType,
		updateBrowser,
		loadEntityTypeDetails,
		resetBrowser
	})(EntityTypeBrowserGroup)
);
