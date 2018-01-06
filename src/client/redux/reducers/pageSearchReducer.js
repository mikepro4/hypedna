import { assign } from "lodash";

import {
	LOAD_SEARCH_VIDEO,
	LOAD_SEARCH_VIDEO_SUCCESS,
	CLEAR_SEARCH_VIDEO
} from "../actions/types";

export const initialState = {
	searchResults: {},
	isFetching: false
};

export const pageSearchReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_SEARCH_VIDEO:
			return assign({}, state, {
				isFetching: true
			});
		case LOAD_SEARCH_VIDEO_SUCCESS:
			return assign({}, state, {
				searchResults: action.payload,
				isFetching: false
			});
		case CLEAR_SEARCH_VIDEO:
			return assign({}, state, { searchResults: {}, isFetching: false });
		default:
			return state;
	}
};
