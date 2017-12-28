import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";
import { withStyles } from "material-ui/styles";
import VideoIcon from "material-ui-icons/Videocam";
import LabelIcon from "material-ui-icons/Label";
import PersonIcon from "material-ui-icons/Person";
import Menu, { MenuItem, MenuList } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import { IndexLink } from "react-router";

const styles = theme => ({
	selected: {
		"&, &:hover, &:active, &:focus": {
			color: "#ff2018",
			background: "#F7F7F7"
		}
	},

	menuItemLabel: {
		margin: "0 0 0 10px"
	}
});

class CreatePage extends Component {
	renderHead = () => (
		<Helmet>
			<title>Create Content</title>
			<meta property="og:title" content="Create page" />
		</Helmet>
	);
	render() {
		const CREATE_VIDEO_URL = "/create/video";
		const CREATE_TAG_URL = "/create/tag";
		const CREATE_PERSON_URL = "/create/person";

		const { pathname } = this.props.location;
		const { history, classes } = this.props;

		return (
			<div className="route-content">
				<div className="small-sidebar">
					<h3
						style={{
							fontSize: "24px",
							fontWeight: 600
						}}
					>
						Create Content
					</h3>
					<p
						style={{
							fontSize: "14px",
							margin: "4px 0 15px 0",
							opacity: "0.4"
						}}
					>
						Select what kind of content you want to add
					</p>
					<MenuList>
						<MenuItem
							classes={{
								selected: this.props.classes.selected
							}}
							selected={pathname == CREATE_VIDEO_URL}
							onClick={() => {
								history.push(CREATE_VIDEO_URL);
							}}
						>
							<VideoIcon />
							<span className={classes.menuItemLabel}>Video</span>
						</MenuItem>

						<MenuItem
							classes={{
								selected: this.props.classes.selected
							}}
							selected={pathname == CREATE_TAG_URL}
							onClick={() => {
								history.push(CREATE_TAG_URL);
							}}
						>
							<LabelIcon /> <span className={classes.menuItemLabel}>Tag</span>
						</MenuItem>

						<MenuItem
							classes={{
								selected: this.props.classes.selected
							}}
							selected={pathname == CREATE_PERSON_URL}
							onClick={() => {
								history.push(CREATE_PERSON_URL);
							}}
						>
							<PersonIcon />
							<span className={classes.menuItemLabel}>Person</span>
						</MenuItem>
					</MenuList>
				</div>
				<div className="content-area">
					{renderRoutes(this.props.route.routes)}
				</div>
			</div>
		);
	}
}

function mapStateToProps({}) {
	return {};
}

export default {
	component: connect(mapStateToProps)(
		withStyles(styles)(withRouter(CreatePage))
	)
};
