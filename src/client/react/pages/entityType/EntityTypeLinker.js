import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import classNames from "classnames";
import qs from "qs";
import Popover from "material-ui/Popover";
import AddCircleIcon from "material-ui-icons/AddCircle";
import { withStyles } from "material-ui/styles";

import EntityTypeSelector from "./EntityTypeSelector";
import EntityTypeLinkerForm from "./EntityTypeLinkerForm";

import Button from "../../components/common/button/Button";

import {
	addEntityType,
	addParentEntityType,
	loadAllEntityTypes
} from "../../../redux/actions/pageEntityTypeActions";

const styles = theme => ({
	paper: {
		"overflow-x": "visible",
		"overflow-y": "visible"
	}
});

class EntityTypeLinker extends Component {
	state = {
		linkerOpen: false
	};

	handleLinkerOpen = event => {
		this.setState({ linkerOpen: true, anchorEl: event.currentTarget });
	};

	handleLinkerClose = () => {
		this.setState({ linkerOpen: false });
	};

	getEntityType = id => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return entityType[0];
	};

	createNewEntityType = values => {
		this.handleLinkerClose();
		if (this.props.intent == "addParent") {
		} else {
			let parentEntityTypes = [];
			if (this.props.idToLink) {
				parentEntityTypes.push({
					entityTypeId: this.props.idToLink
				});
			} else {
				parentEntityTypes.push({
					entityTypeId: this.props.browser.selectedEntityType
				});
			}

			this.callCreate(values.displayName, parentEntityTypes);
		}
	};

	callCreate = (name, parentEntityTypes) => {
		this.props.addEntityType(
			{
				genericProperties: {
					displayName: name,
					createdAt: Date.now(),
					createdBy: this.props.auth._id
				},
				parentEntityTypes: parentEntityTypes
			},
			this.props.history,
			data => {
				console.log("added");
				if (this.props.toggleEntityType) {
					this.props.toggleEntityType(data._id);
				}
			}
		);
	};

	updateEntityType = id => {
		this.handleLinkerClose();

		if (this.props.intent == "addParent") {
			console.log("update selected entity type");

			if (this.checkIfContains(id, this.props.browser.selectedEntityType)) {
				this.props.addParentEntityType(
					this.props.browser.selectedEntityType,
					id,
					() => {
						this.props.loadAllEntityTypes();
						if (this.props.toggleEntityType) {
							this.props.toggleEntityType(
								this.props.browser.selectedEntityType
							);
						}
					}
				);
			} else {
				alert("parent already added");
			}
		} else if (this.props.intent == "addChild") {
			console.log("update other entity type");

			if (this.props.idToLink) {
				if (this.checkIfContains(id, this.props.idToLink)) {
					this.props.addParentEntityType(id, this.props.idToLink, () => {
						this.props.loadAllEntityTypes();
						if (this.props.toggleEntityType) {
							this.props.toggleEntityType(id);
						}
					});
				} else {
					alert("child already added");
				}
			} else {
				if (this.checkIfContains(this.props.browser.selectedEntityType, id)) {
					this.props.addParentEntityType(
						id,
						this.props.browser.selectedEntityType,
						() => {
							this.props.loadAllEntityTypes();
							if (this.props.toggleEntityType) {
								this.props.toggleEntityType(id);
							}
						}
					);
				} else {
					alert("child already added");
				}
			}
		}
	};

	checkIfContains = (id, entityTypeId) => {
		let containsSameParent = _.filter(
			this.getEntityType(entityTypeId).parentEntityTypes,
			entityType => {
				return entityType.entityTypeId == id;
			}
		);
		return _.isEmpty(containsSameParent);
	};

	getIntentMessage = () => {
		switch (this.props.intent) {
			case "addParent":
				return "adding parent";
			case "addChild":
				return "adding child";
			default:
				return;
		}
	};

	render() {
		const { intent } = this.props;

		return (
			<div className="entity-type-linker">
				<Button onClick={event => this.handleLinkerOpen(event)} buttonIcon>
					<AddCircleIcon />
				</Button>

				<Popover
					open={this.state.linkerOpen}
					anchorEl={this.state.anchorEl}
					onClose={this.handleLinkerClose}
					classes={{ paper: this.props.classes.paper }}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
				>
					<div className="linker-intent-message">{this.getIntentMessage()}</div>

					<div className="select-exisiting-type">
						<h2>Select Existing Entity Type:</h2>
						<EntityTypeSelector onChange={this.updateEntityType} />
					</div>

					{this.props.intent != "addParent" ? (
						<div className="create-new-type">
							<h2>Create New Entity Type:</h2>
							<EntityTypeLinkerForm
								onSubmit={this.createNewEntityType.bind(this)}
								enableReinitialize="true"
							/>
						</div>
					) : (
						""
					)}
				</Popover>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	form: state.form,
	browser: state.pageEntityType.browser,
	allEntityTypes: state.pageEntityType.allEntityTypes
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			addParentEntityType,
			loadAllEntityTypes,
			addEntityType
		})(EntityTypeLinker)
	)
);
