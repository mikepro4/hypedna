import { combineReducers } from "redux";
import { authReducer } from "./authReducer";

const REDUCERS_OBJECT = {
	auth: authReducer
};

export default combineReducers(REDUCERS_OBJECT);
