import * as redux from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware, routerReducer } from "react-router-redux";

import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";

const INITIAL_STATE = {};

export const configure = (
	initialState = INITIAL_STATE,
	reducers = {},
	axiosInstance = null,
	fromServer: null
) => {
	let history;

	if (fromServer) {
		history = createMemoryHistory();
	} else {
		history = createBrowserHistory();
	}

	// Analytics will be tracked here
	// history.listen(location => console.log(location));

	const initializedRouterMW = routerMiddleware(history);

	const middlewares = axiosInstance
		? [thunk.withExtraArgument(axiosInstance)]
		: [thunk];
	const appliedMiddlewares = redux.applyMiddleware(
		...middlewares,
		initializedRouterMW
	);
	const composeArguments = [appliedMiddlewares];

	if (global.window !== undefined) {
		// composeArguments.push(
		// 	global.window.__REDUX_DEVTOOLS_EXTENSION__ &&
		// 		global.window.__REDUX_DEVTOOLS_EXTENSION__()
		// );

		composeArguments.push(
			window.devToolsExtension ? window.devToolsExtension() : _ => _
		);
	}

	const composedEnhancer = redux.compose(...composeArguments);
	const store = redux.createStore(reducers, initialState, composedEnhancer);

	return { history, store };
};
