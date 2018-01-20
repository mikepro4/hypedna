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
	RESET_BROWSER
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

export const updateEntityType = () => async (dispatch, getState, api) => {
	console.log("update entity type");
};

export const addEntityType = (entityType, history, success) => async (
	dispatch,
	getState,
	api
) => {
	console.log("add entity type");

	const response = await api.post("/entity_type_add", entityType);
	handleEntityTypeAdded(response, history, success);
	dispatch(loadAllEntityTypes(response));
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

export const resetBrowser = () => async (dispatch, getState, api) => {
	dispatch({
		type: RESET_BROWSER
	});
};
