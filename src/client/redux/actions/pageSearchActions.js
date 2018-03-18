import {
	LOAD_SEARCH_VIDEO,
	LOAD_SEARCH_VIDEO_SUCCESS,
	CLEAR_SEARCH_VIDEO
} from "./types";

export const searchVideos = (
	criteria,
	sortProperty,
	offset = 0,
	limit = 1000
) => async (dispatch, getState, api) => {
	dispatch({
		type: LOAD_SEARCH_VIDEO
	});
	const response = await api.post("/search/videos", {
		criteria,
		sortProperty,
		offset,
		limit
	});
	dispatch({
		type: LOAD_SEARCH_VIDEO_SUCCESS,
		payload: response.data
	});
};

export const clearLoadedSearchResults = () => dispatch => {
	dispatch({
		type: CLEAR_SEARCH_VIDEO
	});
};
