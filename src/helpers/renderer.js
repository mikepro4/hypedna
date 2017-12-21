import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import serialize from "serialize-javascript";
import Router from "../client/router";

// JSS and MUI Setup
import { SheetsRegistry } from "react-jss/lib/jss";
import JssProvider from "react-jss/lib/JssProvider";
import { create } from "jss";
import preset from "jss-preset-default";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import createGenerateClassName from "material-ui/styles/createGenerateClassName";
import { green, red } from "material-ui/colors";
import jssExpand from "jss-expand";

export default (
	expressRequest,
	reduxStore,
	buildAssets,
	routerContext = {}
) => {
	const injectAssets = assets => {
		const assetNameWeights = {
			manifest: 1,
			vendor: 2,
			bundle: 3
		};

		return Object.entries(assets)
			.sort((firstElement, secondElement) => {
				if (
					assetNameWeights[firstElement[0]] < assetNameWeights[secondElement[0]]
				)
					return -1;
				else if (
					assetNameWeights[firstElement[0]] ===
					assetNameWeights[secondElement[0]]
				)
					return 0;
				return 1;
			})
			.reduce((accumulatorString, currentElement) => {
				accumulatorString += `<script src='${currentElement[1].js}'></script>`;

				return accumulatorString;
			}, "");
	};

	// Create a sheetsRegistry instance.
	const sheetsRegistry = new SheetsRegistry();

	// Create a theme instance.
	const theme = createMuiTheme({
		palette: {
			primary: green,
			accent: red,
			type: "light"
		}
	});

	// Configure JSS
	const jss = create(preset());
	jss.options.createGenerateClassName = createGenerateClassName;
	jss.use(jssExpand());

	const content = renderToString(
		<JssProvider registry={sheetsRegistry} jss={jss}>
			<MuiThemeProvider theme={theme} sheetsManager={new Map()}>
				<Provider store={reduxStore}>
					<StaticRouter location={expressRequest.path} context={routerContext}>
						<div>{renderRoutes(Router)}</div>
					</StaticRouter>
				</Provider>
			</MuiThemeProvider>
		</JssProvider>
	);

	const helmetInstance = Helmet.renderStatic();

	const css = sheetsRegistry.toString();

	const html = `
    <html>
      <head>
        ${helmetInstance.title.toString()}
        ${helmetInstance.meta.toString()}
				<link rel="stylesheet" href="${buildAssets.bundle.css}">
				<style id="jss-server-side">${css}</style>
				<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
				<link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900&subset=cyrillic,cyrillic-ext" rel="stylesheet">
      </head>
      <body>
        <div id="app">${content}</div>
        <script>window.INITIAL_STATE= ${serialize(
					reduxStore.getState()
				)}</script>
        ${injectAssets(buildAssets)}
      </body>
    </html>
  `;

	return html;
};
