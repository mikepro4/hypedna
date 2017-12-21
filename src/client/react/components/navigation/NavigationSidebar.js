import React, { Component } from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import HomeIcon from "material-ui-icons/Home";
import SearchIcon from "material-ui-icons/Search";
import LabelIcon from "material-ui-icons/Label";
import { Link } from "react-router-dom";

const styles = theme => ({
	linkItem: {
		"& > span": {
			flexDirection: "column"
		}
	},
	linkItemActive: {
		color: "#ff2017",
		"& > span": {
			flexDirection: "column"
		}
	},
	linkLabel: {
		fontSize: "10px",
		fontWeight: 400
	}
});

class NavigationSidebar extends Component {
	render() {
		console.log(this.props);
		return (
			<div className="navigation-sidebar">
				<ul className="sidebar-links">
					<li className="single-sidebar-link">
						<IconButton
							className={
								this.props.match.params.name === "home" &&
								this.props.match.params.isExact
									? this.props.classes.linkItem
									: this.props.classes.linkItemActive
							}
							aria-label="Home"
							component={Link}
							to="/"
						>
							<HomeIcon />
							<div className={this.props.classes.linkLabel}>Home</div>
						</IconButton>
					</li>

					<li className="single-sidebar-link">
						<IconButton
							className={this.props.classes.linkItem}
							aria-label="Search"
							component={Link}
							to="/search"
						>
							<SearchIcon />
							<div className={this.props.classes.linkLabel}>Search</div>
						</IconButton>
					</li>

					<li className="single-sidebar-link">
						<IconButton
							className={this.props.classes.linkItem}
							aria-label="Tags"
							component={Link}
							to="/tags"
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
