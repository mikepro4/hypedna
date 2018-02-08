import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";

import ParentIcon from "../../components/icons/ParentIcon";
import ChildrenIcon from "../../components/icons/ChildrenIcon";

import {
	showLinker,
	loadAllEntityTypes,
	getEntityType,
	removeParentEntityType
} from "../../../redux/actions/pageOntologyActions";

class OntologyEditorRelations extends Component {
	state = {};

	removeParentEntityType = id => {
		this.props.removeParentEntityType(
			this.props.selectedEntityTypeId,
			id,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	removeParentEntityTypeFromChild = id => {
		this.props.removeParentEntityType(
			id,
			this.props.selectedEntityTypeId,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	removeLink = (id, relationType) => {
		if (relationType == "parent") {
			this.removeParentEntityType(id);
		} else if (relationType == "child") {
			this.removeParentEntityTypeFromChild(id);
		}
	};

	renderLinkedEntityTypes = (collection, relationType) => {
		let parentEntities = [];

		_.forEach(collection, parentEntityType => {
			if (!_.isEmpty(parentEntityType)) {
				parentEntities.push(
					this.props.getEntityType(parentEntityType.entityTypeId)
				);
			}
		});

		let sortedEntities = _.orderBy(
			parentEntities,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);

		return (
			<ul className="related-entity-types-list">
				{sortedEntities && sortedEntities.length > 0 ? (
					sortedEntities.map(entityType => {
						return (
							<li key={entityType._id}>
								<a
									className="anchor-button"
									onClick={() => this.removeLink(entityType._id, relationType)}
								>
									<span className="pt-icon-standard pt-icon-remove" />
								</a>
								<span className="entity-type">
									{entityType.genericProperties.displayName}
								</span>
							</li>
						);
					})
				) : (
					<div className="no-results">No linked entity types.</div>
				)}
			</ul>
		);
	};

	renderChildren = () => {};

	render() {
		let parents = this.props.getEntityType(this.props.selectedEntityTypeId)
			.parentEntityTypes;

		let children = this.props.getEntityType(this.props.selectedEntityTypeId)
			.childEntityTypes;

		return (
			<div className="ontology-editor-relations">
				<div className="relations-section">
					<div className="relations-section-header">
						<div className="header-left">
							<ParentIcon />
							<h1>{parents.length} Parents</h1>
						</div>
						<div className="header-right">
							<a
								className="anchor-button"
								onClick={() =>
									this.props.showLinker(
										this.props.selectedEntityTypeId,
										"add_parent"
									)
								}
							>
								<span className="pt-icon-standard pt-icon-add" />New Link
							</a>
						</div>
					</div>

					<div className="relations-section-content">
						{this.renderLinkedEntityTypes(parents, "parent")}
					</div>
				</div>

				<div className="relations-section">
					<div className="relations-section-header">
						<div className="header-left">
							<ChildrenIcon />
							<h1>{children.length} Children</h1>
						</div>
						<div className="header-right">
							<a
								className="anchor-button"
								onClick={() =>
									this.props.showLinker(
										this.props.selectedEntityTypeId,
										"add_child"
									)
								}
							>
								<span className="pt-icon-standard pt-icon-add" />New Link
							</a>
						</div>
					</div>

					<div className="relations-section-content">
						{this.renderLinkedEntityTypes(children, "child")}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withRouter(
	connect(mapStateToProps, {
		showLinker,
		loadAllEntityTypes,
		getEntityType,
		removeParentEntityType
	})(OntologyEditorRelations)
);
