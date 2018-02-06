import {
	SELECT_ENTITY_TYPE,
	UPDATE_TREE,
	UPDATE_TREE_SELECTION
} from "./types";

export const selectEntityType = entityTypeId => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: SELECT_ENTITY_TYPE,
		entityTypeId
	});
};

export const updateTree = nodes => async dispatch => {
	dispatch({
		type: UPDATE_TREE,
		payload: nodes
	});
};

export const updateTreeSelection = (expanded, selected) => async dispatch => {
	dispatch({
		type: UPDATE_TREE_SELECTION,
		expanded,
		selected
	});
};
