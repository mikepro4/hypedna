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

class EntityTypeBrowser extends Component {
	state = {
		showNoChildren: false
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

	renderBrowserContent = () => {
		let activeGroups = this.props.pageEntityType.activeEntityTypeGroups;

		if (this.props.browser.initial == "true") {
			return this.renderInitialState();
		} else {
			if (activeGroups && activeGroups.length > 0) {
				return (
					<div className="browser-groups-container">
						{activeGroups.map((group, i) => {
							return (
								<EntityTypeBrowserGroup
									toggleEntityType={this.toggleEntityType}
									updateQueryString={this.updateQueryString}
									resetBrowser={this.resetBrowser}
									addEntityTypeToGroup={this.addEntityTypeToGroup}
									group={group}
									position={i}
									key={i}
								/>
							);
						})}

						{this.state.showNoChildren ? (
							<div>
								no children{" "}
								<button
									onClick={() => {
										this.createNewSubtype();
									}}
								>
									creste new sub type{" "}
								</button>
							</div>
						) : (
							""
						)}
					</div>
				);
			}
		}
	};

	renderInitialState = () => {
		return (
			<div>
				<button onClick={() => this.loadCustomEntity()}>
					Load custom entity
				</button>
				<button onClick={() => this.loadTopLevelEntities()}>
					Load top level entities
				</button>
			</div>
		);
	};

	loadTopLevelEntities = () => {
		this.updateBrowser({
			initial: "false",
			loadedTopLevel: "true"
		});
	};

	createEntyTypeGroup = (entities, parentId) => {
		let activeEntityTypeId;

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
			parentId: parentId ? parentId : null
		};
	};

	loadCustomEntity = () => {};

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

		// Push All Active groups
		if (this.props.browser.active && this.props.browser.active.length > 0) {
			_.forEach(this.props.browser.active, activeEntityType => {
				let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
					if (entityType.parentEntityTypes) {
						let containsAsParent = _.filter(
							entityType.parentEntityTypes,
							parentEntityType => {
								return (
									parentEntityType.entityTypeId == activeEntityType.entityTypeId
								);
							}
						);
						if (containsAsParent && containsAsParent.length > 0) {
							return true;
						}
					} else {
						return false;
					}
				});

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
		let activeEntities = [];

		if (!this.props.browser.active || _.isEmpty(this.props.browser.active)) {
			activeEntities.push({ entityTypeId: id });
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
		}

		this.updateBrowser({
			active: activeEntities,
			selectedEntityType: id
		});
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
						"New Entity Type " + (this.props.allEntityTypes.length + 1)
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
						"New Entity Type " + (this.props.allEntityTypes.length + 1)
				},
				parentEntityTypes: parentEntityTypes
			},
			this.props.history,
			data => {}
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
								<button onClick={() => this.resetBrowser()}>
									Reset Browser
								</button>
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
				{this.renderBrowserContent()}
			</div>
		);
	}
}

const mapStateToProps = state => ({
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
