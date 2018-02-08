import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";

class ParentIcon extends Component {
	render() {
		return (
			<div className="svg-icon">
				<svg width="22px" height="18px">
					<g transform="translate(-469.000000, -364.000000)">
						<g id="Group-7" transform="translate(448.000000, 341.000000)">
							<path
								fill="#F55656"
								d="M42,32 C42.5522847,32 43,32.4477153 43,33 C43,33.5522847 42.5522847,34 42,34 L31,34 C30.4477153,34 30,33.5522847 30,33 C30,32.4477153 30.4477153,32 31,32 L42,32 Z M25,32 C25.5522847,32 26,32.4477153 26,33 C26,33.5522847 25.5522847,34 25,34 C24.4477153,34 24,33.5522847 24,33 C24,32.4477153 24.4477153,32 25,32 Z M23,23 C24.1045695,23 25,23.8954305 25,25 C25,26.1045695 24.1045695,27 23,27 C21.8954305,27 21,26.1045695 21,25 C21,23.8954305 21.8954305,23 23,23 Z M30,23 L41,23 C42.1045695,23 43,23.8954305 43,25 C43,26.1045695 42.1045695,27 41,27 L30,27 C28.8954305,27 28,26.1045695 28,25 C28,23.8954305 28.8954305,23 30,23 Z M42,39 C42.5522847,39 43,39.4477153 43,40 C43,40.5522847 42.5522847,41 42,41 L31,41 C30.4477153,41 30,40.5522847 30,40 C30,39.4477153 30.4477153,39 31,39 L42,39 Z M25,39 C25.5522847,39 26,39.4477153 26,40 C26,40.5522847 25.5522847,41 25,41 C24.4477153,41 24,40.5522847 24,40 C24,39.4477153 24.4477153,39 25,39 Z"
								id="Combined-Shape"
							/>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(ParentIcon));
