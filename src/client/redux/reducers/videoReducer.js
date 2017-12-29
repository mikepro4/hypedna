import { FETCH_AUTH } from "../actions/types";
import * as _ from "lodash";

import {
	LOAD_YOUTUBE_VIDEO_DETAILS,
	LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS
} from "../actions/types";

export const initialState = {
	items: [],
	singleVideo: {}
};

export const videoReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS:
			return {
				...state,
				singleVideo: action.payload
			};
		default:
			return state;
	}
};
