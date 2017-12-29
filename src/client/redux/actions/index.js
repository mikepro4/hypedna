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

export function loadYoutubeVideoDetails(url) {
	return (dispatch, getState, api) => {
		dispatch({
			type: LOAD_YOUTUBE_VIDEO_DETAILS
		});
		return api
			.post("/youtube_video_details", {
				url: url
			})
			.then(response => {
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
			})
			.catch(error => console.log(error));
	};
}

export function addYoutubeVideo(url) {
	return (dispatch, getState, api) => {
		return api
			.post("/youtube_video_add", {
				url: url
			})
			.then(response => {
				console.log("added video");
			})
			.catch(error => console.log(error));
	};
}

// export const loadYoutubeVideoDetails = (url, history) => (
// 	dispatch,
// 	getState,
// 	api
// ) => {
// 	dispatch({
// 		type: LOAD_YOUTUBE_VIDEO_DETAILS
// 	});
// 	try {
// 		return api
// 			.post("/youtube_video_details", {
// 				url: url
// 			})
// 			.then(response => {
// 				dispatch({
// 					type: LOAD_YOUTUBE_VIDEO_DETAILS_SUCCESS,
// 					payload: response.data.items[0]
// 				});
// 			})
// 			.catch(error => console.log(error));
// 	} catch (err) {
// 		console.log("Error", err);
// 	}
// };
