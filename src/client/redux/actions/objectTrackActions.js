import {
	SEARCH_TRACKS,
	SEARCH_TRACKS_SUCCESS,
	CLEAR_SEARCH_TRACKS,
	UPDATE_LOADED_TRACK,
	DELETE_LOADED_TRACK,
	SELECT_CLIP
} from "./types";

import update from "immutability-helper";
import * as _ from "lodash";

// =============================================================================

export const searchTracks = (
	criteria,
	sortProperty,
	offset = 0,
	limit = 0,
	success
) => async (dispatch, getState, api) => {
	dispatch({
		type: SEARCH_TRACKS
	});
	const response = await api.post("/tracks/search", {
		criteria,
		sortProperty,
		offset,
		limit
	});
	dispatch({
		type: SEARCH_TRACKS_SUCCESS,
		payload: response.data
	});
	if (response.data && success) {
		success();
	}
};

// =============================================================================

export const addTrack = (track, success) => async (dispatch, getState, api) => {
	const response = await api.post("/tracks/add", { track: track });
	if (success) {
		success(response.data);
	}
};

// =============================================================================

export const updateTrack = (trackId, newTrack, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/tracks/update", {
		trackId,
		newTrack
	});
	if (success) {
		success(response.data);
	}
};

// =============================================================================

export const updateTrackClips = (trackId, clips, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/tracks/update_clips", {
		trackId,
		clips
	});
	if (success) {
		success(response.data);
	}
};

export const optimisticTrackUpdate = track => dispatch => {
	dispatch({
		type: UPDATE_LOADED_TRACK,
		payload: track
	});
};

export const optimisticTrackDelete = trackId => dispatch => {
	dispatch({
		type: DELETE_LOADED_TRACK,
		payload: trackId
	});
};

// =============================================================================

export const deleteTrack = (trackId, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/tracks/delete", { trackId });
	if (success) {
		success(response.data);
	}
};

export const deleteClip = selectedClip => async (dispatch, getState, api) => {
	let trackId;

	let filteredTracks = _.filter(getState().pageVideo.tracks, track => {
		let filteredClips = _.filter(track.clips, clip => {
			return selectedClip._id === clip._id;
		});
		return filteredClips.length > 0;
	});
	let filteredTrack = filteredTracks[0];
	if (filteredTrack) {
		trackId = filteredTrack._id;
	}

	let cliptoUpdateIndex = _.findIndex(filteredTrack.clips, {
		_id: selectedClip._id
	});

	let newClipsArray = update(filteredTrack.clips, {
		$splice: [[cliptoUpdateIndex, 1]]
	});

	let updatedTrack = _.assign({}, filteredTrack, { clips: newClipsArray });

	dispatch(optimisticTrackUpdate(updatedTrack));
	dispatch(
		updateTrackClips(trackId, newClipsArray, () => {
			console.log("deleted clip");
		})
	);
};

// =============================================================================

export const selectClip = clip => dispatch => {
	dispatch({
		type: SELECT_CLIP,
		clip
	});
};

// =============================================================================

export const clearLoadedTracks = () => dispatch => {
	dispatch({
		type: CLEAR_SEARCH_TRACKS
	});
};
