import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";
import * as objTraverse from "obj-traverse/lib/obj-traverse";

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
import {
	selectEntityType,
	updateTree,
	updateTreeSelection
} from "../../../redux/actions/pageOntologyActions";

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
		if (prevProps.selectedEntityTypeId !== this.props.selectedEntityTypeId) {
			this.computeTree();
		}
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	updateTreeState = () => {
		let expanded = objTraverse.findAll(
			{ childNodes: this.state.nodes },
			"childNodes",
			{
				isExpanded: true
			}
		);

		let selected = objTraverse.findAll(
			{ childNodes: this.state.nodes },
			"childNodes",
			{
				isSelected: true
			}
		);

		this.props.updateTreeSelection(expanded, selected);

		// this.props.updateQueryString(
		// 	this.getExpandedSelectedIds(expanded, selected),
		// 	this.props.location,
		// 	this.props.history
		// );
	};

	getExpandedSelectedIds = (expanded, selected) => {
		let expandedIds = _.map(expanded, item => {
			id: item.id;
		});

		let selectedIds = _.map(selected, item => {
			id: item.id;
		});

		return { expandedNodes: expandedIds, selectedNodes: selectedIds };
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

		this.props.updateTree(nodes);

		this.setState({ nodes: nodes });
	};

	checkExpanded = id => {
		let expanded = _.filter(this.props.expandedNodes, expanded => {
			return expanded.id == id;
		});

		if (expanded[0]) {
			return true;
		} else {
			return false;
		}
	};

	checkSelected = id => {
		let selected = _.filter(this.props.selectedNodes, selected => {
			return selected.id == id;
		});

		if (selected[0] || this.props.selectedEntityTypeId == id) {
			return true;
		} else {
			return false;
		}
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
			isExpanded: this.checkExpanded(entity._id),
			isSelected: this.checkSelected(entity._id),
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
		if (!this.checkSelected(nodeData.id)) {
			if (!e.shiftKey) {
				this.forEachNode(this.state.nodes, n => (n.isSelected = false));
			}
			nodeData.isSelected = true;
			nodeData.isExpanded = true;

			this.setState(this.state);
			this.updateSelectedEntityType(nodeData.id);
			this.updateTreeState();
		}
	};

	handleNodeCollapse = nodeData => {
		nodeData.isExpanded = false;
		this.setState(this.state);
		this.updateTreeState();
	};

	handleNodeExpand = nodeData => {
		nodeData.isExpanded = true;
		this.setState(this.state);
		this.updateTreeState();
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
		let node = objTraverse.findAll(
			{ childNodes: this.state.nodes },
			"childNodes",
			{
				id: value
			}
		);
		this.props.updateTreeSelection(this.props.expandedNodes, node);
		// this.props.updateQueryString(
		// 	this.getExpandedSelectedIds(this.props.expandedNodes, node),
		// 	this.props.location,
		// 	this.props.history
		// );
		if (!_.isEmpty(value)) {
			console.log("set custom value to: ", value);
			this.updateSelectedEntityType(value);
			this.computeTree();
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
						contents={this.props.tree}
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
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	tree: state.pageOntology.tree,
	expandedNodes: state.pageOntology.expandedNodes,
	selectedNodes: state.pageOntology.selectedNodes
});

export default withRouter(
	connect(mapStateToProps, {
		selectEntityType,
		updateQueryString,
		updateTree,
		updateTreeSelection
	})(OntologyBrowser)
);
