import express from "express";
import path from "path";
import { matchRoutes } from "react-router-config";
import proxy from "express-http-proxy";
import axios from "axios";
import Router from "./client/router";
import renderer from "./helpers/renderer";
import { configure as createStore } from "./client/redux/store";
import reducer from "./client/redux/reducers";
import buildAssets from "../webpack-assets.json";
import { ConnectedRouter, push } from "react-router-redux";

const PORT = process.env.PORT || 3000;
const BASE_API_URL = process.env.BASE_API_URL || "http://localhost:5000";
const HOST = process.env.HOST || `localhost:${PORT}`;
const PROXY_ROUTE = "/api";
const PUBLIC_DIR = "public";
const STATIC_DIR = "static";

const app = express();

app.use(
	PROXY_ROUTE,
	proxy(BASE_API_URL, {
		proxyReqOptDecorator: opts => {
			opts.headers["x-forwarded-host"] = HOST;
			return opts;
		}
	})
);

app.use(express.static(STATIC_DIR));
app.use(express.static(PUBLIC_DIR));

app.get("*", (request, response) => {
	const axiosInstance = axios.create({
		baseURL: BASE_API_URL,
		headers: { cookie: request.get("cookie") || "" }
	});

	const { history, store } = createStore(
		{},
		reducer,
		axiosInstance,
		"fromServer"
	);

	store.dispatch(push(request.path));

	const currentRoute = matchRoutes(Router, request.path);

	const need = currentRoute.map(({ route, match }) => {
		if (route.component) {
			return route.component.loadData
				? // the following will be passed into each component's `loadData` method:
					route.component.loadData(
						store,
						match,
						route,
						request.path,
						request.query
					)
				: Promise.resolve(null);
		}
		Promise.resolve(null);
	});

	Promise.all(need).then(() => {
		const staticRouterContext = {};
		const html = renderer(
			request,
			store,
			buildAssets,
			staticRouterContext,
			history
		);
		if (staticRouterContext.url)
			return response.redirect(301, staticRouterContext.url);
		if (staticRouterContext.notFound) response.status(404);
		response.send(html);
	});
});

app.listen(PORT, () => {
	console.log("Server listening at port: ", PORT);
});
