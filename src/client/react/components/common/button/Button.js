import React, { Component } from "react";
import { connect } from "react-redux";
import ButtonBase from "material-ui/ButtonBase";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
	button: {
		padding: "12px 20px",
		borderRadius: "50px",
		background: "#000000",
		color: "#ffffff",
		fontSize: "14px",
		transition: "all .2s",
		border: "2px transparent solid",

		"&:hover": {
			border: "2px #FAFF00 solid"
		}
	}
});

class Button extends Component {
	render() {
		return (
			<ButtonBase focusRipple className={this.props.classes.button}>
				{this.props.children}
			</ButtonBase>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(Button));
