import { FETCH_AUTH } from "./types";
import { updatePlayerVideo } from "./player";
import moment from "moment";
import {
	LOAD_YOUTUBE_VIDEO_DETAILS,
	LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
	UPDATE_PLAYER_VIDEO_ID
} from "./types";

export const fetchCurrentUser = () => async (dispatch, getState, api) => {
	const res = await api.get("/current_user");

	dispatch({
		type: FETCH_AUTH,
		payload: res
	});
};

export const loadYoutubeVideoDetails = url => async (
	dispatch,
	getState,
	api
) => {
	dispatch({
		type: LOAD_YOUTUBE_VIDEO_DETAILS
	});
	const response = await api.post("/youtube_video_details", {
		url: url
	});
	dispatch({
		type: LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
		payload: response.data.items[0]
	});
	dispatch({
		type: UPDATE_PLAYER_VIDEO_ID,
		playingVideoId: response.data.items[0].id,
		duration: moment
			.duration(response.data.items[0].contentDetails.duration)
			.asSeconds()
	});
};

export const addYoutubeVideo = (url, history, success) => async (
	dispatch,
	getState,
	api
) => {
	const response = await api.post("/youtube_video_add", {
		url: url
	});
	handleAddedVideo(response, history, success);
};

function handleAddedVideo(response, history, success) {
	history.push(`/video/${response.data.videoId}`);
	success();
}
