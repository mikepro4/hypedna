import React, { Component } from "react";
import { connect } from "react-redux";
import ButtonBase from "material-ui/ButtonBase";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";

const styles = theme => ({
	button: {
		padding: "0 15px",
		borderRadius: "50px",
		fontSize: "14px",
		transition: "all .1s",
		height: "40px",
		lineHeight: "20px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		"& > svg": {
			margin: "0 5px 0 0"
		}
	},
	buttonBlack: {
		background: "#000000",
		color: "#ffffff",

		"&:hover": {
			background: "#FAFF00",
			color: "#000000"
		}
	},
	buttonGrey: {
		background: "#f2f2f2",
		color: "#000000",

		"&:hover": {
			background: "#FAFF00",
			color: "#000000"
		}
	},
	buttonYellow: {
		background: "#FAFF00",
		color: "#000000",

		"&:hover": {
			background: "#F0F500"
		}
	},
	buttonIcon: {
		width: "40px",
		padding: "0",

		"& > svg": {
			margin: 0
		}
	},
	buttonLeftIcon: {
		paddingLeft: "10px"
	}
});

class Button extends Component {
	render() {
		let buttonClasses = classnames({
			[this.props.classes.button]: true,
			[this.props.classes.buttonBlack]: this.props.buttonBlack,
			[this.props.classes.buttonGrey]: this.props.buttonGrey,
			[this.props.classes.buttonYellow]: this.props.buttonYellow,
			[this.props.classes.buttonIcon]: this.props.buttonIcon,
			[this.props.classes.buttonLeftIcon]: this.props.buttonLeftIcon
		});

		return (
			<ButtonBase
				focusRipple
				onClick={this.props.onClick}
				className={buttonClasses}
			>
				{this.props.children}
			</ButtonBase>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(Button));
