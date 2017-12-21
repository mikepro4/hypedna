import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { routerReducer } from "react-router-redux";

const REDUCERS_OBJECT = {
	auth: authReducer,
	routing: routerReducer
};

export default combineReducers(REDUCERS_OBJECT);
