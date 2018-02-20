import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";
import classNames from "classnames";
import moment from "moment";

import { Classes, Spinner } from "@blueprintjs/core";

import { deleteEntity } from "../../../redux/actions/pageOntologyActions";

class EntityResult extends Component {
	state = {
		deleted: false
	};

	render() {
		if (this.state.deleted) {
			return "";
		} else {
			return (
				<div className="entity-result-container">
					<div className="entity-result-left">
						<div className="entity-avatar">
							<img src="http://via.placeholder.com/88x88" />
						</div>

						<div className="entity-result-description">
							<h1 className="entity-title">
								{this.props.entity.properties.displayName}
							</h1>
							<ul className="entity-metadata-list">
								<li className="entity-single-metadata-option">
									<span>{this.props.entity.properties.entityUrlName}</span>
								</li>

								{this.props.entity.properties.description ? (
									<li className="entity-single-metadata-option">
										<span>{this.props.entity.properties.description}</span>
									</li>
								) : (
									""
								)}

								<li className="entity-single-metadata-option">
									Added{" "}
									{moment(this.props.entity.properties.createdAt).fromNow()}
								</li>
							</ul>
						</div>
					</div>

					<div className="entity-result-right">
						<ul className="entity-result-actions">
							<li className="entity-single-result-action">
								<a className="anchor-button">
									<span className="pt-icon-standard pt-icon-edit" />
								</a>
							</li>
							<li className="entity-single-result-action">
								<a
									className="anchor-button"
									onClick={() =>
										this.props.deleteEntity(this.props.entity._id, () => {
											this.setState({
												deleted: true
											});
										})
									}
								>
									<span className="pt-icon-standard pt-icon-trash" />
								</a>
							</li>
							<li className="entity-single-result-action">
								<a className="anchor-button">
									<span className="pt-icon-standard pt-icon-chevron-right" />
								</a>
							</li>
						</ul>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps = state => ({
	form: state.form.entitySearchForm,
	allEntityTypes: state.pageOntology.allEntityTypes,
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId,
	entitySearchResults: state.pageOntology.entitySearchResults
});

export default withRouter(
	connect(mapStateToProps, {
		deleteEntity
	})(EntityResult)
);
