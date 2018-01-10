import React, { PropTypes } from "react";
import _ from "lodash";
import classNames from "classnames";
import { formatTime } from "../../../../utils/timeFormatter";

export default class Timeline extends React.Component {
	handleResize = () => {
		this.forceUpdate();
	};

	componentDidMount() {
		window.addEventListener("resize", this.handleResize);
		setTimeout(() => {
			this.forceUpdate();
		}, 1);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}

	getTimeline() {
		if (this.refs.timeline) {
			const containerWIdth = this.refs.timeline.getBoundingClientRect().width;
			const timesAmount = containerWIdth / 45;
			const timeInterval = this.props.duration / timesAmount;

			let betterSecondsArray = [0];

			for (let i = 0; i < timesAmount - 2; i++) {
				betterSecondsArray.push(betterSecondsArray[i] + timeInterval);
			}

			return betterSecondsArray;
		}
	}

	render() {
		let times = "";

		const timeArray = this.getTimeline();

		let rangeCLases = classNames({
			range: true
		});

		if (!_.isEmpty(timeArray)) {
			times = timeArray.map((time, i) => {
				return (
					<li className="time" key={i}>
						<span>{formatTime(time)}</span>
					</li>
				);
			});
		}

		return (
			<div className="timeline-container" ref="timeline">
				<ul className="time-list">{times}</ul>
			</div>
		);
	}
}
