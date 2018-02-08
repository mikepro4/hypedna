import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import * as objTraverse from "obj-traverse/lib/obj-traverse";

import { Dialog, Button, Intent, ButtonGroup } from "@blueprintjs/core";

import { updateQueryString } from "../../../redux/actions/";
import {
	hideLinker,
	addParentEntityType,
	loadAllEntityTypes
} from "../../../redux/actions/pageOntologyActions";

import OntologySelector from "./OntologySelector";

class OntologyLinker extends Component {
	state = {
		linkToEntity: null,
		entityToLink: null,
		linkIntent: null,
		edited: false
	};

	componentDidUpdate = (prevProps, prevState) => {
		// populate intent
		if (prevProps.linkIntent !== this.props.linkIntent && !this.state.edited) {
			this.setState({
				linkIntent: this.props.linkIntent
			});
		}

		// populate entity
		if (
			prevProps.linkToEntity !== this.props.linkToEntity &&
			!this.state.edited
		) {
			this.setState({
				linkToEntity: this.props.linkToEntity
			});
		}
	};

	onSourceSelectorChange = id => {
		this.setState({
			linkToEntity: id,
			edited: true
		});
	};

	onTargetSelectorChange = id => {
		this.setState({
			entityToLink: id,
			edited: true
		});
	};

	setIntent = value => {
		this.setState({
			linkIntent: value,
			edited: true
		});
	};

	onClose = () => {
		this.setState({
			linkToEntity: null,
			entityToLink: null,
			linkIntent: null,
			edited: false
		});
		this.props.hideLinker();
	};

	checkIfContains = (id, entityTypeId) => {
		let containsInParents;
		let containsInChildren;

		if (this.getEntityType(entityTypeId).parentEntityTypes) {
			let containsSameParent = _.filter(
				this.getEntityType(entityTypeId).parentEntityTypes,
				entityType => {
					return entityType.entityTypeId == id;
				}
			);
			containsInParents = _.isEmpty(containsSameParent);
		} else {
			containsInParents = true;
		}

		if (this.getEntityType(entityTypeId).childEntityTypes) {
			let containsSameChild = _.filter(
				this.getEntityType(entityTypeId).childEntityTypes,
				entityType => {
					return entityType.entityTypeId == id;
				}
			);
			containsInChildren = _.isEmpty(containsSameChild);
		} else {
			containsInChildren = true;
		}

		return containsInParents && containsInChildren;
	};

	getEntityType = id => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return entityType[0];
	};

	createLink = () => {
		if (this.state.linkIntent == "add_parent") {
			if (
				this.checkIfContains(this.state.entityToLink, this.state.linkToEntity)
			) {
				this.props.addParentEntityType(
					this.state.linkToEntity,
					this.state.entityToLink,
					() => {
						this.props.loadAllEntityTypes();
						this.onClose();
					}
				);
			} else {
				alert("already linked");
			}
		} else if (this.state.linkIntent == "add_child") {
			if (
				this.checkIfContains(this.state.linkToEntity, this.state.entityToLink)
			) {
				this.props.addParentEntityType(
					this.state.entityToLink,
					this.state.linkToEntity,
					() => {
						this.props.loadAllEntityTypes();
						this.onClose();
					}
				);
			} else {
				alert("already linked");
			}
		}
	};

	render() {
		return (
			<div>
				<Dialog
					iconName="link"
					isOpen={this.props.linkerOpen}
					onClose={this.onClose}
					title="Link New Entity Type"
					className="entity-type-linker"
				>
					<div className="pt-dialog-body" className="linker-dialog">
						<div className="dialog-header">
							<span className="pt-icon-large pt-icon-link" />
							<h1>New Link Between Entity Types</h1>
						</div>

						<div className="dialog-content">
							<ul className="dialog-form">
								<li className="dialog-form-row">
									<div className="dialog-input-label">Source Entity Type:</div>
									<div className="dialog-input-container">
										<OntologySelector
											onChange={this.onSourceSelectorChange}
											initialState={this.props.linkToEntity}
										/>
									</div>
								</li>

								<li className="dialog-form-row">
									<div className="dialog-input-label">Link Type:</div>
									<div className="dialog-input-container">
										<ButtonGroup>
											<Button
												iconName="log-in"
												className={classNames({
													"pt-active": this.state.linkIntent == "add_parent"
												})}
												onClick={() => this.setIntent("add_parent")}
											>
												Parent
											</Button>
											<Button
												iconName="log-out"
												className={classNames({
													"pt-active": this.state.linkIntent == "add_child"
												})}
												onClick={() => this.setIntent("add_child")}
											>
												Child
											</Button>
										</ButtonGroup>
									</div>
								</li>

								<li className="dialog-form-row">
									<div className="dialog-input-label">Entity Type To Link:</div>
									<div className="dialog-input-container">
										<OntologySelector
											onChange={this.onTargetSelectorChange}
											filter={
												this.state.edited
													? this.state.linkToEntity
													: this.props.linkToEntity
											}
										/>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div className="pt-dialog-footer">
						<div className="pt-dialog-footer-actions">
							<Button text="Cancel" onClick={this.onClose} />
							<Button
								intent={Intent.SUCCESS}
								onClick={this.createLink}
								text="Create Relation"
							/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	allEntityTypes: state.pageOntology.allEntityTypes,
	linkToEntity: state.pageOntology.linkToEntity,
	linkerOpen: state.pageOntology.linkerOpen,
	linkIntent: state.pageOntology.linkIntent
});

export default withRouter(
	connect(mapStateToProps, {
		hideLinker,
		addParentEntityType,
		loadAllEntityTypes
	})(OntologyLinker)
);
