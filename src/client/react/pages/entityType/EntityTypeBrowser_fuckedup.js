import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import classNames from "classnames";
import qs from "qs";

import {
	addEntityType,
	updateBrowser,
	loadEntityTypeDetails
} from "../../../redux/actions/pageEntityTypeActions";

import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";

class EntityTypeBrowser extends Component {
	componentDidMount = () => {
		if (!this.props.location.search) {
			this.resetBrowser();
		} else {
			this.initialBrowserUpdate();
		}
	};

	componentDidUpdate = () => {
		if (this.props.location.search) {
			if (!this.isEqualQueryString()) {
				this.props.updateBrowser(this.getQueryParams());
			}

			this.loadLastActiveEntityType();
		}
	};

	loadLastActiveEntityType = () => {
		let query = this.getQueryParams();
		if (
			query.active &&
			query.active.length > 0 &&
			query.selectedEntityType == null
		) {
			let arrayLength = query.active.length;

			let positionOfElement = _.findIndex(query.active, {
				id: query.active[arrayLength - 1].id
			});

			let lastEntityType = _.filter(this.props.allEntityTypes, entityType => {
				return entityType._id == query.active[arrayLength - 1].id;
			});

			if (lastEntityType[0]) {
				this.props.loadEntityTypeDetails(lastEntityType[0]._id);
				this.updateQueryString({
					selectedEntityType: lastEntityType[0]._id
				});
			}
		}
	};

	isEqualQueryString = () => {
		if (this.props.location) {
			let newString = this.getQueryParams();
			let oldString = this.props.browser;
			return _.isEqual(newString, oldString);
		} else return false;
	};

	initialBrowserUpdate = () => {
		this.props.updateBrowser(this.getQueryParams());

		// load entity type if in the url
		let selectedEntityType = this.getQueryParams().selectedEntityType;
		if (selectedEntityType) {
			this.props.loadEntityTypeDetails(selectedEntityType);
		}
	};

	loadTopLevelEntities = () => {
		this.updateQueryString({
			initial: "false",
			topLevel: "true"
		});
	};

	resetBrowser = () => {
		this.updateQueryString({
			initial: "true",
			topLevel: "false",
			active: []
		});
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

	renderInitialState = () => {
		return (
			<div>
				<button onClick={() => this.loadTopLevelEntities()}>
					Load top level entities
				</button>
			</div>
		);
	};

	renderTopLevelEntityType = () => {
		let topLevelEntities = _.filter(this.props.allEntityTypes, entityType => {
			return entityType.genericProperties.topLevel == true;
		});
		return this.renderSingleEntityTypeGroup(topLevelEntities, true);
	};

	renderActiveEntityTypes = (entityTypes, isTopLevel, parentId) => {
		return <div key="activeEntityType">active entoty types here</div>;
	};

	renderNoChildren = () => {
		return (
			<div key="noChildren">
				no children{" "}
				<button onClick={() => this.createNewSubtype()}>
					Create newSubType
				</button>
			</div>
		);
	};

	createNewSubtype = () => {
		let arrayLength = this.props.browser.active.length;

		let positionOfElement = _.findIndex(this.props.browser.active, {
			id: this.props.browser.active[arrayLength - 1].id
		});

		let lastEntityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.browser.active[arrayLength - 1].id;
		});
		console.log(lastEntityType[0]._id);
		let parentEntityTypes = [];
		parentEntityTypes.push({ entityTypeId: lastEntityType[0]._id });
		this.props.addEntityType({
			genericProperties: {
				displayName: "New Entity Type " + (this.props.allEntityTypes.length + 1)
			},
			parentEntityTypes: parentEntityTypes
		});
	};

	renderBrowserContent = () => {
		if (this.props.browser.initial == "true") {
			return this.renderInitialState();
		} else {
			let activeGroups = [];

			if (this.props.browser.topLevel == "true") {
				console.log("render top level");
				activeGroups.push(this.renderTopLevelEntityType());
			}

			if (this.props.browser.active && this.props.browser.active.length > 0) {
				console.log("decide if render active groups");
				let activeEntityTypeGroups = [];

				_.forEach(this.props.browser.active, originalEntityType => {
					let ownAsParrent = _.filter(this.props.allEntityTypes, entityType => {
						if (entityType.parentEntityTypes) {
							let containsAsParent = _.filter(
								entityType.parentEntityTypes,
								parentEntityType => {
									return parentEntityType.entityTypeId == originalEntityType.id;
								}
							);
							return containsAsParent.length > 0;
						} else {
							return false;
						}
					});

					if (ownAsParrent.length > 0) {
						activeGroups.push(
							this.renderSingleEntityTypeGroup(
								ownAsParrent,
								false,
								originalEntityType.id
							)
						);
					}
				});

				if (!this.checkIfHasChildren()) {
					console.log("render new sub type button");
					activeGroups.push(this.renderNoChildren());
				}
			}
			return activeGroups;
		}
	};

	checkIfHasChildren = () => {
		if (this.props.browser.active) {
			let arrayLength = this.props.browser.active.length;

			let positionOfElement = _.findIndex(this.props.browser.active, {
				id: this.props.browser.active[arrayLength - 1].id
			});

			let lastEntityType = _.filter(this.props.allEntityTypes, entityType => {
				return entityType._id == this.props.browser.active[arrayLength - 1].id;
			});

			let ownAsParrent = _.filter(this.props.allEntityTypes, entityType => {
				if (entityType.parentEntityTypes) {
					let containsAsParent = _.filter(
						entityType.parentEntityTypes,
						entityTypeParent => {
							return (
								entityTypeParent.entityTypeId ==
								this.props.browser.active[arrayLength - 1].id
							);
						}
					);
					return containsAsParent.length > 0;
				} else {
					return false;
				}
			});
			return ownAsParrent.length > 0;
		}
	};

	checkActive = id => {
		let filteredActive = _.filter(this.props.browser.active, entityType => {
			return entityType.id == id;
		});
		return filteredActive.length > 0;
	};

	activateEntityType = id => {
		if (this.props.browser.active) {
			let filteredActive = _.filter(this.props.browser.active, entityType => {
				return entityType.id == id;
			});

			if (!filteredActive[0]) {
				this.shouldAddSelection(id);
			} else {
				this.removeActivatedItem(filteredActive[0].id);
			}
		} else {
			this.addActivatedItem(id);
			this.props.loadEntityTypeDetails(id);
		}
	};

	shouldAddSelection = id => {
		let newEntityType = this.getEntityTypeDetails(id);
		if (newEntityType.genericProperties.topLevel) {
			let anyActiveTopLevel = _.filter(
				this.props.browser.active,
				entityType => {
					return (this.getEntityTypeDetails(
						entityType.id
					).genericProperties.topLevel = true);
				}
			);

			if (anyActiveTopLevel.length > 0) {
				this.addTopLevelEntityType(id);
			}
		} else {
			console.log("check here");

			let anyActiveSameParentId = _.filter(
				this.props.browser.active,
				entityType => {
					return true;
				}
			);
		}
		// this.removeActivatedItem(id);
	};

	removeActivatedItem = id => {
		let positionOfElement = _.findIndex(this.props.browser.active, {
			id: id
		});

		let arrayLength = this.props.browser.active.length;
		let newActiveEntityTypes = this.props.browser.active.slice(
			0,
			-(arrayLength - positionOfElement)
		);
		console.log("removed activated item");

		this.updateQueryString({
			active: newActiveEntityTypes,
			selectedEntityType: {}
		});
	};

	addActivatedItem = id => {
		let newEntityType = this.getEntityTypeDetails(id);

		if (newEntityType.genericProperties.topLevel) {
			this.addTopLevelEntityType(id);
		}

		//
		// if (this.props.browser.active) {
		// 	if (!newEntityType[0].genericProperties.topLevel) {
		// 		// newActive = this.props.browser.active;
		// 		console.log("select another one: ", this.getEntityTypeDetails(id));
		//
		// 		let newEntityToAdd = this.getEntityTypeDetails(id);
		//
		// 		_.forEach(this.props.browser.active, activeEntityType => {
		// 			let testEntity = this.getEntityTypeDetails(activeEntityType.id);
		// 			let test = _.filter(
		// 				testEntity.parentEntityTypes,
		// 				parentEntityType => {
		// 					return true;
		// 				}
		// 			);
		// 			console.log(test);
		// 		});
		// 	} else {
		// 	}
		// }
		//
		// newActive.push({
		// 	id: id
		// });
		//
		// let updatedQueryString = _.assign({}, this.props.browser, {
		// 	active: newActive,
		// 	selectedEntityType: id
		// });
		//
		// console.log("add activated item");
		// this.updateQueryString(updatedQueryString);
	};

	addTopLevelEntityType = id => {
		let newActive = [];

		newActive.push({
			id: id
		});

		let updatedQueryString = _.assign({}, this.props.browser, {
			active: newActive,
			selectedEntityType: id
		});
		console.log("added top level item");
		this.updateQueryString(updatedQueryString);
	};

	getEntityTypeDetails = id => {
		let filteredEntityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return filteredEntityType[0];
	};

	renderSingleEntityTypeGroup = (entityTypes, isTopLevel, parentId) => {
		return (
			<div
				className="browser-single-group"
				key={isTopLevel ? "topLevel" : parentId}
			>
				<div className="single-group-header">
					<div className="header-left">
						<div className="header-count">{entityTypes.length}</div>
						<div className="header-count-label">
							<span className="entity-type-level">
								{isTopLevel ? "Top Level" : "Sub Types of"}
							</span>
							<span className="entity-type-reference">Entity Types</span>
						</div>
					</div>

					<div className="header-right">
						<ul className="header-actions">
							<li className="single-action">
								<button
									className="header-button"
									onClick={() => {
										this.props.addEntityType({
											genericProperties: {
												displayName:
													"New Entity Type " +
													(this.props.allEntityTypes.length + 1),
												topLevel: true
											}
										});
									}}
								>
									<AddCircleIcon />
									<span className="button-label">New</span>
								</button>
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
				<div className="single-group-results">
					{entityTypes.length > 0
						? entityTypes.map(entityType => {
								return (
									<div
										className={classNames({
											"single-group-result": true,
											selected: this.checkActive(entityType._id)
										})}
										onClick={() => {
											this.activateEntityType(entityType._id);
										}}
										key={entityType._id}
									>
										{entityType.genericProperties.displayName}
									</div>
								);
							})
						: ""}
				</div>
			</div>
		);
	};

	render() {
		return (
			<div className="entity-type-browser">
				<div className="browser-header">
					<div className="header-left">
						<h1>Entity Types Browser</h1>
						<ul className="browser-actions">
							<li className="singleAction">
								<button>Reset Search</button>
							</li>
						</ul>
					</div>
					<div className="header-right">
						<ul className="browser-actions">
							<li className="singleAction">
								<a>Hide Browser</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="browser-groups-container">
					{this.renderBrowserContent()}
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
		loadEntityTypeDetails
	})(EntityTypeBrowser)
);
