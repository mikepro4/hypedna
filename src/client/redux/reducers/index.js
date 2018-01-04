import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { youtubeVideoSearch } from "./youtubeVideoSearch";
import playerReducer from "./playerReducer";
import { reducer as formReducer } from "redux-form";

const REDUCERS_OBJECT = {
	auth: authReducer,
	form: formReducer,
	youtubeVideoSearch: youtubeVideoSearch,
	player: playerReducer
};

export default combineReducers(REDUCERS_OBJECT);
