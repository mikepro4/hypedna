import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { youtubeVideoSearch } from "./youtubeVideoSearch";
import { pageVideoReducer } from "./pageVideoReducer";
import { pageSearchReducer } from "./pageSearchReducer";
import playerReducer from "./playerReducer";
import { reducer as formReducer } from "redux-form";
import { routerReducer } from "react-router-redux";

const REDUCERS_OBJECT = {
	auth: authReducer,
	form: formReducer,
	youtubeVideoSearch: youtubeVideoSearch,
	player: playerReducer,
	pageVideo: pageVideoReducer,
	pageSearch: pageSearchReducer,
	router: routerReducer
};

export default combineReducers(REDUCERS_OBJECT);
