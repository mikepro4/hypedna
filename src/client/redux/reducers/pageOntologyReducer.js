import { assign } from "lodash";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SELECT_ENTITY_TYPE
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	selectedEntityTypeId: null,
	isFetchingEntityTypes: false
};

export const pageOntologyReducer = (state = initialState, action) => {
	switch (action.type) {
		case SELECT_ENTITY_TYPE:
			return assign({}, state, {
				selectedEntityTypeId: action.entityTypeId
			});
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
