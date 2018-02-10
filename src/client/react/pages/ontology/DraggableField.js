import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import { findDOMNode } from "react-dom";

import { DragSource, DropTarget } from "react-dnd";

const fieldSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		};
	}
};

const fieldTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY / 5) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY * 2) {
			return;
		}

		props.moveField(dragIndex, hoverIndex);

		monitor.getItem().index = hoverIndex;
	}
};

@DropTarget("field", fieldTarget, connect => ({
	connectDropTarget: connect.dropTarget()
}))
@DragSource("field", fieldSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	connectDragPreview: connect.dragPreview()
}))
class DraggableField extends Component {
	render() {
		return this.props.connectDragPreview(
			this.props.connectDragSource(
				this.props.connectDropTarget(
					<div
						onDragStart={e => {
							this.props.dragStart();
						}}
						onDragEnd={e => {
							this.props.dragEnd();
						}}
					>
						{this.props.children}
					</div>
				)
			)
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(DraggableField));
