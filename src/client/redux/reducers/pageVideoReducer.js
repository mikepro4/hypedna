import { assign } from "lodash";
import update from "immutability-helper";

import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO,
	UPDATE_PAGE_VIDEO_HOVER_TIME,
	UPDATE_VIDEO_TRACK,
	SELECT_CLIP,
	RESET_EDITOR,
	UPDATE_EDITOR
} from "../actions/types";

const initialEditorState = {
	movedClip: false,
	startedDrawing: false,
	startedEditing: false,
	startedEditingLeft: false,
	startedEditingRight: false,
	startedMoving: false,
	startPercent: 0,
	endPercent: 0,
	ghostWidth: 0,
	ghostDirection: null,
	ghostEndPosition: 0,
	updatedClips: [],
	updatedSingleClip: {},
	editingTrack: null,
	editingTimeline: null
};

export const initialState = {
	singleVideo: {},
	hoverTime: null,
	selectedClip: null,
	isFetching: false,
	editor: initialEditorState
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
		case SELECT_CLIP:
			return assign({}, state, {
				selectedClip: action.clip
			});
		case RESET_EDITOR:
			return assign({}, state, {
				editor: initialEditorState
			});
		case UPDATE_EDITOR:
			let editorObj = assign({}, state.editor, action.editor);
			return assign({}, state, {
				editor: editorObj
			});
		default:
			return state;
	}
};
