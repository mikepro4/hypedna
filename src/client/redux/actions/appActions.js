import * as _ from "lodash";
import axios from "axios";
import { reset, submit } from "redux-form";
import update from "immutability-helper";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	LOAD_USER_INFO
} from "./types";

/////////////////////////////////////////////////

export const getChildEntityType = entityType => dispatch => {
	let children = [];

	const getChildren = processingEntityType => {
		let childrenEntityTypes = [];
		if (processingEntityType.childEntityTypes) {
			childrenEntityTypes = processingEntityType.childEntityTypes;
		}

		if (childrenEntityTypes) {
			const childNodes = childrenEntityTypes.map(entityChild => {
				let child = dispatch(getEntityType(entityChild.entityTypeId));
				children = update(children, { $push: [child] });
				if (!_.isEmpty(child)) {
					return getChildren(child);
				}
			});
		}
	};
	getChildren(entityType);
	return children;
};

/////////////////////////////////////////////////

export const resetForm = formName => dispatch => {
	dispatch(reset(formName));
};

export const submitForm = formName => dispatch => {
	dispatch(submit(formName));
};

/////////////////////////////////////////////////

export const getUserInfo = (id, success) => async (dispatch, getState, api) => {
	const response = await api.post("/get_user", { id });

	dispatch({
		type: LOAD_USER_INFO,
		payload: response.data
	});

	if (success) {
		success(response.data);
	}
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
