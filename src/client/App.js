import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import Header from "./react/components/header/Header";
import { withRouter } from "react-router-dom";
import NavigationSidebar from "./react/components/navigation/NavigationSidebar";
import keydown from "react-keydown";
import { fetchCurrentUser } from "./redux/actions";
import { selectClip, deleteClip } from "./redux/actions/objectVideoActions";

class App extends Component {
	static loadData(store, match) {
		return store.dispatch(fetchCurrentUser());
	}
	componentDidMount() {
		this.props.fetchCurrentUser();
	}

	@keydown("esc")
	deselectClip() {
		console.log("deselect clip");
		this.props.selectClip(null);
	}

	@keydown("backspace")
	deleteClip() {
		console.log(this.props.selectedClip);
		if (this.props.selectedClip) {
			this.props.deleteClip(this.props.selectedClip);
		}
	}

	render() {
		return (
			<div className="app-container">
				<Header />

				<div className="navigation-container">
					<NavigationSidebar {...this.props} />
				</div>

				<div className="route-container">
					{renderRoutes(this.props.route.routes)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { selectedClip: state.pageVideo.selectedClip };
}

export default {
	component: connect(mapStateToProps, {
		fetchCurrentUser,
		selectClip,
		deleteClip
	})(withRouter(App))
};
