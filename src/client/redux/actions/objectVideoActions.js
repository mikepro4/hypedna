import moment from "moment";
import {
	DELETE_VIDEO,
	DELETE_VIDEO_SUCCESS,
	UPDATE_VIDEO_TRACK
} from "./types";
import { loadHypednaVideoDetails } from "./pageVideoActions";

export const deleteVideo = (googleId, success) => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: DELETE_VIDEO,
		payload: googleId
	});
	const response = await api.post("/video_delete", {
		googleId
	});
	dispatch({
		type: DELETE_VIDEO_SUCCESS,
		payload: response.data
	});

	success(response.data);
};

export const clearLoadedHypednaVideo = () => dispatch => {
	dispatch({
		type: CLEAR_LOADED_HYPEDNA_VIDEO
	});
};

// track actions
export const addTrack = (googleId, track) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/video_track_add", {
		googleId,
		track
	});
	if (response.status === 200) {
		dispatch(loadHypednaVideoDetails(googleId));
		console.log("updated video");
	} else {
		console.log("error");
	}
};

export const deleteTrack = (googleId, trackId) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/video_track_delete", {
		googleId,
		trackId
	});
	if (response.status === 200) {
		dispatch(loadHypednaVideoDetails(googleId));
		console.log("updated video");
	} else {
		console.log("error");
	}
};

export const updateTrack = (googleId, trackId, newTrack) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/video_track_update", {
		googleId,
		trackId,
		newTrack
	});
	if (response.status === 200) {
		const track = await api.post("/get_single_video_track", {
			googleId,
			trackId
		});
		dispatch({
			type: UPDATE_VIDEO_TRACK,
			payload: track.data
		});
		console.log("updated video");
	} else {
		console.log("error");
	}
};

export const updateTrackClips = (googleId, trackId, clips) => async (
	dispatch,
	getState,
	api
) => {
	// console.log(clips);
	const response = await api.post("/video_track_clips_update", {
		googleId,
		trackId,
		clips
	});
	if (response.status === 200) {
		const track = await api.post("/get_single_video_track", {
			googleId,
			trackId
		});
		dispatch({
			type: UPDATE_VIDEO_TRACK,
			payload: track.data
		});
		console.log("updated trackid: ", trackId);
	} else {
		console.log("error");
	}
};

export const optimisticTrackUpdate = track => dispatch => {
	dispatch({
		type: UPDATE_VIDEO_TRACK,
		payload: track
	});
};
