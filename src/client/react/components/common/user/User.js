import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import qs from "qs";
import * as _ from "lodash";
import classNames from "classnames";

import { getUserInfo } from "../../../../redux/actions/appActions";

class User extends Component {
	componentDidMount = () => {
		let loadedUsers = _.filter(this.props.loadedUsers, user => {
			return user._id == this.props.userId;
		});

		if (loadedUsers.length == 0) {
			this.props.getUserInfo(this.props.userId, () => {
				window.dispatchEvent(new Event("resize"));
			});
		}
	};

	getUser = () => {
		let user = _.filter(this.props.loadedUsers, user => {
			return user._id == this.props.userId;
		});
		if (user[0]) {
			return user[0];
		}
	};

	render() {
		if (!this.getUser()) {
			return (
				<div className="user-container user-placeholder">
					<span className="user-avatar avatar-placeholder" />
					<span className="user-name name-placeholder" />
				</div>
			);
		} else {
			return (
				<div className="user-container">
					<img
						className="user-avatar"
						src={this.getUser().profile.photos[0].value}
					/>
					<span
						className="user-name"
						title={this.getUser().profile.displayName}
					>
						{this.getUser().profile.displayName}
					</span>
				</div>
			);
		}
	}
}

const mapStateToProps = state => ({
	loadedUsers: state.app.loadedUsers
});

export default withRouter(connect(mapStateToProps, { getUserInfo })(User));
