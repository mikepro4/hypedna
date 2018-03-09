import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import { formatTime } from "../../../utils/timeFormatter";
import Select from "react-select";
import { withStyles } from "material-ui/styles";

import moment from "moment";
import {
	addTrack,
	deleteTrack,
	updateTrack
} from "../../../redux/actions/objectVideoActions";

import { searchEntities } from "../../../redux/actions/pageOntologyActions";

import {
	getUserInfo,
	getEntityType,
	getChildEntityType
} from "../../../redux/actions/appActions";

import {
	Classes,
	EditableText,
	Intent,
	Position,
	Toaster,
	Button
} from "@blueprintjs/core";

import Avatar from "../../components/common/avatar/Avatar";
import User from "../../components/common/user/User";
import Popover from "material-ui/Popover";

const styles = theme => ({
	paper: {
		"overflow-x": "visible",
		"overflow-y": "visible"
	}
});

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

		if (
			this.props.getEntityType(this.props.track.references.rootEntityType)
				.genericProperties.hasByRefs
		) {
			let byRef = _.filter(this.props.allEntityTypes, entityType => {
				let entityTypeParents = entityType.parentEntityTypes;

				let containsRootAsParent = _.filter(entityTypeParents, entityType => {
					return (
						entityType.entityTypeId ==
						this.props.track.references.rootEntityType
					);
				});

				if (containsRootAsParent.length > 0) {
					return (
						entityType.genericProperties.isRef == true &&
						entityType.genericProperties.isByRef == true
					);
				}
			});

			let byChildEntityTypes = this.props.getChildEntityType(byRef[0]);
			let byMappedChildEntities = _.map(byChildEntityTypes, entityType => {
				return entityType._id;
			});
			if (!_.isEqual(byMappedChildEntities, this.state.byRefs)) {
				this.setState({
					byRefs: byMappedChildEntities
				});
			}
		}

		if (
			this.props.getEntityType(this.props.track.references.rootEntityType)
				.genericProperties.hasOfRefs
		) {
			let ofRef = _.filter(this.props.allEntityTypes, entityType => {
				let entityTypeParents = entityType.parentEntityTypes;

				let containsRootAsParent = _.filter(entityTypeParents, entityType => {
					return (
						entityType.entityTypeId ==
						this.props.track.references.rootEntityType
					);
				});

				if (containsRootAsParent.length > 0) {
					return (
						entityType.genericProperties.isRef == true &&
						entityType.genericProperties.isOfRef == true
					);
				}
			});
			let ofChildEntityTypes = this.props.getChildEntityType(ofRef[0]);
			let ofMappedChildEntities = _.map(ofChildEntityTypes, entityType => {
				return entityType._id;
			});

			if (!_.isEqual(ofMappedChildEntities, this.state.ofRefs)) {
				this.setState({
					ofRefs: ofMappedChildEntities
				});
			}
		}

		setTimeout(() => {
			window.dispatchEvent(new Event("resize"));
		}, 100);
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
		window.dispatchEvent(new Event("resize"));
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

	getTotalClipLength = () => {
		let seconds = 0;

		_.each(this.props.track.clips, clip => {
			let clipDuration = clip.end - clip.start;
			seconds = seconds + clipDuration;
		});
		return formatTime(seconds);
	};

	getOptions = (input, callback, refType) => {
		this.props.searchEntities(
			{
				displayName: input,
				entityTypes: refType == "by" ? this.state.byRefs : this.state.ofRefs
			},
			"displayName",
			0,
			20,
			data => {
				let options = data.all.map(entity => ({
					value: entity._id,
					label: entity.properties.displayName
				}));

				let filteredOptions = _.filter(options, option => {
					return !_.isEmpty(option.label);
				});

				callback(null, {
					options: _.uniqBy(filteredOptions, "label"),
					complete: true
				});
			}
		);
	};

	selectByRef = value => {
		console.log(value);
	};

	selectOfRef = value => {
		console.log(value);
	};

	renderBySelector = () => {
		return (
			<div className="reference-container reference-by">
				<div className="reference-label">BY</div>
				<div className="reference-selector">
					<div className="reference-select-container">
						<Select.Async
							onChange={value => this.selectByRef(value)}
							onBlur={() => {}}
							loadOptions={(input, callback) =>
								this.getOptions(input, callback, "by")
							}
							clearable
							searchable
						/>
						<Button text="New" onClick={() => {}} />
					</div>
				</div>
			</div>
		);
	};

	renderOfSelector = () => {
		// let childEntityTypes = this.props.getEntityType(
		// 	this.props.track.references.rootEntityType
		// ).childEntityTypes;
		//
		// let options = childEntityTypes.map(entityType => ({
		// 	value: entityType._id,
		// 	label: this.props.getEntityType(entityType._id).genericProperties
		// 		.displayName
		// }));

		return (
			<div className="reference-container reference-of">
				<div className="reference-label">OF</div>
				<div className="reference-selector">
					<div className="reference-select-container">
						<Select.Async
							onChange={value => this.selectOfRef(value)}
							onBlur={() => {}}
							loadOptions={(input, callback) =>
								this.getOptions(input, callback, "of")
							}
							clearable
							searchable
						/>
						<Button text="New" onClick={() => {}} />
					</div>
				</div>
			</div>
		);
	};

	render() {
		let userInfo;

		if (this.props.track) {
			userInfo = _.filter(this.props.loadedUsers, user => {
				return user._id == this.props.track.createdBy;
			});
		}

		return (
			<Popover
				open={this.props.open}
				anchorEl={this.props.anchorEl}
				onClose={this.props.handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				classes={{
					paper: this.props.classes.paper
				}}
			>
				<div className="track-details-container">
					<Toaster position={Position.BOTTOM_RIGHT} ref="toaster" />
					<div className="track-details-header">
						<div className="header-left">
							<h1 className="popover-title">
								{
									this.props.getEntityType(
										this.props.track.references.rootEntityType
									).genericProperties.displayName
								}
							</h1>
						</div>
						<div className="header-right">
							<ul className="header-actions">
								<li className="header-single-action">
									<a className="anchor-button">
										<span className="pt-icon-standard pt-icon-flag" />
									</a>
								</li>

								<li className="header-single-action">
									<a
										className="anchor-button"
										onClick={() => this.deleteTrack()}
									>
										<span className="pt-icon-standard pt-icon-trash" />
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
							</ul>
						</div>
					</div>

					{!this.props.getEntityType(this.props.track.references.rootEntityType)
						.genericProperties.hasOfRefs ? (
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
								<div className="title-inputs">
									<div className="title-label">
										{
											this.props.getEntityType(
												this.props.track.references.rootEntityType
											).genericProperties.displayName
										}{" "}
										Title
									</div>
									<EditableText
										intent={Intent.DEFAULT}
										maxLength="45"
										multiline
										minLines={1}
										maxLines={2}
										placeholder={`Edit ${
											this.props.getEntityType(
												this.props.track.references.rootEntityType
											).genericProperties.displayName
										} Title...`}
										className="track-title"
										selectAllOnFocus={true}
										value={this.state.trackTitle}
										confirmOnEnterKey="true"
										onChange={this.handleTitleChange}
										onConfirm={this.handleFormSubmit}
									/>
								</div>
							</div>
						</div>
					) : (
						""
					)}

					{this.props.getEntityType(this.props.track.references.rootEntityType)
						.genericProperties.hasOfRefs
						? this.renderOfSelector()
						: ""}

					{this.props.getEntityType(this.props.track.references.rootEntityType)
						.genericProperties.hasByRefs
						? this.renderBySelector()
						: ""}

					<div className="track-details-description">
						<EditableText
							multiline
							minLines={2}
							maxLines={12}
							intent={Intent.DEFAULT}
							maxLength="500"
							placeholder={`Edit ${
								this.props.getEntityType(
									this.props.track.references.rootEntityType
								).genericProperties.displayName
							} Description...`}
							className="track-description"
							selectAllOnFocus={true}
							value={this.state.trackDescription}
							confirmOnEnterKey="true"
							onChange={this.handleDescriptionChange}
							onConfirm={this.handleFormSubmit}
						/>
					</div>

					<div className="track-detail-footer">
						<div className="footer-left">
							<User userId={this.props.track.createdBy} />{" "}
							<span className="date-container">
								tagged {moment(this.props.track.createdAt).fromNow()}
							</span>
						</div>

						<div className="footer-right">
							{this.props.track.clips.length > 0 ? (
								<div className="clips-count-container">
									<div className="clips-count">
										{this.props.track.clips.length} clip{this.props.track.clips
											.length > 1
											? "s"
											: ""}
									</div>

									<div className="duration-count" title="Total clips duration">
										{this.getTotalClipLength()}
									</div>
								</div>
							) : (
								<div className="clips-count-container empty">
									<div className="clips-count">No Clips</div>

									<div className="duration-count" title="Total clips duration">
										{this.getTotalClipLength()}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</Popover>
		);
	}
}

const mapStateToProps = state => ({
	video: state.pageVideo.singleVideo,
	allEntityTypes: state.app.allEntityTypes
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, {
			deleteTrack,
			updateTrack,
			getEntityType,
			getChildEntityType,
			searchEntities
		})(TrackDetails)
	)
);
