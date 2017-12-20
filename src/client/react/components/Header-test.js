import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Button from "material-ui/Button";
import AccessAlarmIcon from "material-ui-icons/AccessAlarm";
import Menu, { MenuItem } from "material-ui/Menu";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "material-ui/Dialog";

const style = {
	background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
	borderRadius: 3,
	border: 0,
	color: "white",
	height: 48,
	padding: "0 30px",
	boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .30)"
};

class Header extends Component {
	state = {
		anchorEl: null,
		open: false,
		dialogOpen: false
	};

	handleMenuClick = event => {
		this.setState({ open: true, anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ open: false });
	};

	handleClickOpen = () => {
		this.setState({ dialogOpen: true });
	};

	handleClose = () => {
		this.setState({ dialogOpen: false });
	};
	render() {
		return (
			<nav>
				<Button
					raised
					color="accent"
					style={style}
					aria-owns={this.state.open ? "simple-menu" : null}
					aria-haspopup="true"
					onClick={this.handleClick}
				>
					Hello World
				</Button>
				<button onClick={this.handleMenuClick}>open </button>
				<i className="material-icons">face</i>
				<AccessAlarmIcon />
				header haha
				<Menu
					id="simple-menu"
					anchorEl={this.state.anchorEl}
					open={this.state.open}
					onClose={this.handleMenuClose}
				>
					<MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
					<MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
					<MenuItem onClick={this.handleMenuClose}>Logout</MenuItem>
				</Menu>
				<Button onClick={this.handleClickOpen}>Open alert dialog</Button>
				<Dialog
					open={this.state.dialogOpen}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Use Google's location service?"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Let Google help apps determine location. This means sending
							anonymous location data to Google, even when no apps are running.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Disagree
						</Button>
						<Button onClick={this.handleClose} color="primary" autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			</nav>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Header);
