import { assign } from "lodash";
import * as _ from "lodash";

import {
	LOAD_YOUTUBE_VIDEO_DETAILS,
	LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_VIDEO
} from "../actions/types";

export const initialState = {
	singleVideo: {},
	isFetching: false,
	newVideo: true
};

export const youtubeVideoSearch = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_YOUTUBE_VIDEO_DETAILS:
			return assign({}, state, {
				isFetching: true
			});
		case LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS:
			return assign({}, state, {
				singleVideo: action.payload.videoDetails,
				isFetching: false,
				newVideo: action.payload.newVideo
			});
		case CLEAR_LOADED_VIDEO:
			return assign({}, state, { singleVideo: {}, isFetching: false });
		default:
			return state;
	}
};
