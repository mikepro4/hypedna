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
		let activeGroups = this.getQueryParams().activeEntityTypeGroups;

		if (!this.props.location.search) {
			this.resetBrowser();
		} else {
			this.initialBrowserUpdate();
		}
		this.computeGroups(activeGroups);
	};

	componentDidUpdate = () => {
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
	};

	createEntyTypeGroup = (entities, topLevel, parentId) => {
		let entityTypeGroup = {
			entityTypes: entities,
			topLevel: topLevel,
			activeEventTypeId: "",
			parentId: ""
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

	updateGroup = (newGroup, position) => {
		let newGroupsArray = update(this.props.browser.activeEntityTypeGroups, {
			$splice: [[position, 1, newGroup]]
		});

		this.updateQueryString({
			activeEntityTypeGroups: newGroupsArray
		});

		this.computeGroups(newGroupsArray);
	};

	toggleEntityType = (id, group, position) => {
		console.log("toggle entity type");
	};

	computeGroups = activeGroups => {
		console.log("active groups");
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
