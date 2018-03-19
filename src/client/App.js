import React, { Component } from "react";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import Header from "./react/components/header/Header";
import { withRouter } from "react-router-dom";
import NavigationSidebar from "./react/components/navigation/NavigationSidebar";
import keydown from "react-keydown";
import { fetchCurrentUser } from "./redux/actions";
import { selectClip, deleteClip } from "./redux/actions/objectTrackActions";
import { updatePlaylist } from "./redux/actions/player";
import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

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

	@keydown("enter")
	playClip() {
		if (this.props.selectedClip && this.props.selectedTrack) {
			this.props.updatePlaylist({});
			setTimeout(() => {
				this.props.updatePlaylist({
					video: this.props.video,
					track: this.props.selectedTrack,
					clip: this.props.selectedClip
				});
			});
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
	return {
		selectedClip: state.pageVideo.selectedClip,
		selectedTrack: state.pageVideo.selectedTrack,
		video: state.pageVideo.singleVideo
	};
}

export default {
	component: connect(mapStateToProps, {
		fetchCurrentUser,
		selectClip,
		deleteClip,
		updatePlaylist
	})(withRouter(App))
};
