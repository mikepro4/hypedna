import moment from "moment";
import {
	LOAD_HYPEDNA_VIDEO_DETAILS,
	LOAD_HYPEDNA_VIDEO_DETAILS_SUCCESS,
	UPDATE_PAGE_VIDEO_HOVER_TIME,
	CLEAR_LOADED_HYPEDNA_VIDEO
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
};
export const clearLoadedHypednaVideo = () => dispatch => {
	dispatch({
		type: CLEAR_LOADED_HYPEDNA_VIDEO
	});
};

export const updateHoverTime = (hoverTime, startTime) => dispatch => {
	dispatch({
		type: UPDATE_PAGE_VIDEO_HOVER_TIME,
		hoverTime,
		startTime
	});
};
