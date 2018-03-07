import { assign } from "lodash";
import update from "immutability-helper";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	isFetchingEntityTypes: false
};

export const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_ALL_ENTITY_TYPES:
			return assign({}, state, {
				isFetchingEntityTypes: true
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload,
				isFetchingEntityTypes: false
			});
		default:
			return state;
	}
};
