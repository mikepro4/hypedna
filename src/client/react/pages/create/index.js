import React, { Component } from "react";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";
import { withStyles } from "material-ui/styles";
import VideoIcon from "material-ui-icons/Videocam";
import Menu, { MenuItem, MenuList } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";
import { withRouter } from "react-router-dom";

const styles = theme => ({
	active: {
		color: "#ff2018"
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
		console.log("here:", this.props);
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="route-page">
					<div>
						Sidebar:
						<MenuList>
							<MenuItem
								selected={this.props.location.pathname == "/create/video"}
								onClick={() => {
									this.props.history.push("/create/video");
								}}
							>
								<ListItemIcon>
									<VideoIcon />
								</ListItemIcon>
								<ListItemText inset primary="Video" />
							</MenuItem>

							<MenuItem
								selected={this.props.location.pathname == "/create/tag"}
								onClick={() => {
									this.props.history.push("/create/tag");
								}}
							>
								<ListItemIcon>
									<VideoIcon />
								</ListItemIcon>
								<ListItemText inset primary="Tag" />
							</MenuItem>

							<MenuItem
								selected={this.props.location.pathname == "/create/person"}
								onClick={() => {
									this.props.history.push("/create/person");
								}}
							>
								<ListItemIcon>
									<VideoIcon />
								</ListItemIcon>
								<ListItemText inset primary="Person" />
							</MenuItem>
						</MenuList>
					</div>
					<div>Content: {renderRoutes(this.props.route.routes)}</div>
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
