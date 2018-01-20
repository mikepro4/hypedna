import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import AddCircleIcon from "material-ui-icons/AddCircle";
import CloseIcon from "material-ui-icons/Close";
import classNames from "classnames";
import {
	addEntityType,
	updateBrowser,
	loadEntityTypeDetails
} from "../../../redux/actions/pageEntityTypeActions";
import qs from "qs";

class EntityTypeBrowser extends Component {
	componentDidMount = () => {
		if (!this.props.location.search) {
			this.props.history.push({
				search: "?initial=true"
			});
		} else {
			this.props.updateBrowser(
				qs.parse(this.props.location.search.substring(1))
			);

			let query = qs.parse(this.props.location.search.substring(1));

			if (query.selectedEntityType) {
				this.props.loadEntityTypeDetails(query.selectedEntityType);
			}
		}
	};

	componentDidUpdate = () => {
		// console.log(qs.parse(this.props.location.search.substring(1)));
		if (this.props.location.search) {
			if (!this.isEqualQueryString()) {
				this.props.updateBrowser(
					qs.parse(this.props.location.search.substring(1))
				);
			}

			let query = qs.parse(this.props.location.search.substring(1));

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
		}
	};

	isEqualQueryString = () => {
		if (this.props.location) {
			let newString = qs.parse(this.props.location.search.substring(1));
			let oldString = this.props.browser;
			return _.isEqual(newString, oldString);
		} else return false;
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

	updateQueryString = updatedState => {
		let newQueryString = qs.parse(this.props.location.search.substring(1));

		const updatedQuery = _.assign({}, newQueryString, updatedState);
		const str = qs.stringify(updatedQuery);
		this.props.history.push({
			search: "?" + str
		});
	};

	activateEntityType = id => {
		let newQueryString = qs.parse(this.props.location.search.substring(1));
		if (this.props.browser.active) {
			let filteredActive = _.filter(this.props.browser.active, entityType => {
				return entityType.id == id;
			});
			// console.log(filteredActive[0]);

			if (!filteredActive[0]) {
				this.activateFirstItem(id);
				this.props.loadEntityTypeDetails(id);
			} else {
				let positionOfElement = _.findIndex(this.props.browser.active, {
					id: filteredActive[0].id
				});
				const newActive = update(this.props.browser.active, {
					$splice: [[positionOfElement, 1]]
				});
				this.updateQueryString({ active: newActive, selectedEntityType: {} });
			}
		} else {
			this.activateFirstItem(id);
			this.props.loadEntityTypeDetails(id);
		}
	};

	activateFirstItem = id => {
		let newActive = [];

		newActive.push({
			id: id
		});

		let activeEntityTypes = _.assign({}, this.props.browser, {
			active: newActive,
			selectedEntityType: id
		});
		console.log("first add");
		this.updateQueryString(activeEntityTypes);
	};

	checkActive = id => {
		let filteredActive = _.filter(this.props.browser.active, entityType => {
			return entityType.id == id;
		});
		return filteredActive.length > 0;
	};

	renderSingleEntityTypeGroup = (entityTypes, isTopLevel) => {
		return (
			<div className="browser-single-group">
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

	renderTopLevelEntityType = () => {
		let topLevelEntities = _.filter(this.props.allEntityTypes, entityType => {
			return (entityType.genericProperties.topLevel = true);
		});
		return this.renderSingleEntityTypeGroup(topLevelEntities, true);
	};

	renderActiveEntityTypes = () => {
		// console.log(this.props.browser.active);

		if (this.props.browser.active) {
			let arrayLength = this.props.browser.active.length;

			let positionOfElement = _.findIndex(this.props.browser.active, {
				id: this.props.browser.active[arrayLength - 1].id
			});

			let lastEntityType = _.filter(this.props.allEntityTypes, entityType => {
				return entityType._id == this.props.browser.active[arrayLength - 1].id;
			});

			let ownAsParrent = _.filter(this.props.allEntityTypes, entityType => {
				if (this.props.allEntityTypes.parentEntityTypes) {
					let containsAsParent = _.includes(entityType.parentEntityTypes, {
						id: this.props.browser.active[arrayLength - 1].id
					});
				}
			});

			if (ownAsParrent > 0) {
				return <div>has children</div>;
			} else {
				return <div> no children</div>;
			}
		}
	};

	renderEntityTypeGroups = () => {
		return this.renderTopLevelEntityType();
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
							<li className="singleAction">
								<button>Some Action</button>
							</li>
							<li className="singleAction">
								<button>Some Action</button>
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
					{this.props.browser.initial == "true"
						? this.renderInitialState()
						: this.renderEntityTypeGroups()}

					{this.props.browser.initial == "true"
						? ""
						: this.renderActiveEntityTypes()}
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
