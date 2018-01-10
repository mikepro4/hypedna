import { assign } from "lodash";
import {
	UPDATE_STATUS,
	UPDATE_TIME,
	UPDATE_PLAYER_VIDEO_ID,
	RESET_VIDEO,
	SEEK_TO_TIME
} from "../actions/types";

const initialPlayerState = {
	duration: 0,
	currentTime: 0
};

export default (state = initialPlayerState, action) => {
	switch (action.type) {
		case UPDATE_TIME:
			return assign({}, state, {
				duration: action.duration || 0,
				currentTime: action.currentTime || 0
			});
		case UPDATE_STATUS:
			return assign({}, state, {
				status: action.status
			});

		case SEEK_TO_TIME:
			return assign({}, state, {
				seekToTime: action.seconds,
				status: "seek"
			});

		case RESET_VIDEO:
			return initialPlayerState;
		default:
			return state;
	}
};
