import React, { PropTypes } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { searchEntities } from "../../../../redux/actions/pageOntologyActions";

class FilterHistogram extends React.Component {
	render() {
		return (
			<div className="filter-histogram-container">
				<div
					className="filter-histogram"
					style={{ width: this.props.current * 100 / this.props.total + "%" }}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

export default connect(mapStateToProps, {})(FilterHistogram);
