import { assign } from "lodash";
import {
	UPDATE_STATUS,
	UPDATE_TIME,
	UPDATE_PLAYER_VIDEO_ID,
	RESET_VIDEO,
	SEEK_TO_TIME,
	UPDATE_PLAYLIST,
	CURRENT_VIDEO_UPDATE,
	UPDATE_CURRENT_TIME,
	RESET_INITIAL
} from "../actions/types";

const initialPlayerState = {
	duration: 0,
	currentTime: 0,
	status: null,
	seekToTime: null,
	initial: false,
	currentVideo: {
		videoId: null,
		playerAction: null,
		seconds: null
	},
	playlist: {
		current: {
			video: null,
			track: null,
			clip: null
		}
	}
};

export default (state = initialPlayerState, action) => {
	switch (action.type) {
		case UPDATE_CURRENT_TIME:
			return assign({}, state, {
				currentTime: action.currentTime || 0
			});
		case UPDATE_TIME:
			return assign({}, state, {
				duration: action.duration || 0,
				currentTime: action.currentTime || 0
			});
		case UPDATE_PLAYLIST: {
			let updatedPlaylist = assign({}, state.playlist, {
				current: action.payload.current
			});
			return assign({}, state, {
				playlist: updatedPlaylist
			});
		}
		case CURRENT_VIDEO_UPDATE:
			return assign({}, state, {
				currentVideo: {
					videoId: action.payload,
					playerAction: action.playerAction
				},
				initial: action.initial
			});
		case RESET_INITIAL:
			return assign({}, state, {
				initial: false
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
