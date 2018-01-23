import { assign } from "lodash";

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
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	browser: {
		initial: "false",
		active: [],
		selectedEntityType: "",
		activeEntityTypeGroups: [],
		showNoChildren: "false"
	},
	editor: {},
	isFetchingEditor: false,
	isFetchingBrowser: false
};

export const pageEntityTypeReducer = (state = initialState, action) => {
	switch (action.type) {
		case RESET_BROWSER:
			return assign({}, state, initialState);
		case UPDATE_BROWSER:
			return assign({}, state, {
				browser: action.payload
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload
			});
		default:
			return state;
	}
};
