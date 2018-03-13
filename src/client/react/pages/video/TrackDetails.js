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
		trackDescription: "",
		ofRefs: {
			activeEntityTypes: [],
			activeEntityId: null
		},
		byRefs: {
			activeEntityTypes: [],
			activeEntityId: null
		}
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
		// if (!_.isEmpty(this.props.track.references.entity)) {
		// 	let mapped = _.map(
		// 		this.props.track.references.entityTypeIds,
		// 		entityType => {
		// 			return this.props.getEntityType(entityType.entityTypeId);
		// 		}
		// 	);
		//
		// 	this.setState({
		// 		ofRefs: {
		// 			activeEntityId: this.props.track.references.entity.id
		// 		}
		// 	});
		// }
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

		let ofRef = _.filter(this.props.allEntityTypes, entityType => {
			let entityTypeParents = entityType.parentEntityTypes;

			let containsRootAsParent = _.filter(entityTypeParents, entityType => {
				return (
					entityType.entityTypeId == this.props.track.references.rootEntityType
				);
			});

			if (containsRootAsParent.length > 0) {
				return (
					entityType.genericProperties.isRef == true &&
					entityType.genericProperties.isOfRef == true
				);
			}
		});

		if (ofRef[0]) {
			if (!_.isEmpty(this.props.track.references.entityTypeIds)) {
				let mapped = _.map(
					this.props.track.references.entityTypeIds,
					entityType => {
						return this.props.getEntityType(entityType.entityTypeId);
					}
				);
				console.log(mapped);

				let updatedRefs = _.assign({}, this.state.ofRefs, {
					activeEntityTypes: mapped,
					activeEntityId: this.props.track.references.entity.id
				});

				this.setState({
					ofRefs: updatedRefs
				});
			} else {
				let newActiveEntities = update(this.state.ofRefs.activeEntityTypes, {
					$push: [this.props.getEntityType(ofRef[0]._id)]
				});

				// let updatedRefs = _.assign({}, this.state.ofRefs, {
				// 	activeEntityTypes: newActiveEntities
				// });

				this.setState({
					ofRefs: _.assign({}, this.state.ofRefs, {
						activeEntityTypes: newActiveEntities
					})
				});
			}

			// if (!_.isEmpty(this.props.track.references.entity)) {
			// 	let updatedRefs = _.assign({}, this.state.ofRefs, {
			// 		activeEntityId: this.props.track.references.entity.id
			// 	});
			// 	this.setState({
			// 		ofRefs: updatedRefs
			// 	});
			// }
		}

		// if (
		// 	this.props.getEntityType(this.props.track.references.rootEntityType)
		// 		.genericProperties.hasOfRefs
		// ) {
		// 	let ofRef = _.filter(this.props.allEntityTypes, entityType => {
		// 		let entityTypeParents = entityType.parentEntityTypes;
		//
		// 		let containsRootAsParent = _.filter(entityTypeParents, entityType => {
		// 			return (
		// 				entityType.entityTypeId ==
		// 				this.props.track.references.rootEntityType
		// 			);
		// 		});
		//
		// 		if (containsRootAsParent.length > 0) {
		// 			return (
		// 				entityType.genericProperties.isRef == true &&
		// 				entityType.genericProperties.isOfRef == true
		// 			);
		// 		}
		// 	});
		// 	let ofChildEntityTypes = this.props.getChildEntityType(ofRef[0]);
		// 	let ofMappedChildEntities = _.map(ofChildEntityTypes, entityType => {
		// 		return entityType._id;
		// 	});
		//
		// 	if (!_.isEqual(ofMappedChildEntities, this.state.ofRefs)) {
		// 		this.setState({
		// 			ofRefs: ofMappedChildEntities
		// 		});
		// 	}
		// }

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

	getOptions = (input, callback, entityTypeId) => {
		this.props.searchEntities(
			{
				displayName: input,
				entityType: entityTypeId
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
		return (
			<div className="reference-container reference-of">
				<div className="reference-label">OF</div>
				<div className="reference-selector">
					<div className="reference-select-container">
						{this.renderOfReferences("of")}
					</div>
				</div>
			</div>
		);
	};

	selectOfRef = (value, selectorPosition) => {
		let realSelectorPosition = selectorPosition + 1;
		if (!_.isEmpty(value)) {
			if (this.state.ofRefs.activeEntityTypes.length > realSelectorPosition) {
				let diff =
					this.state.ofRefs.activeEntityTypes.length - realSelectorPosition;
				let trimmedActiveEntities = this.state.ofRefs.activeEntityTypes.slice(
					0,
					-diff
				);
				let newActiveEntities = update(trimmedActiveEntities, {
					$push: [this.props.getEntityType(value.value)]
				});
				this.setState({
					ofRefs: _.assign({}, this.state.ofRefs, {
						activeEntityTypes: newActiveEntities
					})
				});
			} else {
				let newActiveEntities = update(this.state.ofRefs.activeEntityTypes, {
					$push: [this.props.getEntityType(value.value)]
				});

				this.setState({
					ofRefs: _.assign({}, this.state.ofRefs, {
						activeEntityTypes: newActiveEntities
					})
				});
			}
		}

		window.dispatchEvent(new Event("resize"));

		// if (!_.isEmpty(value)) {
		// 	let containsIndex = _.findIndex(this.state.ofRefs.activeEntityTypes, {
		// 		_id: value.value
		// 	});
		//
		// 	if (selectorPosition == "initial") {
		// 		if (containsIndex == 0) {
		// 			if (this.state.ofRefs.activeEntityTypes.length == 1) {
		// 				let newActiveEntities = update(
		// 					this.state.ofRefs.activeEntityTypes,
		// 					{
		// 						$splice: [
		// 							[containsIndex, 1, this.props.getEntityType(value.value)]
		// 						]
		// 					}
		// 				);
		//
		// 				this.setState({
		// 					ofRefs: _.assign({}, this.state.ofRefs, {
		// 						activeEntityTypes: newActiveEntities
		// 					})
		// 				});
		// 			} else if (this.state.ofRefs.activeEntityTypes.length > 1) {
		// 				console.log("trim the rest and update first activeEntityType ");
		// 			}
		// 		} else {
		// 			if (this.state.ofRefs.activeEntityTypes.length == 0) {
		// 				let newActiveEntities = update(
		// 					this.state.ofRefs.activeEntityTypes,
		// 					{
		// 						$push: [this.props.getEntityType(value.value)]
		// 					}
		// 				);
		//
		// 				this.setState({
		// 					ofRefs: _.assign({}, this.state.ofRefs, {
		// 						activeEntityTypes: newActiveEntities
		// 					})
		// 				});
		// 			} else {
		// 				let newActiveEntities = update(
		// 					this.state.ofRefs.activeEntityTypes,
		// 					{
		// 						$splice: [[0, 1, this.props.getEntityType(value.value)]]
		// 					}
		// 				);
		//
		// 				this.setState({
		// 					ofRefs: _.assign({}, this.state.ofRefs, {
		// 						activeEntityTypes: newActiveEntities
		// 					})
		// 				});
		// 			}
		// 		}
		// 	}
		// }
		// if (this.state.ofRefs.activeEntityTypes.length > containsIndex + 1) {
		// 	console.log("trim the others after containsIndex first");
		// } else if (this.state.ofRefs.activeEntityTypes.length == contains+1) {
		// 	console.log('replace currently editing')
		// }
		// let newActiveEntities;
		// if (containsIndex >= 0) {
		// 	newActiveEntities = update(this.state.ofRefs.activeEntityTypes, {
		// 		$splice: [[containsIndex, 1, this.props.getEntityType(value.value)]]
		// 	});
		//
		// 	this.setState({
		// 		ofRefs: {
		// 			activeEntityTypes: newActiveEntities
		// 		}
		// 	});
		// } else {
		// 	newActiveEntities = update(this.state.ofRefs.activeEntityTypes, {
		// 		$push: [this.props.getEntityType(value.value)]
		// 	});
		//
		// 	this.setState({
		// 		ofRefs: {
		// 			activeEntityTypes: newActiveEntities
		// 		}
		// 	});
		// }
	};

	selectOfRefEntity = value => {
		console.log(value);
		if (!_.isEmpty(value)) {
			this.setState({
				ofRefs: _.assign({}, this.state.ofRefs, {
					activeEntityId: value.value
				})
			});

			let mapped = _.map(this.state.ofRefs.activeEntityTypes, entityType => {
				return { entityTypeId: entityType._id };
			});

			let newReferences = _.assign({}, this.props.track.references, {
				entityTypeIds: mapped,
				entity: {
					id: value.value,
					displayName: value.label
				}
			});

			let newTrack = _.assign({}, this.props.track, {
				references: newReferences
			});

			this.updateTrack(newTrack);
		} else {
			this.setState({
				ofRefs: _.assign({}, this.state.ofRefs, {
					activeEntityId: null
				})
			});
		}
	};

	renderEntityTypeSelector = (entityType, position, refType) => {
		let options = _.map(
			this.state.ofRefs.activeEntityTypes[position].childEntityTypes,
			entityType => {
				return {
					value: entityType.entityTypeId,
					label: this.props.getEntityType(entityType.entityTypeId)
						.genericProperties.displayName
				};
			}
		);

		return (
			<Select
				onChange={value => {
					if (refType == "of") {
						this.selectOfRef(value, position);
					} else if (refType == "by") {
						this.selectByRef(value, position);
					}
				}}
				onBlur={() => {}}
				options={options}
				clearable={false}
				searchable
				value={
					this.state.ofRefs.activeEntityTypes[position + 1]
						? this.state.ofRefs.activeEntityTypes[position + 1]._id
						: ""
				}
			/>
		);
	};

	renderEntitySelector = (entityType, position, refType) => {
		console.log("render async entity selector: ", entityType);
		return (
			<Select.Async
				onChange={value => {
					if (refType == "of") {
						this.selectOfRefEntity(value, position);
					} else if (refType == "by") {
						this.selectByRefEntity(value, position);
					}
				}}
				value={this.state.ofRefs.activeEntityId}
				onBlur={() => {}}
				loadOptions={(input, callback) =>
					this.getOptions(input, callback, entityType._id)
				}
				clearable
				searchable
			/>
		);
	};

	renderOfReferences = refType => {
		if (this.state.ofRefs.activeEntityTypes) {
			console.log(this.state.ofRefs.activeEntityTypes);
			return this.state.ofRefs.activeEntityTypes.map((entityType, i) => {
				return (
					<div className="single-reference-selector" key={i}>
						{entityType.genericProperties.canContainEntities
							? this.renderEntitySelector(entityType, i, refType)
							: this.renderEntityTypeSelector(entityType, i, refType)}
					</div>
				);
			});
		}
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
