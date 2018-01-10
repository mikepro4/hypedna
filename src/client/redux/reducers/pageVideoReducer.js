import { assign } from "lodash";

import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO,
	UPDATE_PAGE_VIDEO_HOVER_TIME
} from "../actions/types";

export const initialState = {
	singleVideo: {},
	hoverTime: null,
	isFetching: false
};

export const pageVideoReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_PAGE_VIDEO_HOVER_TIME:
			return assign({}, state, {
				hoverTime: action.hoverTime
			});
		case LOAD_HYPEDNA_VIDEO_DETAILS:
			return assign({}, state, {
				isFetching: true
			});
		case LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS:
			return assign({}, state, {
				singleVideo: action.payload,
				isFetching: false
			});
		case CLEAR_LOADED_HYPEDNA_VIDEO:
			return assign({}, state, { singleVideo: {}, isFetching: false });
		default:
			return state;
	}
};
