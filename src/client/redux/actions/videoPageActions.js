import moment from "moment";
import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	CLEAR_LOADED_HYPEDNA_VIDEO,
	UPDATE_PLAYER_VIDEO_ID
} from "./types";

export const loadHypednaVideoDetails = googleId => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: LOAD_HYPEDNA_VIDEO_DETAILS
	});
	const response = await api.post("/hypedna_video_details", {
		googleId
	});
	dispatch({
		type: LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
		payload: response.data
	});
	// dispatch({
	// 	type: UPDATE_PLAYER_VIDEO_ID,
	// 	playingVideoId: response.data.videoDetails.googleId,
	// 	duration: moment
	// 		.duration(response.data.videoDetails.contentDetails.duration)
	// 		.asSeconds()
	// });
};

export const clearLoadedHypednaVideo = () => dispatch => {
	dispatch({
		type: CLEAR_LOADED_HYPEDNA_VIDEO
	});
};
