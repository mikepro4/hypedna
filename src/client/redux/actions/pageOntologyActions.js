import {
	SELECT_ENTITY_TYPE,
	UPDATE_TREE,
	UPDATE_TREE_SELECTION,
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SHOW_LINKER,
	HIDE_LINKER,
	SHOW_PROPERTY_CREATOR,
	HIDE_PROPERTY_CREATOR,
	CREATE_ENTITY,
	CREATE_ENTITY_SUCCESS,
	ENTITY_RESULTS_SEARCH,
	ENTITY_RESULTS_SEARCH_SUCCESS,
	ENTITY_RESULTS_SEARCH_LOAD_MORE
} from "./types";

import * as _ from "lodash";

/////////////////////////////////////////////////

export const searchEntityResults = (
	criteria,
	sortProperty,
	offset = 0,
	limit = 0,
	success
) => async (dispatch, getState, api) => {
	dispatch({
		type: ENTITY_RESULTS_SEARCH
	});

	const response = await api.post("/search/entity_results", {
		criteria,
		sortProperty,
		offset,
		limit
	});

	if (response.status === 200) {
		dispatch({
			type: ENTITY_RESULTS_SEARCH_SUCCESS,
			offset: response.data.offsset,
			limit: response.data.limit,
			all: response.data.all,
			count: response.data.count
		});

		if (success) {
			success();
		}
	}
};

/////////////////////////////////////////////////

export const searchEntities = (
	criteria,
	sortProperty,
	offset = 0,
	limit = 0,
	success
) => async (dispatch, getState, api) => {
	const response = await api.post("/search/entities", {
		criteria,
		sortProperty,
		offset,
		limit
	});

	if (success) {
		success(response.data);
	}
};

/////////////////////////////////////////////////

export const createEntity = (entityTypeId, properties, success) => async (
	dispatch,
	getState,
	api
) => {
	let associatedEntityTypes = [];
	associatedEntityTypes.push({
		entityTypeId: entityTypeId
	});

	console.log({
		associatedEntityTypes: associatedEntityTypes,
		properties: properties
	});
	const response = await api.post("/create_entity", {
		associatedEntityTypes: associatedEntityTypes,
		properties: properties
	});

	dispatch({
		type: CREATE_ENTITY
	});

	if (response.status === 200) {
		if (success) {
			success(response.data._id);
		}
		console.log("added custom property ");
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

export const addCustomProperty = (id, values, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/add_custom_property", {
		id: id,
		customProperty: values
	});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	if (response.status === 200) {
		dispatch(loadAllEntityTypes());

		if (success) {
			success();
		}
		console.log("added custom property ");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const updateCustomProperty = (id, propertyId, values, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/update_custom_property", {
		id: id,
		propertyId: propertyId,
		newValues: values
	});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	if (response.status === 200) {
		dispatch(loadAllEntityTypes());

		if (success) {
			success();
		}
		console.log("added custom property ");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const updateAllCustomProperties = (
	id,
	customProperties,
	success
) => async (dispatch, getState, api) => {
	const response = await api.post("/update_all_custom_properties", {
		id: id,
		customProperties: customProperties
	});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	if (response.status === 200) {
		dispatch(
			loadAllEntityTypes(() => {
				if (success) {
					success();
				}
			})
		);
		console.log("added custom property ");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

export const removeCustomProperty = (id, propertyId, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/remove_custom_property", {
		id,
		propertyId
	});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES
	});

	if (response.status === 200) {
		dispatch(loadAllEntityTypes());

		if (success) {
			success();
		}
		console.log("removed custom property");
	} else {
		console.log("error");
	}
};

/////////////////////////////////////////////////

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

export const showPropertyCreator = property => async dispatch => {
	dispatch({
		type: SHOW_PROPERTY_CREATOR,
		property
	});
};

/////////////////////////////////////////////////

export const hidePropertyCreator = () => async dispatch => {
	dispatch({
		type: HIDE_PROPERTY_CREATOR
	});
};

/////////////////////////////////////////////////

export const showLinker = (entityTypeId, linkIntent) => async dispatch => {
	dispatch({
		type: SHOW_LINKER,
		entityTypeId,
		linkIntent
	});
};

/////////////////////////////////////////////////

export const hideLinker = () => async dispatch => {
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
