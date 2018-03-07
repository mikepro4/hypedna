import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import {
	addTrack,
	deleteTrack,
	updateTrack
} from "../../../redux/actions/objectVideoActions";

import { getUserInfo } from "../../../redux/actions/appActions";

import {
	Classes,
	EditableText,
	Intent,
	Position,
	Toaster
} from "@blueprintjs/core";

import Avatar from "../../components/common/avatar/Avatar";

class TrackDetails extends Component {
	state = {
		trackTitle: "",
		trackDescription: ""
	};

	updateTrack = newTrack => {
		this.props.updateTrack(
			this.props.video.googleId,
			this.props.track._id,
			newTrack,
			() => {
				this.showSuccessToast("updated track");
			}
		);
		// this.props.handleClose();
	};

	componentDidMount = () => {
		this.setState({
			trackTitle: this.props.track.title,
			trackDescription: this.props.track.description
		});

		let loadedUsers = _.filter(this.props.loadedUsers, user => {
			return user._id == this.props.track.createdBy;
		});

		if (loadedUsers == 0) {
			this.props.getUserInfo(this.props.track.createdBy);
		}
	};

	deleteTrack = () => {
		this.props.deleteTrack(this.props.video.googleId, this.props.track._id);
		this.props.handleClose();
	};

	submitAvatar = imageUrl => {
		let newTrack = _.assign({}, this.props.track, {
			imageUrl: imageUrl
		});

		this.updateTrack(newTrack);
	};

	handleTitleChange = title => {
		this.setState({
			trackTitle: title
		});
	};

	handleDescriptionChange = description => {
		this.setState({
			trackDescription: description
		});
	};

	handleFormSubmit = () => {
		let newTrack = _.assign({}, this.props.track, {
			title: this.state.trackTitle,
			description: this.state.trackDescription
		});

		this.updateTrack(newTrack);
	};

	showSuccessToast = (message, id) => {
		this.refs.toaster.show({
			message: message,
			intent: Intent.SUCCESS,
			iconName: "tick"
		});
	};

	render() {
		let userInfo;

		if (this.props.track) {
			userInfo = _.filter(this.props.loadedUsers, user => {
				return user._id == this.props.track.createdBy;
			});
		}

		return (
			<div className="track-details-container">
				<Toaster position={Position.BOTTOM_RIGHT} ref="toaster" />
				<div className="track-details-header">
					<div className="header-left">
						<h1 className="popover-header">Track Details</h1>
					</div>
					<div className="header-right">
						<ul className="header-actions">
							<li className="header-single-action">
								<a
									className="anchor-button"
									onClick={() => this.props.handleClose()}
								>
									<span className="pt-icon-standard pt-icon-flag" />
								</a>
							</li>
							<li className="header-single-action">
								<a
									className="anchor-button"
									onClick={() => this.props.handleClose()}
								>
									<span className="pt-icon-standard pt-icon-cross" />
								</a>
							</li>
							<li className="header-single-action">
								<a className="anchor-button">
									<span className="pt-icon-standard pt-icon-edit" />
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="track-details-content">
					<div className="track-avatar">
						<Avatar
							imageUrl={
								this.props.track && this.props.track.imageUrl
									? this.props.track.imageUrl
									: ""
							}
							onSuccess={this.submitAvatar}
							canUpload={true}
						/>
					</div>
					<div className="track-title-container">
						<div>
							<EditableText
								intent={Intent.DEFAULT}
								maxLength="500"
								placeholder="Edit Track Title..."
								className="track-title"
								selectAllOnFocus={true}
								value={this.state.trackTitle}
								confirmOnEnterKey="true"
								onChange={this.handleTitleChange}
								onConfirm={this.handleFormSubmit}
							/>

							<EditableText
								multiline
								minLines={1}
								maxLines={12}
								intent={Intent.DEFAULT}
								maxLength="500"
								placeholder="Edit Track Description..."
								className="track-description"
								selectAllOnFocus={true}
								value={this.state.trackDescription}
								confirmOnEnterKey="true"
								onChange={this.handleDescriptionChange}
								onConfirm={this.handleFormSubmit}
							/>
						</div>
					</div>
				</div>

				<div className="track-detail-footer">
					{this.props.track && userInfo[0] ? (
						<img src={userInfo[0].profile.photos[0].value} />
					) : (
						""
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	video: state.pageVideo.singleVideo,
	allEntityTypes: state.app.allEntityTypes,
	loadedUsers: state.app.loadedUsers
});

export default withRouter(
	connect(mapStateToProps, { deleteTrack, updateTrack, getUserInfo })(
		TrackDetails
	)
);
