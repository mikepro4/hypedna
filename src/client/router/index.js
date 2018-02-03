import React from "react";
import App from "../App";
import HomePage from "../react/pages/HomePage";
import TagsPage from "../react/pages/TagsPage";
import VideoPage from "../react/pages/video";

import CreatePage from "../react/pages/create";
import CreateVideoPage from "../react/pages/create/video";

import SearchPage from "../react/pages/search";

import EntityTypePage from "../react/pages/entityType";
import OntologyPage from "../react/pages/ontology";

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
				...CreatePage,
				path: "/create",
				params: {
					name: "create_content"
				},

				routes: [
					{
						...CreateVideoPage,
						path: "/create/video",
						params: {
							name: "create_content_video"
						}
					}
				]
			},
			{
				...VideoPage,
				path: "/video/:googleId",
				// exact: true,
				params: {
					name: "video_page"
				}
			},
			{
				...EntityTypePage,
				path: "/entityType",
				// exact: true,
				params: {
					name: "entity_type_page"
				}
			},
			{
				...OntologyPage,
				path: "/ontology",
				params: {
					name: "ontology"
				}
			}
		]
	}
];
