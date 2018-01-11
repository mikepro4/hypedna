import { assign } from "lodash";
import update from "immutability-helper";

import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO,
	UPDATE_PAGE_VIDEO_HOVER_TIME,
	UPDATE_VIDEO_TRACK
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
		case UPDATE_VIDEO_TRACK: {
			let tracktoUpdateIndex = _.findIndex(state.singleVideo.tracks, {
				_id: action.payload._id
			});
			return update(state, {
				singleVideo: {
					tracks: { $splice: [[tracktoUpdateIndex, 1, action.payload]] }
				}
			});
		}
		case CLEAR_LOADED_HYPEDNA_VIDEO:
			return assign({}, state, { singleVideo: {}, isFetching: false });
		default:
			return state;
	}
};
