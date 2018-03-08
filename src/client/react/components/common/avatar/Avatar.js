import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import qs from "qs";
import * as _ from "lodash";
import classNames from "classnames";

import Dropzone from "react-dropzone";
import axios from "axios";

class Avatar extends Component {
	state = {
		imageUrl: "",
		editedAvatar: false
	};

	handleDrop = files => {
		const uploaders = files.map(file => {
			// Progress
			var config = {
				onUploadProgress: function(progressEvent) {
					let percentCompleted = Math.round(
						progressEvent.loaded * 100 / progressEvent.total
					);
					console.log(
						"onUploadProgress called with",
						arguments,
						"Percent Completed:" + percentCompleted
					);
				}
			};
			// Initial FormData
			const formData = new FormData();
			formData.append("file", file);
			formData.append("tags", `jamdna`);
			formData.append("upload_preset", "iidugxde"); // Replace the preset name with your own
			formData.append("api_key", "DhgKXiXYQqQj0nEB74w_70HfPWI"); // Replace API key with your own Cloudinary key
			formData.append("timestamp", (Date.now() / 1000) | 0);

			return axios
				.post(
					"https://api.cloudinary.com/v1_1/dcdnt/image/upload",
					formData,
					config
				)
				.then(response => {
					const data = response.data;
					const fileURL = data.secure_url;
					this.setState({
						imageUrl: data.secure_url,
						editedAvatar: false
					});
					this.props.onSuccess(data.secure_url);
				});
		});
	};

	render() {
		if (this.props.canUpload) {
			return (
				<Dropzone
					onDrop={this.handleDrop}
					multiple
					accept="image/*"
					className="avatar-container"
					className={classNames({
						"avatar-container": true,
						"empty-avatar": !this.state.editedAvatar && !this.props.imageUrl
					})}
				>
					{!this.state.editedAvatar && !this.props.imageUrl ? (
						<div className="empty-avatar-container">
							<span className="pt-icon-standard pt-icon-cloud-upload" />
						</div>
					) : (
						<img
							src={
								this.state.editedAvatar
									? this.state.imageUrl
									: this.props.imageUrl
							}
						/>
					)}
				</Dropzone>
			);
		} else {
			return (
				<div className="avatar-container">
					{!this.state.editedAvatar && !this.props.imageUrl ? (
						"no image"
					) : (
						<img src={this.props.imageUrl} />
					)}
				</div>
			);
		}
	}
}

const mapStateToProps = state => ({
	entity: state.pageEntity.entity,
	allEntityTypes: state.pageOntology.allEntityTypes
});

export default withRouter(connect(mapStateToProps, {})(Avatar));
