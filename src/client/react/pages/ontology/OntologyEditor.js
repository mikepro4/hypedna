import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

import {
	Classes,
	EditableText,
	Intent,
	NumericInput,
	Switch
} from "@blueprintjs/core";

import {
	loadAllEntityTypes,
	updateEntityType
} from "../../../redux/actions/pageEntityTypeActions";

const styles = theme => ({});

class OntologyEditor extends Component {
	state = {
		title: "",
		description: "",
		edited: false
	};

	handleTitleChange = title => {
		this.setState({
			title
		});
	};

	handleDescriptionChange = description => {
		this.setState({
			description
		});
	};

	handleFormSubmit = () => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.selectedEntityTypeId;
		});

		let newEntityType = _.assign({}, entityType[0], {
			genericProperties: {
				displayName: this.state.title,
				description: this.state.description
			}
		});

		this.props.updateEntityType(
			this.props.selectedEntityTypeId,
			newEntityType,
			() => {
				this.props.loadAllEntityTypes();
			}
		);
	};

	componentDidUpdate = (prevProps, prevState) => {
		let entityType = _.filter(this.props.allEntityTypes, entityType => {
			return entityType._id == this.props.selectedEntityTypeId;
		});

		if (entityType[0]) {
			if (
				!_.isEqual(
					prevState.title,
					entityType[0].genericProperties.displayName
				) &&
				!this.state.edited
			) {
				this.setState({
					title: entityType[0].genericProperties.displayName,
					description: entityType[0].genericProperties.description,
					edited: true
				});
			}
		}

		if (
			!_.isEqual(
				prevProps.selectedEntityTypeId,
				this.props.selectedEntityTypeId
			)
		) {
			this.setState({
				edited: false,
				description: ""
			});
		}
	};

	updateTitle = value => {
		console.log("confirm: ", value);
		this.handleFormSubmit();
	};

	updateDescription = value => {
		console.log("confirm: ", value);
		this.handleFormSubmit();
	};

	render() {
		return (
			<div className="ontology-editor-content">
				<div className="ontology-editor-header">
					<div className="header-left">
						<div className="entity-type-avatar">
							<img src="http://via.placeholder.com/200x200" />
						</div>
						<div className="entity-type-info">
							<div className="entity-type-info-element">
								<div>
									<EditableText
										intent={Intent.DEFAULT}
										maxLength="500"
										placeholder="Edit title..."
										selectAllOnFocus={true}
										value={this.state.title}
										confirmOnEnterKey="true"
										onChange={this.handleTitleChange}
										onConfirm={this.updateTitle}
									/>
								</div>
								<div>
									<EditableText
										intent={Intent.DEFAULT}
										maxLength="500"
										placeholder="Edit Description..."
										selectAllOnFocus={true}
										value={this.state.description}
										confirmOnEnterKey="true"
										onChange={this.handleDescriptionChange}
										onConfirm={this.updateDescription}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="header-right">
						<ul className="actions">
							<li>Delete Entity</li>
						</ul>
					</div>
				</div>
				<div className="ontology-editor-tabs-container">
					<div />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allEntityTypes: state.pageEntityType.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withStyles(styles)(
	withRouter(
		connect(mapStateToProps, { loadAllEntityTypes, updateEntityType })(
			OntologyEditor
		)
	)
);
