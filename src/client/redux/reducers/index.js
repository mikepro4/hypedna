import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { youtubeVideoSearch } from "./youtubeVideoSearch";
import { pageVideoReducer } from "./pageVideoReducer";
import { pageSearchReducer } from "./pageSearchReducer";
import { pageEntityTypeReducer } from "./pageEntityTypeReducer";
import { pageOntologyReducer } from "./pageOntologyReducer";
import { pageEntityReducer } from "./pageEntityReducer";
import { currentVideo } from "./currentVideo";
import playerReducer from "./playerReducer";
import { reducer as formReducer } from "redux-form";
import { routerReducer } from "react-router-redux";

const REDUCERS_OBJECT = {
	auth: authReducer,
	form: formReducer,
	youtubeVideoSearch: youtubeVideoSearch,
	player: playerReducer,
	currentVideo: currentVideo,
	pageVideo: pageVideoReducer,
	pageSearch: pageSearchReducer,
	pageEntityType: pageEntityTypeReducer,
	pageOntology: pageOntologyReducer,
	pageEntity: pageEntityReducer,
	router: routerReducer
};

export default combineReducers(REDUCERS_OBJECT);
