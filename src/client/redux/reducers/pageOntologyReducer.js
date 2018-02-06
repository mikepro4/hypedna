import { assign } from "lodash";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SELECT_ENTITY_TYPE,
	UPDATE_TREE,
	UPDATE_TREE_SELECTION
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	tree: [],
	expandedNodes: [],
	selectedNodes: [],
	selectedEntityTypeId: null,
	isFetchingEntityTypes: false
};

export const pageOntologyReducer = (state = initialState, action) => {
	switch (action.type) {
		case SELECT_ENTITY_TYPE:
			return assign({}, state, {
				selectedEntityTypeId: action.entityTypeId
			});
		case LOAD_ALL_ENTITY_TYPES:
			return assign({}, state, {
				isFetchingEntityTypes: true
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload,
				isFetchingEntityTypes: false
			});
		case UPDATE_TREE:
			return assign({}, state, {
				tree: action.payload
			});

		case UPDATE_TREE_SELECTION:
			return assign({}, state, {
				expandedNodes: action.expanded,
				selectedNodes: action.selected
			});
		default:
			return state;
	}
};
