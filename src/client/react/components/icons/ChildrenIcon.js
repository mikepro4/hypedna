import React, { Component } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import qs from "qs";

class ChildrenIcon extends Component {
	render() {
		return (
			<div className="svg-icon">
				<svg width="22px" height="16px" viewBox="0 0 22 16" version="1.1">
					<defs />
					<g id="Page-1" stroke="none">
						<g
							id="Artboard-17-Copy-5"
							transform="translate(-878.000000, -364.000000)"
						>
							<g id="Group-5" transform="translate(855.000000, 341.000000)">
								<path
									fill="#9179F2"
									d="M27.5,29 C28.3284271,29 29,29.6715729 29,30.5 C29,31.3284271 28.3284271,32 27.5,32 C26.6715729,32 26,31.3284271 26,30.5 C26,29.6715729 26.6715729,29 27.5,29 Z M33.5,29 L43.5,29 C44.3284271,29 45,29.6715729 45,30.5 C45,31.3284271 44.3284271,32 43.5,32 L33.5,32 C32.6715729,32 32,31.3284271 32,30.5 C32,29.6715729 32.6715729,29 33.5,29 Z M27.5,36 C28.3284271,36 29,36.6715729 29,37.5 C29,38.3284271 28.3284271,39 27.5,39 C26.6715729,39 26,38.3284271 26,37.5 C26,36.6715729 26.6715729,36 27.5,36 Z M33.5,36 L43.5,36 C44.3284271,36 45,36.6715729 45,37.5 C45,38.3284271 44.3284271,39 43.5,39 L33.5,39 C32.6715729,39 32,38.3284271 32,37.5 C32,36.6715729 32.6715729,36 33.5,36 Z M44,23 C44.5522847,23 45,23.4477153 45,24 C45,24.5522847 44.5522847,25 44,25 L28,25 C27.4477153,25 27,24.5522847 27,24 C27,23.4477153 27.4477153,23 28,23 L44,23 Z M24,23 C24.5522847,23 25,23.4477153 25,24 C25,24.5522847 24.5522847,25 24,25 C23.4477153,25 23,24.5522847 23,24 C23,23.4477153 23.4477153,23 24,23 Z"
									id="Combined-Shape"
								/>
							</g>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps, {})(ChildrenIcon));
