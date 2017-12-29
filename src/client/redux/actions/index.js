import { FETCH_AUTH } from "./types";
import {
	LOAD_YOUTUBE_VIDEO_DETAILS,
	LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS
} from "./types";

export const fetchCurrentUser = () => async (dispatch, getState, api) => {
	const res = await api.get("/current_user");

	dispatch({
		type: FETCH_AUTH,
		payload: res
	});
};

export const loadYoutubeVideoDetails = (url, history) => async (
	dispatch,
	getState,
	api
) => {
	console.log("values ", url);
	console.log("history ", history);
	const res = await api.post("/youtube_video_details", {
		url: url
	});

	// history.push("/surveys");
	dispatch({
		type: LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
		payload: res.data.items[0]
	});
};
