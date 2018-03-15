import { assign } from "lodash";
import update from "immutability-helper";

import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO,
	UPDATE_PAGE_VIDEO_HOVER_TIME,
	UPDATE_LOADED_TRACK,
	DELETE_LOADED_TRACK,
	SELECT_CLIP,
	SEARCH_TRACKS,
	SEARCH_TRACKS_SUCCESS,
	CLEAR_SEARCH_TRACKS
} from "../actions/types";

export const initialState = {
	singleVideo: {},
	tracks: [],
	hoverTime: null,
	selectedClip: null,
	isFetching: false,
	isFetchingTracks: false
};

export const pageVideoReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_PAGE_VIDEO_HOVER_TIME:
			return assign({}, state, {
				hoverTime: action.hoverTime,
				startTime: action.startTime ? action.startTime : null
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
		case SEARCH_TRACKS:
			return assign({}, state, {
				isFetchingTracks: true
			});
		case SEARCH_TRACKS_SUCCESS:
			return assign({}, state, {
				tracks: action.payload.all,
				isFetchingTracks: false
			});
		case CLEAR_SEARCH_TRACKS:
			return assign({}, state, {
				tracks: [],
				isFetchingTracks: false
			});
		case UPDATE_LOADED_TRACK: {
			let tracktoUpdateIndex = _.findIndex(state.tracks, {
				_id: action.payload._id
			});
			return update(state, {
				tracks: { $splice: [[tracktoUpdateIndex, 1, action.payload]] }
			});
		}
		case DELETE_LOADED_TRACK: {
			let tracktoUpdateIndex = _.findIndex(state.tracks, {
				_id: action.payload
			});
			console.log(tracktoUpdateIndex);
			return update(state, {
				tracks: { $splice: [[tracktoUpdateIndex, 1]] }
			});
		}
		case SELECT_CLIP:
			return assign({}, state, {
				selectedClip: action.clip
			});
		case CLEAR_LOADED_HYPEDNA_VIDEO:
			return assign({}, state, { singleVideo: {}, isFetching: false });
		default:
			return state;
	}
};
