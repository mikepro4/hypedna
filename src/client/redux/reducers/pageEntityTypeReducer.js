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
	RESET_BROWSER,
	UPDATE_BROWSER_GROUPS,
	RESET_BROWSER_GROUPS
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	activeEntityTypeGroups: [],
	browser: {
		initial: "false",
		active: [],
		selectedEntityType: "",
		loadedTopLevel: "false",
		loadedCustom: "false",
		loadedCustomId: ""
	},
	editor: {},
	isFetchingEditor: false,
	isFetchingBrowser: false
};

export const pageEntityTypeReducer = (state = initialState, action) => {
	switch (action.type) {
		case RESET_BROWSER:
			return assign({}, state, {
				activeEntityTypeGroups: [],
				browser: initialState.browser
			});
		case UPDATE_BROWSER:
			let newBrowser = _.assign({}, state.browser, action.payload);
			return assign({}, state, {
				browser: newBrowser
			});
		case UPDATE_BROWSER_GROUPS:
			return assign({}, state, {
				activeEntityTypeGroups: action.payload
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload
			});
		default:
			return state;
	}
};
