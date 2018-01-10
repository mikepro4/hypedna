import {
	UPDATE_STATUS,
	UPDATE_TIME,
	UPDATE_PLAYER_VIDEO_ID,
	RESET_VIDEO,
	SEEK_TO_TIME
} from "./types";

export function updatePlayerStatus(status) {
	return {
		type: UPDATE_STATUS,
		status: status
	};
}

export function updateTime(duration, currentTime) {
	return {
		type: UPDATE_TIME,
		duration,
		currentTime
	};
}

export function resetVideo() {
	return {
		type: RESET_VIDEO
	};
}

export function seekToTime(seconds) {
	return {
		type: SEEK_TO_TIME,
		seconds
	};
}
