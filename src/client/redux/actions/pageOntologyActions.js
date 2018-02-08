import {
	SELECT_ENTITY_TYPE,
	UPDATE_TREE,
	UPDATE_TREE_SELECTION,
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SHOW_LINKER,
	HIDE_LINKER
} from "./types";

import * as _ from "lodash";

export const removeParentEntityType = (
	id,
	removeParentEntityTypeId,
	success
) => async (dispatch, getState, api) => {
	const response = await api.post("/remove_parent_entity_type", {
		id,
		removeParentEntityTypeId
	});
	if (response.status === 200) {
		if (success) {
			success();
		}
		console.log("deleted parent id");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const getEntityType = id => (dispatch, getState, api) => {
	let entityType = _.filter(
		getState().pageOntology.allEntityTypes,
		entityType => {
			return entityType._id == id;
		}
	);
	return entityType[0];
};

/////////////////////////////////////////////////

// can be removed

export const getOwnAsParent = id => (dispatch, getState, api) => {
	let ownAsParent = _.filter(
		getState().pageOntology.allEntityTypes,
		entityType => {
			if (entityType && entityType.parentEntityTypes) {
				let containsAsParent = _.filter(
					entityType.parentEntityTypes,
					parentEntityType => {
						return parentEntityType.entityTypeId == id;
					}
				);
				if (containsAsParent && containsAsParent.length > 0) {
					return true;
				}
			} else {
				return false;
			}
		}
	);
	return ownAsParent;
};

/////////////////////////////////////////////////

export const addParentEntityType = (
	id,
	newParentEntityTypeId,
	success
) => async (dispatch, getState, api) => {
	const response = await api.post("/add_parent_entity_type", {
		id,
		newParentEntityTypeId
	});
	if (response.status === 200) {
		if (success) {
			success();
		}
		console.log("added parent id");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const showLinker = (entityTypeId, linkIntent) => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: SHOW_LINKER,
		entityTypeId,
		linkIntent
	});
};

/////////////////////////////////////////////////

export const hideLinker = () => async (dispatch, getState, api) => {
	dispatch({
		type: HIDE_LINKER
	});
};

/////////////////////////////////////////////////

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

/////////////////////////////////////////////////

export const updateTree = nodes => async dispatch => {
	dispatch({
		type: UPDATE_TREE,
		payload: nodes
	});
};

/////////////////////////////////////////////////

export const updateTreeSelection = (expanded, selected) => async dispatch => {
	dispatch({
		type: UPDATE_TREE_SELECTION,
		expanded,
		selected
	});
};

/////////////////////////////////////////////////

export const loadAllEntityTypes = (success, selectId) => async (
	dispatch,
	getState,
	api
) => {
	console.log("load all entity types");

	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	const response = await api.post("/load_all_entity_types", {});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES_SUCCESS,
		payload: response.data
	});

	if (success) {
		success(response.data);
	}

	if (selectId) {
		selectId();
	}
};

/////////////////////////////////////////////////

export const updateEntityType = (id, newEntityType, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/entity_type_update", {
		id,
		newEntityType
	});
	if (response.status == 200) {
		const entityType = await api.post("/get_single_entity_type", {
			id
		});
		if (success) {
			success(entityType.data);
		}
		console.log("updated entity type");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const deleteEntityType = id => async (dispatch, getState, api) => {
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	api
		.post("/entity_type_delete", { id: id })
		.then(response => {
			dispatch(loadAllEntityTypes());
			if (success) {
				success(response.data);
			}
		})
		.catch(() => {});
};

/////////////////////////////////////////////////

export const addEntityType = (entityType, success) => async (
	dispatch,
	getState,
	api
) => {
	console.log("add entity type");

	api
		.post("/entity_type_add", entityType)
		.then(response => {
			dispatch(
				loadAllEntityTypes(null, () => {
					if (success) {
						success(response.data);
					}
				})
			);
		})
		.catch(() => {});
};
