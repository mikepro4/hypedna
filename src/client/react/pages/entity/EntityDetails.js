import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import qs from "qs";
import * as _ from "lodash";

import Dropzone from "react-dropzone";
import axios from "axios";

import {
	Button,
	Classes,
	EditableText,
	Intent,
	NumericInput,
	Switch
} from "@blueprintjs/core";

import { Tab2, Tabs2, NonIdealState } from "@blueprintjs/core";

import { getEntityType } from "../../../redux/actions/pageOntologyActions";

import { updateQueryString } from "../../../redux/actions/";

import {
	loadEntityDetails,
	updateEntity
} from "../../../redux/actions/pageEntityActions";

class EntityDetails extends Component {
	state = {
		entityTitle: "",
		imageUrl: "",
		editedAvatar: false,
		edited: false,
		selectedTabId: "1"
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.entity._id !== this.props.entity._id) {
			this.setState({
				entityTitle: this.props.entity.properties.displayName
			});
		}

		if (prevState.selectedTabId !== this.getQueryParams().selectedTabId) {
			this.setState({
				selectedTabId: this.getQueryParams().selectedTabId
			});
		}
	};

	handleTitleChange = title => {
		this.setState({
			entityTitle: title
		});
	};

	getQueryParams = () => {
		return qs.parse(this.props.location.search.substring(1));
	};

	componentDidMount = () => {
		if (this.props.location.search) {
			let queryParams = this.getQueryParams();
			this.setState({
				selectedTabId: queryParams.selectedTabId
			});
		}
		this.setState({
			entityTitle: this.props.entity.properties.displayName
		});
	};

	handleTabChange = value => {
		this.setState({
			selectedTabId: value
		});

		this.props.updateQueryString(
			{ selectedTabId: value },
			this.props.location,
			this.props.history
		);
	};

	handleFormSubmit = () => {
		let newEntityProperties = _.assign({}, this.props.entity.properties, {
			displayName: this.state.entityTitle,
			imageUrl: this.state.imageUrl
		});

		let newEntity = _.assign({}, this.props.entity, {
			properties: newEntityProperties
		});

		this.props.updateEntity(this.props.entity._id, newEntity);
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

			// Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
			return axios
				.post(
					"https://api.cloudinary.com/v1_1/dcdnt/image/upload",
					formData,
					config
				)
				.then(response => {
					const data = response.data;
					const fileURL = data.secure_url; // You should store this URL for future references in your app
					this.setState({
						imageUrl: data.secure_url,
						editedAvatar: false
					});
				});
		});

		// Once all the files are uploaded
		axios.all(uploaders).then(() => {
			this.handleFormSubmit();
			// ... perform after upload is successful operation
		});
	};

	render() {
		return (
			<div className="entity-details-container">
				<div className="entity-details-header">
					<div className="header-left">
						<div className="header-left">
							<div className="entity-avatar">
								<Dropzone
									onDrop={this.handleDrop}
									multiple
									accept="image/*"
									style={{ width: "50px", height: "50px", background: "red" }}
								>
									<img
										src={
											this.state.editedAvatar
												? this.state.imageUrl
												: this.props.entity.properties.imageUrl
										}
									/>
								</Dropzone>
							</div>
							<div className="entity-info">
								<div className="entity-info-element">
									<div>
										<a
											className="entity-type-link anchor-button"
											onClick={() =>
												this.props.history.push(
													`/ontology?selectedTabId=2&selectedEntityTypeId=${
														this.props.entity.associatedEntityTypes[0]
															.entityTypeId
													}`
												)
											}
										>
											{this.props.getEntityType(
												this.props.entity.associatedEntityTypes[0].entityTypeId
											)
												? this.props.getEntityType(
														this.props.entity.associatedEntityTypes[0]
															.entityTypeId
													).genericProperties.displayName
												: ""}
										</a>
									</div>
									{this.props.match.params.entityUrlName ==
									this.props.entity.properties.entityUrlName ? (
										<EditableText
											intent={Intent.DEFAULT}
											maxLength="500"
											placeholder="Edit Entity Title..."
											className="entity-title"
											selectAllOnFocus={true}
											value={this.state.entityTitle}
											confirmOnEnterKey="true"
											onChange={this.handleTitleChange}
											onConfirm={this.handleFormSubmit}
										/>
									) : (
										<div className="entity-loading">Loading...</div>
									)}
									<div />
								</div>
							</div>
						</div>
					</div>
					<div className="header-right">right</div>
				</div>
				<div className="entity-details-content">
					<div className="ontology-editor-tabs-container">
						<Tabs2
							id="Tabs2Example"
							onChange={this.handleTabChange}
							selectedTabId={this.state.selectedTabId}
							large={true}
						>
							<Tab2 id="1" title="Timeline" panel={<div>Timeline</div>} />

							<Tab2 id="2" title="Properties" panel={<div>Properties</div>} />
							<Tab2 id="3" title="Relations" panel={<div>Relations</div>} />
						</Tabs2>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	entity: state.pageEntity.entity,
	allEntityTypes: state.pageOntology.allEntityTypes
});

export default withRouter(
	connect(mapStateToProps, {
		loadEntityDetails,
		updateQueryString,
		getEntityType,
		updateEntity
	})(EntityDetails)
);
