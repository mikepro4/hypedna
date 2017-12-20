import React, { Component } from "react";
import { connect } from "react-redux";

class Header extends Component {
	render() {
		return (
			<header className="app-header">
				<div className="logo">some logo</div>
				<div className="menu">some menu</div>
			</header>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Header);
