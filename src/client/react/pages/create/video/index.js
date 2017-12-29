import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import VideoAddForm from "./Video_add_form";
import { youtubeUrlParser } from "../../../../utils/youtube";
import { loadYoutubeVideoDetails } from "../../../../redux/actions";

const styles = theme => ({
	menuText: {}
});

class CreateVideoPage extends Component {
	handleFormSubmit = ({ url }) => {
		this.props.loadYoutubeVideoDetails(youtubeUrlParser(url), history);
	};

	render() {
		console.log(this.props);
		return (
			<div className="route-content-container">
				<h3
					style={{
						margin: "0 0 5px 0",
						fontSize: "20px"
					}}
				>
					Add Video
				</h3>
				<div className="video-add-form">
					<VideoAddForm
						onSubmit={this.handleFormSubmit.bind(this)}
						onChange={values => {
							if (youtubeUrlParser(values.url)) {
								this.handleFormSubmit({ url: values.url });
							} else {
							}
						}}
					/>
				</div>

				<div className="loaded-video-container" style={{ display: "none" }}>
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
	component: connect(mapStateToProps, { loadYoutubeVideoDetails })(
		withStyles(styles)(withRouter(CreateVideoPage))
	)
};
