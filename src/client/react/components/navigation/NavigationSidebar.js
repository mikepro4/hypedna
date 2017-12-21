import React, { Component } from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import HomeIcon from "material-ui-icons/Home";
import SearchIcon from "material-ui-icons/Search";
import LabelIcon from "material-ui-icons/Label";

const styles = theme => ({
	linkItem: {
		"& > span": {
			flexDirection: "column"
		}
	},
	linkLabel: {
		fontSize: "10px"
	}
});

class NavigationSidebar extends Component {
	render() {
		return (
			<div className="navigation-sidebar">
				<ul className="sidebar-links">
					<li className="single-sidebar-link">
						<IconButton
							className={this.props.classes.linkItem}
							aria-label="Home"
						>
							<HomeIcon />
							<div className={this.props.classes.linkLabel}>Home</div>
						</IconButton>
					</li>

					<li className="single-sidebar-link">
						<IconButton
							className={this.props.classes.linkItem}
							aria-label="Search"
						>
							<SearchIcon />
							<div className={this.props.classes.linkLabel}>Search</div>
						</IconButton>
					</li>

					<li className="single-sidebar-link">
						<IconButton
							className={this.props.classes.linkItem}
							aria-label="Tags"
						>
							<LabelIcon />
							<div className={this.props.classes.linkLabel}>Tags</div>
						</IconButton>
					</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(NavigationSidebar));
