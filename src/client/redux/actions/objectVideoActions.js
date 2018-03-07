import moment from "moment";
import {
	DELETE_VIDEO,
	DELETE_VIDEO_SUCCESS,
	UPDATE_VIDEO_TRACK,
	SELECT_CLIP
} from "./types";
import { loadHypednaVideoDetails } from "./pageVideoActions";
import update from "immutability-helper";
import * as _ from "lodash";

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

export const updateTrack = (googleId, trackId, newTrack, success) => async (
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

		if (success) {
			success();
		}
		console.log("updated video");
	} else {
		console.log("error");
	}
};

export const updateTrackClips = (googleId, trackId, clips, success) => async (
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
		success(track.data, { test: "test" });
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

export const selectClip = clip => dispatch => {
	dispatch({
		type: SELECT_CLIP,
		clip
	});
};

export const deleteClip = selectedClip => async (dispatch, getState, api) => {
	let trackId;
	let video = getState().pageVideo.singleVideo;
	let googleId = video.googleId;

	let filteredTracks = _.filter(video.tracks, track => {
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
		updateTrackClips(googleId, trackId, newClipsArray, () => {
			console.log("deleted clip");
		})
	);
};
