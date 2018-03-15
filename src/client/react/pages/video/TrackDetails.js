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
	deleteTrack,
	updateTrack,
	searchTracks,
	optimisticTrackDelete
} from "../../../redux/actions/objectTrackActions";

import { searchEntities } from "../../../redux/actions/pageOntologyActions";

import {
	getRef,
	getUserInfo,
	getEntityType,
	getChildEntityType,
	getSingleEntity
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

	resetPopover = () => {
		setTimeout(() => {
			window.dispatchEvent(new Event("resize"));
		}, 100);
	};

	componentDidMount = () => {
		this.setState({
			trackTitle: this.props.track.metadata.customOfInfo.title,
			trackDescription: this.props.track.metadata.customOfInfo.description
		});

		let entityType = this.props.getEntityType(
			this.props.track.references.rootEntityType
		);

		// populate OF refs
		if (entityType.genericProperties.hasOfRefs) {
			this.populateOfRefs();
		}

		if (entityType.genericProperties.hasByRefs) {
			this.populateByRefs();
		}

		this.resetPopover();
	};

	populateOfRefs = () => {
		if (!_.isEmpty(this.props.track.references.ofRefs.entityTypeIds)) {
			// if exists - get full details of entity type and add to state
			let mappedEntityTypes = _.map(
				this.props.track.references.ofRefs.entityTypeIds,
				entityType => {
					return this.props.getEntityType(entityType.entityTypeId);
				}
			);

			let updatedRefs = _.assign({}, this.state.ofRefs, {
				activeEntityTypes: mappedEntityTypes,
				activeEntityId: this.props.track.references.ofRefs.entity.id
			});

			this.setState({
				ofRefs: updatedRefs
			});
		} else {
			// if empty - start with root entityType's OF ref
			let newActiveEntities = update(this.state.ofRefs.activeEntityTypes, {
				$push: [
					this.props.getRef(this.props.track.references.rootEntityType, "of")
				]
			});

			this.setState({
				ofRefs: _.assign({}, this.state.ofRefs, {
					activeEntityTypes: newActiveEntities
				})
			});
		}
	};

	populateByRefs = () => {
		if (!_.isEmpty(this.props.track.references.byRefs.entityTypeIds)) {
			console.log("populate");
			// if exists - get full details of entity type and add to state
			let mappedEntityTypes = _.map(
				this.props.track.references.byRefs.entityTypeIds,
				entityType => {
					return this.props.getEntityType(entityType.entityTypeId);
				}
			);

			let updatedRefs = _.assign({}, this.state.byRefs, {
				activeEntityTypes: mappedEntityTypes,
				activeEntityId: this.props.track.references.byRefs.entity.id
			});

			console.log("updatedRefs: ", updatedRefs);

			this.setState({
				byRefs: updatedRefs
			});
		} else {
			// if empty - start with root entityType's OF ref
			let newActiveEntities = update(this.state.byRefs.activeEntityTypes, {
				$push: [
					this.props.getRef(this.props.track.references.rootEntityType, "by")
				]
			});

			this.setState({
				byRefs: _.assign({}, this.state.byRefs, {
					activeEntityTypes: newActiveEntities
				})
			});
		}
	};

	searchTracks = () => {
		this.props.searchTracks(
			{ videoId: this.props.video.googleId },
			"createdAt",
			0,
			0,
			() => {
				this.setState({
					notLoadedTracks: false
				});
			}
		);
	};

	updateTrack = newTrack => {
		this.props.updateTrack(this.props.track._id, newTrack, () => {
			this.searchTracks();
			this.showSuccessToast("updated track");
		});
	};

	showSuccessToast = (message, id) => {
		this.refs.toaster.show({
			message: message,
			intent: Intent.SUCCESS,
			iconName: "tick"
		});
	};

	deleteTrack = () => {
		this.props.optimisticTrackDelete(this.props.track._id);
		this.props.deleteTrack(this.props.track._id, () => {
			// this.searchTracks();
		});
		this.props.handleClose();
	};

	getTotalClipLength = () => {
		let seconds = 0;

		_.each(this.props.track.clips, clip => {
			let clipDuration = clip.end - clip.start;
			seconds = seconds + clipDuration;
		});
		return formatTime(seconds);
	};

	renderCustomOfEditor = entityType => {
		return (
			<div className="track-details-content">
				<div className="track-avatar">
					<Avatar
						imageUrl={
							this.props.track &&
							this.props.track.metadata &&
							this.props.track.metadata.customOfInfo.imageUrl
								? this.props.track.metadata.customOfInfo.imageUrl
								: ""
						}
						onSuccess={this.submitAvatar}
						canUpload={true}
					/>
				</div>
				<div className="track-title-container">
					<div className="title-inputs">
						<div className="title-label">
							{entityType.genericProperties.displayName} Title
						</div>
						<EditableText
							intent={Intent.DEFAULT}
							maxLength="45"
							multiline
							minLines={1}
							maxLines={2}
							placeholder={`Edit ${
								entityType.genericProperties.displayName
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
		);
	};

	submitAvatar = imageUrl => {
		let customOfInfo = _.assign({}, this.props.track.metadata.customOfInfo, {
			imageUrl: imageUrl
		});
		let metadata = _.assign({}, this.props.track.metadata, {
			customOfInfo: customOfInfo
		});
		let newTrack = _.assign({}, this.props.track, {
			metadata: metadata
		});

		this.updateTrack(newTrack);
	};

	handleTitleChange = title => {
		this.setState({
			trackTitle: title
		});
	};

	handleDescriptionChange = description => {
		this.resetPopover();
		this.setState({
			trackDescription: description
		});
	};

	handleFormSubmit = () => {
		let customOfInfo = _.assign({}, this.props.track.metadata.customOfInfo, {
			title: this.state.trackTitle,
			description: this.state.trackDescription
		});
		let metadata = _.assign({}, this.props.track.metadata, {
			customOfInfo: customOfInfo
		});
		let newTrack = _.assign({}, this.props.track, {
			metadata: metadata
		});

		this.updateTrack(newTrack);
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

	renderSelectors = refType => {
		if (refType == "of") {
			return (
				<div className="reference-container reference-of">
					<div className="reference-label">OF</div>
					<div className="reference-selector">
						<div className="reference-select-container">
							{this.renderReferences("of")}
						</div>
					</div>
				</div>
			);
		}

		if (refType == "by") {
			return (
				<div className="reference-container reference-by">
					<div className="reference-label">BY</div>
					<div className="reference-selector">
						<div className="reference-select-container">
							{this.renderReferences("by")}
						</div>
					</div>
				</div>
			);
		}
	};

	renderEntityTypeSelector = (entityType, position, refType) => {
		let options;
		let value;

		if (refType == "of") {
			options = _.map(
				this.state.ofRefs.activeEntityTypes[position].childEntityTypes,
				entityType => {
					return {
						value: entityType.entityTypeId,
						label: this.props.getEntityType(entityType.entityTypeId)
							.genericProperties.displayName
					};
				}
			);
			if (this.state.ofRefs.activeEntityTypes[position + 1]) {
				value = this.state.ofRefs.activeEntityTypes[position + 1]._id;
			}
		} else if (refType == "by") {
			options = _.map(
				this.state.byRefs.activeEntityTypes[position].childEntityTypes,
				entityType => {
					return {
						value: entityType.entityTypeId,
						label: this.props.getEntityType(entityType.entityTypeId)
							.genericProperties.displayName
					};
				}
			);
			if (this.state.byRefs.activeEntityTypes[position + 1]) {
				value = this.state.byRefs.activeEntityTypes[position + 1]._id;
			}
		}

		return (
			<Select
				key={entityType._id}
				onChange={value => this.selectRef(value, position, refType)}
				onBlur={() => {}}
				options={options}
				clearable={false}
				searchable
				value={value}
			/>
		);
	};

	renderEntitySelector = (entityType, position, refType) => {
		let value;

		if (refType == "of") {
			value = this.state.ofRefs.activeEntityId;
		} else if (refType == "by") {
			value = this.state.byRefs.activeEntityId;
		}

		return (
			<Select.Async
				key={entityType._id}
				onChange={value => this.selectEntity(value, position, refType)}
				value={value}
				onBlur={() => {}}
				loadOptions={(input, callback) =>
					this.getOptions(input, callback, entityType._id)
				}
				clearable
				searchable
			/>
		);
	};

	renderReferences = refType => {
		if (refType == "of") {
			return this.state.ofRefs.activeEntityTypes.map((entityType, i) => {
				return (
					<div className="single-reference-selector" key={i}>
						{entityType.genericProperties.canContainEntities
							? this.renderEntitySelector(entityType, i, refType)
							: this.renderEntityTypeSelector(entityType, i, refType)}
					</div>
				);
			});
		} else if (refType == "by") {
			return this.state.byRefs.activeEntityTypes.map((entityType, i) => {
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

	selectRef = (value, selectorPosition, refType) => {
		let realSelectorPosition = selectorPosition + 1;
		if (!_.isEmpty(value)) {
			if (refType == "of") {
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
			} else if (refType == "by") {
				if (this.state.byRefs.activeEntityTypes.length > realSelectorPosition) {
					let diff =
						this.state.byRefs.activeEntityTypes.length - realSelectorPosition;
					let trimmedActiveEntities = this.state.byRefs.activeEntityTypes.slice(
						0,
						-diff
					);
					let newActiveEntities = update(trimmedActiveEntities, {
						$push: [this.props.getEntityType(value.value)]
					});
					this.setState({
						byRefs: _.assign({}, this.state.byRefs, {
							activeEntityTypes: newActiveEntities
						})
					});
				} else {
					let newActiveEntities = update(this.state.byRefs.activeEntityTypes, {
						$push: [this.props.getEntityType(value.value)]
					});

					this.setState({
						byRefs: _.assign({}, this.state.byRefs, {
							activeEntityTypes: newActiveEntities
						})
					});
				}
			}
		}

		window.dispatchEvent(new Event("resize"));
	};

	selectEntity = (value, selectorPosition, refType) => {
		if (refType == "of") {
			if (!_.isEmpty(value)) {
				this.setState({
					ofRefs: _.assign({}, this.state.ofRefs, {
						activeEntityId: value.value
					})
				});

				this.props.getSingleEntity(value.value, data => {
					let mappedEntityTypes = _.map(
						this.state.ofRefs.activeEntityTypes,
						entityType => {
							return { entityTypeId: entityType._id };
						}
					);

					let newOfRefs = _.assign({}, this.props.track.references.ofRefs, {
						entityTypeIds: mappedEntityTypes,
						entity: {
							id: value.value,
							displayName: value.label,
							imageUrl: data.properties.imageUrl
						}
					});

					let newReferences = _.assign({}, this.props.track.references, {
						ofRefs: newOfRefs
					});

					let newTrack = _.assign({}, this.props.track, {
						references: newReferences
					});

					this.updateTrack(newTrack);
				});
			} else {
				this.setState({
					ofRefs: _.assign({}, this.state.ofRefs, {
						activeEntityId: null
					})
				});
			}
		} else if (refType == "by") {
			if (!_.isEmpty(value)) {
				this.setState({
					byRefs: _.assign({}, this.state.byRefs, {
						activeEntityId: value.value
					})
				});

				this.props.getSingleEntity(value.value, data => {
					let mappedEntityTypes = _.map(
						this.state.byRefs.activeEntityTypes,
						entityType => {
							return { entityTypeId: entityType._id };
						}
					);

					let newByRefs = _.assign({}, this.props.track.references.byRefs, {
						entityTypeIds: mappedEntityTypes,
						entity: {
							id: value.value,
							displayName: value.label,
							imageUrl: data.properties.imageUrl
						}
					});

					let newReferences = _.assign({}, this.props.track.references, {
						byRefs: newByRefs
					});

					let newTrack = _.assign({}, this.props.track, {
						references: newReferences
					});

					this.updateTrack(newTrack);
				});
			} else {
				this.setState({
					byRefs: _.assign({}, this.state.byRefs, {
						activeEntityId: null
					})
				});
			}
		}
	};

	render() {
		let userInfo;

		if (this.props.track) {
			userInfo = _.filter(this.props.loadedUsers, user => {
				return user._id == this.props.track.createdBy;
			});
		}

		let entityType = this.props.getEntityType(
			this.props.track.references.rootEntityType
		);

		console.log("state: ", this.state);

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
								{entityType.genericProperties.displayName}
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

					{!entityType.genericProperties.hasOfRefs
						? this.renderCustomOfEditor(entityType)
						: ""}

					{entityType.genericProperties.hasOfRefs
						? this.renderSelectors("of")
						: ""}

					{entityType.genericProperties.hasByRefs
						? this.renderSelectors("by")
						: ""}

					<div className="track-details-description">
						<EditableText
							multiline
							minLines={2}
							maxLines={12}
							intent={Intent.DEFAULT}
							maxLength="500"
							placeholder={`Edit ${
								entityType.genericProperties.displayName
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
							<User userId={this.props.track.metadata.createdBy} />{" "}
							<span className="date-container">
								tagged {moment(this.props.track.metadata.createdAt).fromNow()}
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
			getRef,
			deleteTrack,
			updateTrack,
			getEntityType,
			getChildEntityType,
			searchEntities,
			getSingleEntity,
			searchTracks,
			optimisticTrackDelete
		})(TrackDetails)
	)
);
