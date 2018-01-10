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
			// console.log(containerWIdth)
			const timesAmount = Math.floor(containerWIdth / 30 / 2);
			const timeInterval = Math.floor(this.props.duration / timesAmount);

			const secondsArray = Array.apply(null, {
				length: this.props.duration
			}).map(Number.call, Number);

			const filteredSeconds = _.filter(secondsArray, number => {
				return number % timeInterval === 0;
			});
			return filteredSeconds;
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
