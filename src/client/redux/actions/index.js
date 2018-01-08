import { FETCH_AUTH, CURRENT_VIDEO_UPDATE } from "./types";
import moment from "moment";

export const fetchCurrentUser = () => async (dispatch, getState, api) => {
	const res = await api.get("/current_user");

	dispatch({
		type: FETCH_AUTH,
		payload: res
	});
};

export const updateCurrentVideo = (id, action, seconds) => dispatch => {
	dispatch({
		type: CURRENT_VIDEO_UPDATE,
		payload: id,
		playerAction: action,
		seconds
	});
};
