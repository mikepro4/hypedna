import * as _ from "lodash";
import axios from "axios";
import { reset, submit } from "redux-form";

/////////////////////////////////////////////////

export const resetForm = formName => dispatch => {
	dispatch(reset(formName));
};

export const submitForm = formName => dispatch => {
	dispatch(submit(formName));
};

/////////////////////////////////////////////////
