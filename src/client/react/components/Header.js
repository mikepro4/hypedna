import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Header extends Component {
	render() {
		return <nav>header haha</nav>;
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Header);
