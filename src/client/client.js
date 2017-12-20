import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { Provider } from "react-redux";
import Router from "./router";
import reducer from "./redux/reducers";
import { configure as configureStore } from "./redux/store";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { green, red } from "material-ui/colors";

import "./styles/main.scss";

const PROXY_ROUTE = "/api";
const axiosInstance = axios.create({
	baseURL: PROXY_ROUTE
});

const store = configureStore(window.INITIAL_STATE, reducer, axiosInstance);

class Main extends Component {
	componentDidMount() {
		// Remove MUI generated styles
		const jssStyles = document.getElementById("jss-server-side");
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div>{renderRoutes(Router)}</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

// Define MUI Theme
const theme = createMuiTheme({
	palette: {
		primary: green,
		accent: red,
		type: "light"
	}
});

ReactDOM.hydrate(
	<MuiThemeProvider theme={theme}>
		<Main />
	</MuiThemeProvider>,
	document.getElementById("app")
);
