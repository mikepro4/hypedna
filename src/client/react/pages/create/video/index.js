import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import VideoAddForm from "./Video_add_form";

const styles = theme => ({
	menuText: {}
});

class CreateVideoPage extends Component {
	handleFormSubmit = ({ url }) => {
		console.log(this.youtube_parser(url));
	};

	youtube_parser = url => {
		if (url) {
			const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			const match = url.match(regExp);
			return match && match[7].length == 11 ? match[7] : false;
		}
	};

	render() {
		return (
			<div className="route-content-container">
				<div className="video-add-form">
					<VideoAddForm
						onSubmit={this.handleFormSubmit.bind(this)}
						onChange={values => {
							if (this.youtube_parser(values.url)) {
								this.handleFormSubmit({ url: values.url });
							} else {
							}
						}}
					/>
				</div>

				<div className="loaded-video-container">
					<div className="loaded-video-player-area">player area</div>
					<div className="loaded-video-info-area">content area</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { form: state.form };
}

export default {
	component: connect(mapStateToProps)(
		withStyles(styles)(withRouter(CreateVideoPage))
	)
};
