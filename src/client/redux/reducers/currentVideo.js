import { CURRENT_VIDEO_UPDATE, UPDATE_TIME } from "../actions/types";

export const currentVideo = (state = {}, action) => {
	switch (action.type) {
		case CURRENT_VIDEO_UPDATE:
			return {
				...state,
				videoId: action.payload,
				playerAction: action.playerAction,
				seconds: action.seconds
			};
		default:
			return state;
	}
};
