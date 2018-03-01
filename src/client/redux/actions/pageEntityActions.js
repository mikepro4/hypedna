import * as _ from "lodash";
import axios from "axios";
import { reset, submit } from "redux-form";

import {
	LOAD_ENTITY_DETAILS,
	LOAD_ENTITY_DETAILS_SUCCESS,
	LOAD_ALL_ENTITY_TYPES_SUCCESS
} from "./types";

/////////////////////////////////////////////////

export const validateUrlName = (values, dispatch, props, field) => {
	if (props.entity.properties.entityUrlName == values.entityUrlName) {
		return Promise.resolve();
	} else {
		return axios
			.post("/api/validate_entity_url_name", {
				entityUrlName: values.entityUrlName
			})
			.then(response => {
				if (response.status === 200) {
				}
			})
			.catch(error => {
				throw { entityUrlName: "Already Exists" };
			});
	}
};

/////////////////////////////////////////////////

export const updateEntity = (id, newEntity, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/entity_update", {
		id,
		newEntity
	});
	if (response.data) {
		dispatch({
			type: LOAD_ENTITY_DETAILS_SUCCESS,
			payload: response.data
		});
		if (success) {
			success();
		}
	}
};

/////////////////////////////////////////////////

export const loadEntityDetails = entityUrlName => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: LOAD_ENTITY_DETAILS
	});

	const response1 = await api.post("/entity_load", {
		entityUrlName
	});

	const response2 = await api.post("/load_all_entity_types");

	if (response1.data && response2.data) {
		dispatch({
			type: LOAD_ENTITY_DETAILS_SUCCESS,
			payload: response1.data
		});

		dispatch({
			type: LOAD_ALL_ENTITY_TYPES_SUCCESS,
			payload: response2.data
		});
	}
};

/////////////////////////////////////////////////
