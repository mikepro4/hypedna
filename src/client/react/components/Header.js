import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Button from "material-ui/Button";

class Header extends Component {
	render() {
		return (
			<nav>
				<Button raised color="primary">
					Hello World
				</Button>
				header haha
			</nav>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Header);
