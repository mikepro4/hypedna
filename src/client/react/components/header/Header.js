import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import MenuIcon from "material-ui-icons/Menu";
import VideoIcon from "material-ui-icons/Videocam";
import LabelIcon from "material-ui-icons/Label";
import PersonIcon from "material-ui-icons/Person";
import Button from "../common/button/Button";
import { withStyles } from "material-ui/styles";
import Avatar from "material-ui/Avatar";
import Menu, { MenuItem, MenuList } from "material-ui/Menu";
import Popover from "material-ui/Popover";
import ButtonBase from "material-ui/ButtonBase";
import Tooltip from "material-ui/Tooltip";
import NotificationsIcon from "material-ui-icons/Notifications";
import AddCircleIcon from "material-ui-icons/AddCircle";
import { withRouter } from "react-router-dom";
import { ListItemIcon, ListItemText } from "material-ui/List";

import EntitySearchForm from "./EntitySearchForm";

import { resetForm } from "../../../redux/actions/appActions";

const styles = theme => ({
	avatar: {
		borderRadius: "50px",
		padding: 0,
		boxShadow: theme.shadows[0],
		transition: "all .15s",

		"&:hover": {
			boxShadow: theme.shadows[5]
		}
	},

	menu: {
		color: "#505050",
		"&:hover": {
			color: "#ffffff"
		}
	},

	icon: {
		margin: 0
	},

	menuText: {}
});

class Header extends Component {
	state = {
		left: false,
		anchorEl: null,
		userMenuOpen: false,
		createOpen: false
	};

	handleUserMenuOpen = event => {
		this.setState({ userMenuOpen: true, anchorEl: event.currentTarget });
	};

	handleCreateOpen = event => {
		this.setState({ createOpen: true, anchorEl: event.currentTarget });
	};

	handleCreateClose = () => {
		this.setState({ createOpen: false });
	};

	handleUserMenuClose = () => {
		this.setState({ userMenuOpen: false });
	};

	toggleDrawer = open => () => {
		this.setState({
			left: open
		});
	};

	handleCreateVideo = () => {
		this.handleCreateClose();
		this.props.history.push("/create/video");
	};

	handleCreateTag = () => {
		this.handleCreateClose();
		this.props.history.push("/create/tag");
	};

	handleCreatePerson = () => {
		this.handleCreateClose();
		this.props.history.push("/create/person");
	};

	handleLogout = () => {
		this.handleUserMenuClose();
		window.location = "/api/logout";
	};

	renderAuthButton() {
		return this.props.auth ? (
			<ul className="header-actions">
				<li>
					<Tooltip id="tooltip-usermenu" title="User Menu" placement="bottom">
						<ButtonBase
							focusRipple
							aria-haspopup="true"
							onClick={this.handleUserMenuOpen}
							className={this.props.classes.avatar}
						>
							<Avatar
								alt={this.props.auth.profile.displayName}
								src={this.props.auth.profile.photos[0].value}
								style={{ width: "30px", height: "30px" }}
							/>
						</ButtonBase>
					</Tooltip>

					<Popover
						open={this.state.userMenuOpen}
						anchorEl={this.state.anchorEl}
						onClose={this.handleUserMenuClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
					>
						<MenuList>
							<MenuItem onClick={this.handleUserMenuClose}>
								Menu Item 1
							</MenuItem>
							<MenuItem onClick={this.handleUserMenuClose}>
								Menu Item 2
							</MenuItem>
							<MenuItem onClick={this.handleLogout}>Logout</MenuItem>
						</MenuList>
					</Popover>
				</li>
			</ul>
		) : (
			<a href="/api/auth/google">
				<Button buttonBlack>Login with Google</Button>
			</a>
		);
	}

	handleSubmit = values => {
		if (!_.isEmpty(values.entityUrlName)) {
			this.props.history.push(`/${values.entityUrlName}?selectedTabId=1`);
			this.props.resetForm("mainEntitySearchForm");
		}
	};

	render() {
		return (
			<header className="app-header">
				<div className="header-left">
					<div className="app-menu">
						<IconButton aria-label="Menu" onClick={this.toggleDrawer(true)}>
							<MenuIcon className={this.props.classes.menu} />
						</IconButton>

						<Drawer open={this.state.left} onClose={this.toggleDrawer(false)}>
							<div
								tabIndex={0}
								role="button"
								onClick={this.toggleDrawer(false)}
								onKeyDown={this.toggleDrawer(false)}
								style={{ width: "300px" }}
							>
								something here
							</div>
						</Drawer>
					</div>
					<div
						className="app-logo"
						onClick={() => {
							this.props.history.push("/");
						}}
					>
						<svg width="100px" height="14px" viewBox="0 0 96 13" version="1.1">
							<g
								id="Page-1"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g
									id="Custom-Preset-Copy-27"
									transform="translate(-89.000000, -89.000000)"
									fill="#FFFFFF"
								>
									<g id="Group-13" transform="translate(89.000000, 89.000000)">
										<path
											d="M82.8034792,0.582518534 L78.1349154,12.1740725 L80.8770362,12.1740725 L82.7429154,7.54385669 L89.8887946,7.54443903 L88.0235597,12.1740725 L90.7663248,12.1740725 L95.4361772,0.582518534 L82.8034792,0.582518534 Z M83.6803651,5.21389902 L84.7228349,2.62479835 L91.870647,2.62479835 L90.8275329,5.21448136 L83.6803651,5.21389902 Z"
											id="Fill-1"
										/>
										<polygon
											id="Fill-2"
											points="78.1976054 0.582518534 75.0192966 8.47444213 70.2656859 0.582518534 68.3083168 0.582518534 63.639753 12.1740725 66.3825181 12.1740725 69.5601826 4.28389592 74.3144376 12.1740725 76.272451 12.1740725 80.9403705 0.582518534"
										/>
										<path
											d="M52.6679195,0.872727273 L48,12.4642812 L61.7418231,12.4642812 L64.6211788,5.31309898 L61.641313,0.872727273 L52.6679195,0.872727273 Z M51.5648859,10.4231661 L54.5879195,2.91500709 L59.9977157,2.91500709 L61.7779036,5.56641855 L59.8205345,10.4237484 L51.5648859,10.4231661 Z"
											id="Fill-3"
										/>
										<polygon
											id="Fill-4"
											points="45.2417074 0.600862364 38.4985128 4.79140857 35.1243383 0.600862364 33.2152913 0.600862364 28.5447946 12.2110513 31.2875597 12.2110513 34.6179221 3.93128673 37.890298 7.99546433 43.5227275 4.49616025 40.419157 12.2110513 43.1619221 12.2110513 47.8317745 0.600862364"
										/>
										<path
											d="M18.7238658,0.600862364 L14.055302,12.2110513 L16.7974228,12.2110513 L18.6684564,7.55812411 L25.8149799,7.55870645 L23.9445906,12.2110513 L26.6867114,12.2110513 L31.3559195,0.600862364 L18.7238658,0.600862364 Z M19.6052617,5.22874879 L20.646443,2.63964812 L27.7929664,2.63964812 L26.7517852,5.22933113 L19.6052617,5.22874879 Z"
											id="Fill-5"
										/>
										<path
											d="M14.1194738,0.600920599 L10.2743195,10.1484477 C7.86529933,10.1478654 1.45971544,10.1478654 1.28188993,10.1484477 L0.819285906,10.14903 L0.000386577184,12.1843217 L0.000386577184,12.2111096 L12.1865879,12.2111096 L16.8622389,0.600920599 L14.1194738,0.600920599 Z"
											id="Fill-6"
										/>
									</g>
								</g>
							</g>
						</svg>
					</div>

					<div className="search-placeholder">
						<EntitySearchForm
							ref="mainEntitySearchForm"
							enableReinitialize={true}
							onSubmit={this.handleSubmit.bind(this)}
							onChange={this.handleSubmit.bind(this)}
						/>
					</div>
				</div>

				<div className="header-right">
					<div className="menu">{this.renderAuthButton()}</div>
				</div>
			</header>
		);
	}
}

function mapStateToProps({ auth }) {
	return { auth };
}

export default connect(mapStateToProps, { resetForm })(
	withStyles(styles)(withRouter(Header))
);
