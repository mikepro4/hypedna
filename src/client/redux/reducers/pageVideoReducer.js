import { assign } from "lodash";

import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO
} from "../actions/types";

export const initialState = {
	videoDetails: {},
	isFetching: false
};

export const pageVideoReducer = (state = initialState, action) => {
	switch (action.type) {
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
			return assign({}, state, { videoDetails: {}, isFetching: false });
		default:
			return state;
	}
};
