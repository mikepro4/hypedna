import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import update from "immutability-helper";
import qs from "qs";

const styles = theme => ({});

class OntologyEditor extends Component {
	render() {
		return <div>editor lol: {this.props.selectedEntityTypeId}</div>;
	}
}

const mapStateToProps = state => ({
	selectedEntityTypeId: state.pageOntology.selectedEntityTypeId
});

export default withStyles(styles)(
	withRouter(connect(mapStateToProps, {})(OntologyEditor))
);
