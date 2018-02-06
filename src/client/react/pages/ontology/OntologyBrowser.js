import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

import {
	Button,
	Classes,
	Intent,
	AnchorButton,
	Icon,
	ITreeNode,
	Tooltip,
	Tree
} from "@blueprintjs/core";

import { updateQueryString } from "../../../redux/actions/";
import { selectEntityType } from "../../../redux/actions/pageOntologyActions";

import OntologySelector from "./OntologySelector";

class OntologyBrowser extends Component {
	state = {
		nodes: []
	};

	componentDidMount = () => {
		this.computeTree();

		if (this.props.location.search) {
			let queryParams = this.getQueryParams();
			this.updateSelectedEntityType(queryParams.selectedEntityTypeId);
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			!_.isEqual(
				prevProps.pageEntityType.allEntityTypes.sort(),
				this.props.allEntityTypes.sort()
			)
		) {
			this.computeTree();
		}
		//
		// if (prevProps.selectedEntityTypeId !== this.props.selectedEntityTypeId) {
		// 	this.computeTree();
		// }
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	computeTree = () => {
		let rootLevelEntities = _.filter(this.props.allEntityTypes, entity => {
			return entity.parentEntityTypes.length == 0;
		});

		let sortedEntities = _.orderBy(
			rootLevelEntities,
			[entity => entity.genericProperties.displayName.toLowerCase()],
			["asc"]
		);

		let nodes = _.map(sortedEntities, entity => {
			return this.generateNode(entity);
		});

		this.setState({ nodes: nodes });
	};

	generateNode = entity => {
		let entityChildren = [];
		if (entity.childEntityTypes) {
			entityChildren = entity.childEntityTypes;
		}
		const childNodes = entityChildren.map(entityChild => {
			let child = this.getEntityType(entityChild.entityTypeId);
			if (!_.isEmpty(child)) {
				return this.generateNode(child);
			}
		});

		return {
			childNodes,
			hasCaret: entityChildren.length > 0,
			id: entity._id,
			iconName: entityChildren.length > 0 ? "folder-close" : "document",
			label: (
				<div>
					{entity.genericProperties.displayName} ({
						entity.childEntityTypes.length
					})
				</div>
			),
			secondaryLabel: "Actions"
		};
	};

	getEntityType = id => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == id;
		});
		return entityType[0];
	};

	handleNodeClick = (nodeData, _nodePath, e) => {
		const originallySelected = nodeData.isSelected;
		if (!e.shiftKey) {
			this.forEachNode(this.state.nodes, n => (n.isSelected = false));
		}
		nodeData.isSelected = true;
		nodeData.isExpanded = true;

		this.setState(this.state);
		this.updateSelectedEntityType(nodeData.id);
	};

	handleNodeCollapse = nodeData => {
		nodeData.isExpanded = false;
		this.setState(this.state);
	};

	handleNodeExpand = nodeData => {
		nodeData.isExpanded = true;
		this.setState(this.state);
	};

	forEachNode = (nodes, callback) => {
		if (nodes == null) {
			return;
		}

		for (const node of nodes) {
			callback(node);
			this.forEachNode(node.childNodes, callback);
		}
	};

	onSelectorChange = value => {
		if (!_.isEmpty(value)) {
			console.log("set custom value to: ", value);
			this.updateSelectedEntityType(value);
			this.forEachNode(this.state.nodes, n => (n.isSelected = false));
			this.setState(this.state);
		} else {
			console.log("clear");
		}
	};

	updateSelectedEntityType = value => {
		this.props.selectEntityType(value);
		this.props.updateQueryString(
			{ selectedEntityTypeId: value },
			this.props.location,
			this.props.history
		);
	};

	render() {
		return (
			<div className="ontology-browser-content">
				<div className="browser-header">
					<h1 className="section-title">Ontology Manager</h1>
					<div className="browser-reset">
						<Button
							className={Classes.MINIMAL}
							text="Reset"
							onClick={() => this.computeTree()}
						/>
					</div>
				</div>

				<div className="browser-actions">
					<div className="browser-search-form">
						<OntologySelector onChange={this.onSelectorChange} />
					</div>
					<Button iconName="add" text="New" intent={Intent.SUCCESS} />
				</div>

				<div className="browser-tree">
					<Tree
						contents={this.state.nodes}
						onNodeClick={this.handleNodeClick}
						onNodeCollapse={this.handleNodeCollapse}
						onNodeExpand={this.handleNodeExpand}
						className={Classes.ELEVATION_0}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	pageEntityType: state.pageEntityType,
	allEntityTypes: state.pageEntityType.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withRouter(
	connect(mapStateToProps, { selectEntityType, updateQueryString })(
		OntologyBrowser
	)
);
