import * as _ from "lodash";
import axios from "axios";
import { reset, submit } from "redux-form";

import { LOAD_ALL_ENTITY_TYPES, LOAD_ALL_ENTITY_TYPES_SUCCESS } from "./types";

/////////////////////////////////////////////////

export const resetForm = formName => dispatch => {
	dispatch(reset(formName));
};

export const submitForm = formName => dispatch => {
	dispatch(submit(formName));
};

/////////////////////////////////////////////////

export const loadAllEntityTypes = success => async (
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
};

/////////////////////////////////////////////////

export const getEntityType = id => (dispatch, getState, api) => {
	let entityType = _.filter(getState().app.allEntityTypes, entityType => {
		return entityType._id == id;
	});
	return entityType[0];
};

/////////////////////////////////////////////////
