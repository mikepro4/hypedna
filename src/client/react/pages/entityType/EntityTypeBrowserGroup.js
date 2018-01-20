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

class EntityTypeBrowserGroup extends Component {
	resetBrowser = () => {
		console.log("reset");
	};

	checkActive = id => {
		return this.props.group.activeEventTypeId == id;
	};

	toggleEntityType = id => {
		// console.log("activate");
		this.props.toggleEntityType(id, this.props.group, this.props.position);
	};

	addEntityType = () => {
		console.log("add entity type");
	};

	render() {
		return (
			<div className="browser-single-group">
				<div className="single-group-header">
					<div className="header-left">
						<div className="header-count">
							{this.props.group.entityTypes.length}
						</div>
						<div className="header-count-label">
							<span className="entity-type-level">
								{this.props.group.isTopLevel ? "Top Level" : "Sub Types of"}
							</span>
							<span className="entity-type-reference">Entity Types</span>
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
					{this.props.group.entityTypes.length > 0
						? this.props.group.entityTypes.map(entityType => {
								return (
									<div
										className={classNames({
											"single-group-result": true,
											selected: this.checkActive(entityType._id)
										})}
										onClick={() => {
											this.toggleEntityType(entityType._id);
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
