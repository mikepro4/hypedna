import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import * as _ from "lodash";
import axios from "axios";

import { searchEntities } from "../../../redux/actions/pageOntologyActions";

let CancelToken = axios.CancelToken;
let cancel;

class UIKitPage extends Component {
	state = {
		inputValue: "",
		results: []
	};
	renderHead = () => (
		<Helmet>
			<title>UI Kit</title>
			<meta property="og:title" content="UI Kit" />
		</Helmet>
	);

	componentWillMount = () => {
		this.handleSearchDebounced = _.debounce(function() {
			this.getOptions();
		}, 250);
	};

	getOptions = () => {
		let criteria = {
			displayName: this.state.inputValue,
			entityType: "5a7e7c2cc69c80041b1ee8da"
		};
		if (cancel != undefined) {
			cancel();
		}

		axios
			.post(
				"api/search/entities",
				{
					criteria: criteria,
					sortProperty: "properties.displayName",
					offset: 0,
					limit: 20
				},
				{
					cancelToken: new CancelToken(function executor(c) {
						// An executor function receives a cancel function as a parameter
						cancel = c;
					})
				}
			)
			.then(result => {
				let options = result.data.all.map(entity => ({
					value: entity._id,
					label: entity.properties.displayName
				}));

				this.setState({
					results: options
				});
			});
	};

	handleChange = event => {
		// source.cancel("Operation canceled by the user.");
		this.setState({ inputValue: event.target.value }, () => {
			this.handleSearchDebounced();
		});
	};

	render() {
		return (
			<div className="route-content">
				{this.renderHead()}

				<div className="ui-kit-page-container">
					<input
						placeholder="entity name.."
						value={this.state.inputValue}
						onChange={this.handleChange}
					/>

					{this.state.results.map(result => {
						return <div key={result.value}>{result.label}</div>;
					})}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default {
	component: withRouter(connect(mapStateToProps, { searchEntities })(UIKitPage))
};
