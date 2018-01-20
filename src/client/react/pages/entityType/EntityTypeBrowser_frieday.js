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
	resetBrowser
} from "../../../redux/actions/pageEntityTypeActions";

import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";

import EntityTypeBrowserGroup from "./EntityTypeBrowserGroup";

class EntityTypeBrowser extends Component {
	componentWillMount = () => {
		this.props.resetBrowser();
	};

	componentDidMount = () => {
		if (!this.props.location.search) {
			this.resetBrowser();
			this.computeGroups(this.getQueryParams().activeEntityTypeGroups);
		} else {
			this.initialBrowserUpdate();
			this.computeGroups(this.getQueryParams().activeEntityTypeGroups);
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

	// componentWillUpdate = () => {
	// 	if (!this.isEqualQueryString()) {
	// 		this.computeGroups();
	// 	}
	// };

	resetBrowser = () => {
		this.updateQueryString({
			initial: "true",
			activeEntityTypeGroups: []
		});
	};

	loadLastActiveEntityType = () => {};

	updateQueryString = updatedState => {
		let queryParams = this.getQueryParams();
		const updatedQuery = _.assign({}, queryParams, updatedState);
		const str = qs.stringify(updatedQuery);
		this.props.history.push({
			search: "?" + str
		});
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
		// this.computeGroups();
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
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
	};

	createEntyTypeGroup = (entities, topLevel) => {
		let entityTypeGroup = {
			entityTypes: entities,
			topLevel: topLevel,
			activeEventTypeId: ""
		};

		return entityTypeGroup;
	};

	activeEntityType = (id, group, position) => {
		let newGroup;
		if (group.activeEventTypeId == id) {
			newGroup = _.assign({}, group, { activeEventTypeId: "" });
			let newGroupsArray = update(this.props.browser.activeEntityTypeGroups, {
				$splice: [[position, 1, newGroup]]
			});

			let testArray;

			if (position == 0) {
				testArray = newGroupsArray.slice(0, -(newGroupsArray.length - 1));
			} else {
				testArray = newGroupsArray.slice(
					0,
					-(newGroupsArray.length - position)
				);
			}

			console.log("position: ", position);
			console.log(newGroupsArray.length - position);

			this.updateQueryString({
				activeEntityTypeGroups: testArray
			});
			this.computeGroups(testArray);
		} else {
			newGroup = _.assign({}, group, { activeEventTypeId: id });
			this.updateGroups(newGroup, position);
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

	computeGroups = newGroupsArray => {
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

		// let activeGroups = [];
		//
		let newTypes = _.forEach(allActive, activeEntityType => {
			// console.log(activeEntityType);
			let ownAsParent = _.filter(this.props.allEntityTypes, entityType => {
				if (entityType.parentEntityTypes) {
					let containsAsParent = _.filter(
						entityType.parentEntityTypes,
						parentEntityType => {
							return parentEntityType.entityTypeId == activeEntityType.id;
						}
					);
					return containsAsParent.length > 0;
				} else {
					return false;
				}
			});

			if (ownAsParent.length > 0) {
				let newGroup = this.createEntyTypeGroup(ownAsParent);
				let newArray = update(newGroupsArray, { $push: [newGroup] });
				this.updateQueryString({
					activeEntityTypeGroups: newArray
				});
			} else {
				console.log("no children");
			}
		});
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
									activeEntityType={this.activeEntityType}
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
	})(EntityTypeBrowser)
);
