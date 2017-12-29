import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { reducer as formReducer } from "redux-form";

const REDUCERS_OBJECT = {
	auth: authReducer,
	form: formReducer
};

export default combineReducers(REDUCERS_OBJECT);
