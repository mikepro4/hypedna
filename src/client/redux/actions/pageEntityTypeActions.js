import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SEARCH_ENTITY_TYPES,
	SEARCH_ENTITY_TYPES_SUCCESS,
	UPDATE_ENTITY_TYPE,
	UPDATE_ENTITY_TYPE_SUCCESS,
	DELETE_ENTITY_TYPE,
	DELETE_ENTITY_TYPE_SUCCESS,
	LOAD_ENTITY_TYPE_DETAILS,
	LOAD_ENTITY_TYPE_DETAILS_SUCCESS,
	RESET_ENTITY_TYPE_SEARCH,
	UPDATE_BROWSER,
	UPDATE_BROWSER_GROUPS,
	RESET_BROWSER,
	RESET_BROWSER_GROUPS
} from "./types";

export const loadAllEntityTypes = success => async (
	dispatch,
	getState,
	api
) => {
	console.log("load all entity types");

	const response = await api.post("/load_all_entity_types", {});
	dispatch({
		type: LOAD_ALL_ENTITY_TYPES_SUCCESS,
		payload: response.data
	});

	if (success) {
		success(response.data);
	}
};

export const searchEntityTypes = () => async (dispatch, getState, api) => {
	console.log("search entity types");
};

export const updateEntityType = (id, newEntityType, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/entity_type_update", {
		id,
		newEntityType
	});
	if (response.status === 200) {
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

export const addEntityType = (entityType, history, success) => async (
	dispatch,
	getState,
	api
) => {
	console.log("add entity type");

	// const response = await api.post("/entity_type_add", entityType);

	api
		.post("/entity_type_add", entityType)
		.then(response => {
			dispatch(loadAllEntityTypes());
			if (success) {
				success(response.data);
			}
			// handleEntityTypeAdded(response, history, success);
		})
		.catch(() => {});
};

function handleEntityTypeAdded(response, history, success) {
	// history.push(`/video/${response.data.googleId}`);
	console.log(response);
	if (success) {
		success();
	}
}

export const deleteEntityType = () => async (dispatch, getState, api) => {
	console.log("add entity type");
};

export const loadEntityTypeDetails = id => async (dispatch, getState, api) => {
	console.log("load entity type deatils: ", id);
};

export const resetEntityTypesSearch = () => dispatch => {
	console.log("clear entity types search");
};

export const updateBrowser = browser => async (dispatch, getState, api) => {
	console.log("update browser:", browser);
	dispatch({
		type: UPDATE_BROWSER,
		payload: browser
	});
};

export const updateBrowserGroups = groups => async (
	dispatch,
	getState,
	api
) => {
	console.log("update groups:", groups);
	dispatch({
		type: UPDATE_BROWSER_GROUPS,
		payload: groups
	});
};

export const resetBrowser = () => async (dispatch, getState, api) => {
	dispatch({
		type: RESET_BROWSER
	});
};
