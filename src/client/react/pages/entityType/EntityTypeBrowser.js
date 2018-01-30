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
	updateBrowserGroups,
	loadEntityTypeDetails,
	loadAllEntityTypes,
	resetBrowser,
	resetBrowserGroups
} from "../../../redux/actions/pageEntityTypeActions";

import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";

import EntityTypeBrowserGroup from "./EntityTypeBrowserGroup";
import EntityTypeSelector from "./EntityTypeSelector";

import Button from "../../components/common/button/Button";

class EntityTypeBrowser extends Component {
	state = {
		showNoChildren: false,
		showCustomSelectedEntity: false,
		customSelectedEntityId: null
	};

	componentDidMount = () => {
		if (!this.props.location.search) {
			this.resetBrowser();
		} else {
			this.updateBrowser(this.getQueryParams());
		}
	};

	componentWillUnmount = () => {
		this.props.resetBrowser();
	};

	componentDidUpdate = (prevProps, prevState) => {
		// the only 2 places where new groups are recomputed

		if (!_.isEqual(prevProps.pageEntityType.browser, this.props.browser)) {
			this.computeGroups();
		}

		if (
			!_.isEqual(
				prevProps.pageEntityType.allEntityTypes.sort(),
				this.props.allEntityTypes.sort()
			)
		) {
			this.computeGroups();
		}
	};

	updateBrowser = newState => {
		this.props.updateBrowser(newState);
		this.updateQueryString(newState);
	};

	resetBrowser = () => {
		this.updateBrowser({
			initial: "true",
			loadedTopLevel: "false",
			loadedCustom: "false",
			loadedCustomId: "",
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

	getCustomSelectedEntityDetails = () => {
		if (!_.isEmpty(this.state.customSelectedEntityId)) {
			let selectedEntity = _.filter(this.props.allEntityTypes, entity => {
				return entity._id == this.props.browser.loadedCustomId;
			});
			if (selectedEntity[0]) {
				return selectedEntity[0].genericProperties.displayName;
			} else return;
		} else return;
	};

	loadCustomEntity = id => {
		let active = [];
		let selectedEntity = _.filter(this.props.allEntityTypes, entity => {
			return entity._id == id;
		});
		active.push({ entityTypeId: selectedEntity[0]._id });

		this.updateBrowser({
			initial: "false",
			loadedCustom: "true",
			loadedCustomId: id,
			active: active,
			selectedEntityType: id
		});
	};

	renderBrowserContent = () => {
		let activeGroups = this.props.pageEntityType.activeEntityTypeGroups;

		if (this.props.browser.initial == "true") {
			return this.renderInitialState();
		} else {
			if (activeGroups && activeGroups.length > 0) {
				return (
					<div className="browser-groups-container">
						{this.props.browser.loadedCustom ? (
							<div className="custom-selected-entity">
								{this.getCustomSelectedEntityDetails()}
							</div>
						) : (
							""
						)}
						{activeGroups.map((group, i) => {
							return (
								<EntityTypeBrowserGroup
									toggleEntityType={this.toggleEntityType}
									updateQueryString={this.updateQueryString}
									resetBrowser={this.resetBrowser}
									addEntityTypeToGroup={this.addEntityTypeToGroup}
									closeEntityType={this.closeEntityType}
									group={group}
									position={i}
									key={i}
								/>
							);
						})}

						{this.state.showNoChildren ? this.renderNewSubTypeButton() : ""}
					</div>
				);
			}
		}
	};

	closeEntityType = (id, parentId, position) => {
		if (parentId) {
			let newActive = this.props.browser.active.slice(0, position - 1);
			this.updateBrowser({
				active: newActive
			});
		} else {
			this.resetBrowser();
		}
	};

	renderNewSubTypeButton = () => {
		if (this.props.browser.active && this.props.browser.active.length > 0) {
			let lastActiveId = this.props.browser.active[
				this.props.browser.active.length - 1
			].entityTypeId;
			let activeEntity = _.filter(this.props.allEntityTypes, entity => {
				return entity._id == lastActiveId;
			});
			return (
				<div className="no-children-container">
					<Button onClick={() => this.createNewSubtype()} buttonBlack>
						New Sub-Type of "{activeEntity[0].genericProperties.displayName}"
					</Button>
				</div>
			);
		}
	};

	renderInitialState = () => {
		return (
			<div className="browser-initial-state">
				<div className="browser-initial-content">
					<h1>Choose How To Load Entity Types</h1>
					<div className="browser-selector">
						<EntityTypeSelector onChange={this.loadCustomEntity} />
					</div>

					<div className="browser-top-level">
						<Button onClick={() => this.loadTopLevelEntities()} buttonBlack>
							Load Top Level Entity Types
						</Button>
					</div>
				</div>
			</div>
		);
	};

	loadTopLevelEntities = () => {
		this.updateBrowser({
			initial: "false",
			loadedTopLevel: "true"
		});
	};

	createEntyTypeGroup = (entities, parentId, single, activeEntityTypeId) => {
		// check if any active idfs match any entities from the entity group
		if (this.props.browser.active && this.props.browser.active.length > 0) {
			let activeMatch;

			_.forEach(this.props.browser.active, activeEntityType => {
				let filteredEntities = _.filter(entities, entity => {
					return entity._id == activeEntityType.entityTypeId;
				});
				if (!_.isEmpty(filteredEntities)) {
					activeMatch = filteredEntities[0];
				}
			});

			if (!_.isEmpty(activeMatch)) {
				activeEntityTypeId = activeMatch._id;
			}
		}
		let sortedEntities = _.orderBy(
			entities,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);
		return {
			entityTypes: sortedEntities,
			activeEntityTypeId: activeEntityTypeId,
			parentId: parentId ? parentId : null,
			single: single
		};
	};

	getOwnAsParent = entity => {
		let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
			if (entityType.parentEntityTypes) {
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

	computeGroups = () => {
		let activeGroups = [];

		this.setState({
			showNoChildren: false
		});

		// Push Top Level Group
		if (this.props.browser.loadedTopLevel == "true") {
			let topLevelEntities = _.filter(this.props.allEntityTypes, entityType => {
				return entityType.parentEntityTypes.length == 0;
			});
			activeGroups.push(this.createEntyTypeGroup(topLevelEntities));
		}

		// Push Top Level Group
		if (this.props.browser.loadedCustom == "true") {
			if (this.props.allEntityTypes && this.props.allEntityTypes.length > 0) {
				let entities = [];
				let selectedEntity = _.filter(this.props.allEntityTypes, entity => {
					return entity._id == this.props.browser.loadedCustomId;
				});
				entities.push(selectedEntity[0]);
				//
				activeGroups.push(this.createEntyTypeGroup(entities, null, true));
			}
		}

		// Push All Active groups
		if (this.props.browser.active && this.props.browser.active.length > 0) {
			_.forEach(this.props.browser.active, activeEntityType => {
				let ownAsParent = this.getOwnAsParent(activeEntityType);

				if (ownAsParent && ownAsParent.length > 0) {
					let newGroup = this.createEntyTypeGroup(
						ownAsParent,
						activeEntityType.entityTypeId
					);
					activeGroups.push(newGroup);
				} else {
					this.setState({
						showNoChildren: true
					});
				}
			});
		}

		this.props.updateBrowserGroups(activeGroups);
	};

	toggleEntityType = (id, group, position) => {
		console.log(
			id,
			group,
			position,
			this.props.browser.selectedEntityType,
			this.props.pageEntityType.activeEntityTypeGroups[position]._id
		);

		if (
			id !==
				this.props.pageEntityType.activeEntityTypeGroups[position]
					.activeEntityTypeId ||
			id !== this.props.browser.selectedEntityType
		) {
			let activeEntities = [];

			if (!this.props.browser.active || _.isEmpty(this.props.browser.active)) {
				activeEntities.push({ entityTypeId: id });
				this.updateBrowser({
					active: activeEntities,
					selectedEntityType: id
				});
			} else {
				if (
					id ==
					this.props.pageEntityType.activeEntityTypeGroups[position]
						.activeEntityTypeId
				) {
					console.log("now this fires here");
					this.updateBrowser({
						selectedEntityType: id
					});
				} else {
					let filteredEntities = _.filter(
						this.props.browser.active,
						activeEntity => {
							return activeEntity.entityTypeId == id;
						}
					);

					let newPosition = position + 1;

					let newActiveUpdated = update(this.props.browser.active, {
						$splice: [[position, 1, { entityTypeId: id }]]
					});
					activeEntities = newActiveUpdated;

					if (_.isEmpty(filteredEntities)) {
						if (this.props.browser.active.length > newPosition) {
							let diff = this.props.browser.active.length - newPosition;
							activeEntities = activeEntities.slice(0, -diff);
						}
					} else {
						let diff = this.props.browser.active.length - position;
						let newActiveSliced = activeEntities.slice(0, -diff);
						activeEntities = newActiveSliced;
					}
					this.updateBrowser({
						active: activeEntities,
						selectedEntityType: id
					});
				}
			}
		}
	};

	addEntityTypeToGroup = (id, group, position) => {
		let parentEntityTypes = [];
		if (!_.isEmpty(id)) {
			parentEntityTypes.push({ entityTypeId: id });
		}
		this.props.addEntityType(
			{
				genericProperties: {
					displayName:
						"New Entity Type " + (this.props.allEntityTypes.length + 1),
					createdAt: Date.now(),
					createdBy: this.props.auth._id
				},
				parentEntityTypes: parentEntityTypes
			},
			this.props.history,
			data => {}
		);
	};

	createNewSubtype = () => {
		let arrayLength = this.props.browser.active.length;
		let lastEntityTypeId = this.props.browser.active[arrayLength - 1]
			.entityTypeId;

		let parentEntityTypes = [];
		parentEntityTypes.push({ entityTypeId: lastEntityTypeId });
		this.props.addEntityType(
			{
				genericProperties: {
					displayName:
						"New Entity Type " + (this.props.allEntityTypes.length + 1),
					createdAt: Date.now(),
					createdBy: this.props.auth._id
				},
				parentEntityTypes: parentEntityTypes
			},
			this.props.history,
			data => {}
		);
	};

	collapseBrowser = () => {
		this.updateBrowser({
			collapsed: "true"
		});
	};

	expandBrowser = () => {
		this.updateBrowser({
			collapsed: "false"
		});
	};

	render() {
		if (this.props.browser.collapsed == "true") {
			return (
				<div className="entity-type-browser-collapsed">
					<div className="browser-collapsed-left">
						<h1>Select Entity Type:</h1>
						<div className="select-container">
							<EntityTypeSelector onChange={this.loadCustomEntity} />
						</div>
					</div>
					<div className="browser-collapsed-right" />
					<button onClick={() => this.expandBrowser()}>ExpandBrowser</button>
				</div>
			);
		}
		return (
			<div
				className={classNames({
					"entity-type-browser-container": true,
					collapsed: this.props.browser.collapsed == "true"
				})}
			>
				<div className="entity-type-browser">
					<div className="browser-header">
						<div className="header-left">
							<h1>Entity Types Browser</h1>
							<ul className="browser-actions">
								<li className="singleAction">
									<button onClick={() => this.resetBrowser()}>
										Reset Browser
									</button>
								</li>
								<li className="singleAction">
									<button>Delete all Entities</button>
								</li>
								<li className="singleAction">
									<button>Create New Entity Type</button>
								</li>
								<li className="singleAction">
									<button>Create New Entity</button>
								</li>
							</ul>
						</div>
						<div className="header-right">
							<ul className="browser-actions">
								<li className="singleAction">
									<button onClick={() => this.collapseBrowser()}>
										Hide Browser
									</button>
								</li>
							</ul>
						</div>
					</div>
					{this.renderBrowserContent()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	pageEntityType: state.pageEntityType,
	browser: state.pageEntityType.browser,
	isFetchingBrowser: state.pageEntityType.isFetchingBrowser,
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withRouter(
	connect(mapStateToProps, {
		addEntityType,
		updateBrowser,
		updateBrowserGroups,
		loadEntityTypeDetails,
		resetBrowser,
		loadAllEntityTypes
	})(EntityTypeBrowser)
);
