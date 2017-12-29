import { assign } from "lodash";
import {
	UPDATE_STATUS,
	UPDATE_TIME,
	UPDATE_PLAYER_VIDEO_ID,
	RESET_VIDEO,
	SEEK_TO_TIME
} from "../actions/types";

const initialPlayerState = {
	playingVideoId: null,
	duration: 0,
	currentTime: 0,
	status: "stopped"
};

export default (state = initialPlayerState, action) => {
	switch (action.type) {
		case UPDATE_TIME:
			return assign({}, state, {
				currentTime: action.currentTime || 0
			});

		case UPDATE_PLAYER_VIDEO_ID:
			console.log("update reducer");
			return assign({}, state, {
				playingVideoId: action.playingVideoId,
				duration: action.duration,
				currentTime: 0,
				status: "stopped"
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
