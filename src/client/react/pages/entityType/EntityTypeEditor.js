import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class EntityEditor extends Component {
	render() {
		return <div className="entity-editor">e editor</div>;
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(EntityEditor));
