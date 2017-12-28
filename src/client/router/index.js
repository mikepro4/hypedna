import React from "react";
import App from "../App";
import HomePage from "../react/pages/HomePage";
import SearchPage from "../react/pages/SearchPage";
import TagsPage from "../react/pages/TagsPage";

import AddVideo from "../react/pages/AddVideo";

export default [
	{
		...App,
		routes: [
			{
				...HomePage,
				path: "/",
				exact: true,
				params: {
					name: "home"
				}
			},
			{
				...SearchPage,
				path: "/search",
				exact: true,
				params: {
					name: "search"
				}
			},
			{
				...TagsPage,
				path: "/tags",
				exact: true,
				params: {
					name: "search"
				}
			},
			{
				...AddVideo,
				path: "/add_video",
				exact: true,
				params: {
					name: "add_video"
				}
			}
		]
	}
];
