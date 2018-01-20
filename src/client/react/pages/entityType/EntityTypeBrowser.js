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
	loadEntityTypeDetails,
	loadAllEntityTypes,
	resetBrowser
} from "../../../redux/actions/pageEntityTypeActions";

import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";

import EntityTypeBrowserGroup from "./EntityTypeBrowserGroup";

class EntityTypeBrowser extends Component {
	componentWillMount = () => {
		this.props.resetBrowser();
		this.props.loadAllEntityTypes(() => {
			this.computeGroups();
		});
	};

	componentDidMount = () => {
		let activeGroups = this.getQueryParams().activeEntityTypeGroups;

		if (!this.props.location.search) {
			this.resetBrowser();
		} else {
			this.initialBrowserUpdate();
		}
		this.computeGroups(activeGroups);
	};

	componentDidUpdate = (prevState, newState) => {
		if (this.props.location.search) {
			if (!this.isEqualQueryString()) {
				this.props.updateBrowser(this.getQueryParams());
			}
		}
	};

	resetBrowser = () => {
		this.updateQueryString({
			initial: "true",
			activeEntityTypeGroups: []
		});
	};

	initialBrowserUpdate = () => {
		this.props.updateBrowser(this.getQueryParams());

		// load entity type if in the url
		let selectedEntityType = this.getQueryParams().selectedEntityType;
		if (selectedEntityType) {
			this.props.loadEntityTypeDetails(selectedEntityType);
		}
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	isEqualQueryString = () => {
		if (this.props.location) {
			let newString = this.getQueryParams();
			let oldString = this.props.browser;
			return _.isEqual(newString, oldString);
		} else return false;
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

	loadTopLevelEntities = () => {
		let activeGroups = [];

		let topLevelEntities = _.filter(this.props.allEntityTypes, entityType => {
			return entityType.genericProperties.topLevel == true;
		});

		activeGroups.push(this.createEntyTypeGroup(topLevelEntities, true));

		this.updateQueryString({
			initial: "false",
			activeEntityTypeGroups: activeGroups
		});

		this.computeGroups(activeGroups);
	};

	createEntyTypeGroup = (entities, topLevel, parentId) => {
		let entityTypeGroup = {
			entityTypes: entities,
			topLevel: topLevel,
			activeEventTypeId: "",
			parentId: parentId
		};

		return entityTypeGroup;
	};

	renderBrowserContent = () => {
		let activeGroups = this.props.browser.activeEntityTypeGroups;

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
									group={group}
									position={i}
									key={i}
								/>
							);
						})}
					</div>
				);
			}
		}
	};

	updateGroups = (newGroup, position) => {
		let newGroupsArray = update(this.props.browser.activeEntityTypeGroups, {
			$splice: [[position, 1, newGroup]]
		});

		this.updateQueryString({
			activeEntityTypeGroups: newGroupsArray
		});

		this.computeGroups(newGroupsArray);
	};

	sliceGroups = (newGroup, position) => {
		let newGroupsArray = update(this.props.browser.activeEntityTypeGroups, {
			$splice: [[position, 1, newGroup]]
		});

		let slicedGroupArray;

		// slice array elemnents if other groups are open
		if (newGroupsArray && newGroupsArray.length > 1) {
			if (position == 0) {
				slicedGroupArray = newGroupsArray.slice(
					0,
					-(newGroupsArray.length - 1)
				);
			} else {
				slicedGroupArray = newGroupsArray.slice(
					0,
					-(newGroupsArray.length - position)
				);
			}
		} else {
			slicedGroupArray = newGroupsArray;
		}

		this.updateQueryString({
			activeEntityTypeGroups: slicedGroupArray
		});
		this.computeGroups(slicedGroupArray);
	};

	getEntityTypeDetails = id => {
		let filteredEntityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return filteredEntityType[0];
	};

	toggleEntityType = (id, group, position) => {
		console.log("toggle entity type");

		let newGroup;
		if (group.activeEventTypeId == id) {
			newGroup = _.assign({}, group, { activeEventTypeId: "" });
			this.sliceGroups(newGroup, position);
		} else {
			newGroup = _.assign({}, group, { activeEventTypeId: id });
			this.updateGroups(newGroup, position);
		}
	};

	computeGroups = newGroupsArray => {
		console.log("computeGroups");

		if (!newGroupsArray) {
			newGroupsArray = this.getQueryParams().activeEntityTypeGroups;
		}

		let allActive;

		let filteredArray = _.filter(newGroupsArray, group => {
			return !_.isEmpty(group.activeEventTypeId);
		});

		if (filteredArray && filteredArray.length > 0) {
			allActive = _.map(filteredArray, group => {
				return { id: group.activeEventTypeId };
			});
		} else {
			allActive = [];
		}
		console.log("allActive: ", allActive);

		let activeGroups = [];

		let topLevelGroup = _.filter(newGroupsArray, group => {
			return group.topLevel == "true";
		});

		activeGroups.push(topLevelGroup[0]);

		// if (
		// 	this.props.browser.activeEntityTypeGroups &&
		// 	this.props.browser.activeEntityTypeGroups.length > 0
		// ) {
		// 	console.log(this.props.browser.activeEntityTypeGroups);
		// 	activeGroups = update(activeGroups, {
		// 		$push: newGroupsArray
		// 	});
		// }

		_.forEach(allActive, activeEntityType => {
			// console.log(activeEntityType);
			let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
				if (entityType.parentEntityTypes) {
					let containsAsParent = _.filter(
						entityType.parentEntityTypes,
						parentEntityType => {
							return parentEntityType.entityTypeId == activeEntityType.id;
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
				// console.log("ownAsParent: ", ownAsParent);
				let newGroup = this.createEntyTypeGroup(
					ownAsParent,
					false,
					activeEntityType.id
				);

				console.log("allActive: ", allActive);

				let addedSameId = _.filter(newGroupsArray, group => {
					return group.parentId == newGroup.parentId;
				});

				if (addedSameId && addedSameId.length > 0) {
				} else {
					activeGroups = update(newGroupsArray, {
						$push: [newGroup]
					});

					console.log("activeGroups: ", activeGroups);

					let newArr = _.filter(activeGroups, group => {
						if (group.parentId) {
							let containsActiveId = _.filter(allActive, active => {
								return group.parentId == active.id;
							});
							return containsActiveId.length > 0;
						} else {
							if (group.topLevel == "true") {
								return true;
							} else {
								return false;
							}
						}
					});

					console.log("newArr: ", newArr);

					this.updateQueryString({
						activeEntityTypeGroups: newArr
					});
				}
			} else {
				console.log("no children");
				let newArr = _.filter(newGroupsArray, group => {
					if (group.parentId) {
						let containsActiveId = _.filter(allActive, active => {
							return group.parentId == active.id;
						});
						return containsActiveId.length > 0;
					} else {
						if (group.topLevel == "true") {
							return true;
						} else {
							return false;
						}
					}
				});

				console.log("newArr: ", newArr);

				this.updateQueryString({
					activeEntityTypeGroups: newArr
				});
			}
		});
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
		loadEntityTypeDetails,
		resetBrowser,
		loadAllEntityTypes
	})(EntityTypeBrowser)
);
