import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";
import * as objTraverse from "obj-traverse/lib/obj-traverse";

import {
	ContextMenu,
	Menu,
	MenuDivider,
	MenuItem,
	Popover,
	PopoverInteractionKind,
	Button,
	Classes,
	Intent,
	Icon,
	ITreeNode,
	Tooltip,
	Tree
} from "@blueprintjs/core";

import { updateQueryString } from "../../../redux/actions/";

import {
	addEntityType,
	updateTree,
	updateTreeSelection,
	showLinker,
	deleteEntityType
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
			this.props.updateSelectedEntityType(queryParams.selectedEntityTypeId);
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
	};

	getExpandedSelectedIds = (expanded, selected) => {
		let expandedIds = _.map(expanded, item => {
			return { id: item.id };
		});

		let selectedIds = _.map(selected, item => {
			return { id: item.id };
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

	resetTree = () => {
		this.props.updateSelectedEntityType("");
		this.props.updateTreeSelection([{}], [{}]);
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
			secondaryLabel: (
				<Popover
					content={this.renderMenu(entity)}
					interactionKind={PopoverInteractionKind.CLICK}
					className="au-no-expand"
				>
					<span className="pt-icon pt-icon-more au-no-expand" />
				</Popover>
			)
		};
	};

	deleteEntity = id => {
		this.props.deleteEntityType(id);
		this.props.updateSelectedEntityType("");
	};

	renderMenu = entityType => {
		return (
			<Menu>
				<MenuItem
					iconName="pt-icon-plus"
					key="0"
					onClick={() => console.log(entityType)}
					text="Create New Entity"
				/>
				<MenuDivider key="divider-1" />
				<MenuItem
					iconName="pt-icon-log-in"
					key="1"
					onClick={() => this.props.showLinker(entityType._id, "add_parent")}
					text="Add Parent Entity Type"
				/>
				<MenuItem
					iconName="pt-icon-log-out"
					key="2"
					onClick={() => this.props.showLinker(entityType._id, "add_child")}
					text="Add Child Entity Type"
				/>
				<MenuDivider key="divider-2" />
				<MenuItem
					iconName="pt-icon-trash"
					key="3"
					onClick={() => this.deleteEntity(entityType._id)}
					text="Delete Entity Type"
				/>
			</Menu>
		);
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
			this.props.updateSelectedEntityType(nodeData.id);
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

		if (!_.isEmpty(value)) {
			console.log("set custom value to: ", value);
			this.props.updateSelectedEntityType(value);
			this.computeTree();
		} else {
			console.log("clear");
		}
	};

	createNewEntityType = () => {
		this.props.addEntityType(
			{
				genericProperties: {
					displayName:
						"New Entity Type " + (this.props.allEntityTypes.length + 1),
					createdAt: Date.now(),
					createdBy: this.props.auth._id
				},
				parentEntityTypes: [],
				childEntityTypes: []
			},
			data => {
				console.log("added");
				this.props.updateTreeSelection(this.props.expandedNodes, [{}]);
				this.props.updateSelectedEntityType(data._id);
			}
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
							onClick={() => this.resetTree()}
						/>
					</div>
				</div>

				<div className="browser-actions">
					<div className="browser-search-form">
						<OntologySelector onChange={this.onSelectorChange} />
					</div>
					<Button
						iconName="add"
						text="New"
						onClick={() => this.createNewEntityType()}
						intent={Intent.PRIMARY}
					/>
				</div>

				<div className="browser-tree">
					<Tree
						contents={this.props.tree}
						onNodeClick={this.handleNodeClick}
						onNodeCollapse={this.handleNodeCollapse}
						onNodeExpand={this.handleNodeExpand}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	pageEntityType: state.pageEntityType,
	allEntityTypes: state.pageEntityType.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	tree: state.pageOntology.tree,
	expandedNodes: state.pageOntology.expandedNodes,
	selectedNodes: state.pageOntology.selectedNodes
});

export default withRouter(
	connect(mapStateToProps, {
		updateTree,
		updateTreeSelection,
		addEntityType,
		updateQueryString,
		showLinker,
		deleteEntityType
	})(OntologyBrowser)
);
