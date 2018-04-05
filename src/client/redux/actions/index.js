import { FETCH_AUTH, CURRENT_VIDEO_UPDATE, RESET_INITIAL } from "./types";
import moment from "moment";
import * as _ from "lodash";
import qs from "qs";

export const fetchCurrentUser = () => async (dispatch, getState, api) => {
	const res = await api.get("/current_user");

	dispatch({
		type: FETCH_AUTH,
		payload: res
	});
};

export const updateCurrentVideo = (id, action, initial) => dispatch => {
	dispatch({
		type: CURRENT_VIDEO_UPDATE,
		payload: id,
		playerAction: action,
		initial: initial
	});
};

export const resetInitial = () => dispatch => {
	dispatch({
		type: RESET_INITIAL,
		initial: false
	});
};

export const updateQueryString = (
	updatedState,
	location,
	history
) => dispatch => {
	let queryParams = qs.parse(location.search.substring(1));
	const updatedQuery = _.assign({}, queryParams, updatedState);
	const str = qs.stringify(updatedQuery);
	history.push({
		search: "?" + str
	});
};
