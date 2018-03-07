import { assign } from "lodash";
import update from "immutability-helper";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	LOAD_USER_INFO
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	loadedUsers: [],
	isFetchingEntityTypes: false
};

export const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_ALL_ENTITY_TYPES:
			return assign({}, state, {
				isFetchingEntityTypes: true
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload,
				isFetchingEntityTypes: false
			});

		case LOAD_USER_INFO:
			let newUsers = [];
			let filteredUsers = _.filter(state.loadedUsers, user => {
				return user.googleId == action.payload.id;
			});
			if (filteredUsers.length == 0) {
				newUsers = update(state.loadedUsers, { $push: [action.payload] });
			} else {
				newUsers = state.loadedUsers;
			}
			return assign({}, state, {
				loadedUsers: newUsers
			});
		default:
			return state;
	}
};
