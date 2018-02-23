import { assign, merge, difference, findIndex } from "lodash";
import update from "immutability-helper";

import {
	LOAD_ENTITY_DETAILS,
	LOAD_ENTITY_DETAILS_SUCCESS
} from "../actions/types";

export const initialState = {
	isFetchingEntityPage: false,
	entity: null
};

export const pageEntityReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_ENTITY_DETAILS:
			return assign({}, state, {
				isFetchingEntityPage: true
			});
		case LOAD_ENTITY_DETAILS_SUCCESS:
			return assign({}, state, {
				entity: action.payload,
				isFetchingEntityPage: false
			});
		default:
			return state;
	}
};
