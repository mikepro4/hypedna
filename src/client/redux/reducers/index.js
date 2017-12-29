import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { videoReducer } from "./videoReducer";
import { reducer as formReducer } from "redux-form";

const REDUCERS_OBJECT = {
	auth: authReducer,
	form: formReducer,
	video: videoReducer
};

export default combineReducers(REDUCERS_OBJECT);
