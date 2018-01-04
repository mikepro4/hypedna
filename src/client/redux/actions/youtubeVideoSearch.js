import moment from "moment";
import {
	LOAD_YOUTUBE_VIDEO_DETAILS,
	LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
	UPDATE_PLAYER_VIDEO_ID,
	CLEAR_LOADED_VIDEO
} from "./types";

export const loadYoutubeVideoDetails = googleId => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: LOAD_YOUTUBE_VIDEO_DETAILS
	});
	const response = await api.post("/youtube_video_details", {
		googleId
	});
	dispatch({
		type: LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
		payload: response.data
	});
	dispatch({
		type: UPDATE_PLAYER_VIDEO_ID,
		playingVideoId: response.data.videoDetails.googleId,
		duration: moment
			.duration(response.data.videoDetails.contentDetails.duration)
			.asSeconds()
	});
};

export const clearLoadedYoutubeVideo = () => dispatch => {
	dispatch({
		type: CLEAR_LOADED_VIDEO
	});
};

export const addYoutubeVideo = (video, history, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/youtube_video_add", {
		googleId: video.googleId,
		snippet: video.snippet,
		contentDetails: video.contentDetails
	});
	handleAddedVideo(response, history, success);
};

function handleAddedVideo(response, history, success) {
	history.push(`/video/${response.data.googleId}`);
	success();
}
