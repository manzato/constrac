// code copied (and slightly adjusted) from http://bl.ocks.org/tomerd/1499279
// Authorship belongs to Tomer Doron

export default class Gauge {
	constructor(placeholderName, configuration) {
		this.placeholderName = placeholderName;
		this.config = configuration;
		this.configure();
	}

	configure() {
		this.config.size = this.config.size * 0.9;

		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;

		this.config.min = this.config.min || 0;
		this.config.max = this.config.max || 100;
		this.config.range = this.config.max - this.config.min;

		this.config.majorTicks = this.config.majorTicks || 5;
		this.config.minorTicks = this.config.minorTicks || 2;

		this.config.greenColor 	= this.config.greenColor || "#109618";
		this.config.yellowColor = this.config.yellowColor || "#FF9900";
		this.config.redColor 	= this.config.redColor || "#DC3912";

		this.config.transitionDuration = this.config.transitionDuration || 500;
	}

	render() {
		const self = this;

		this.body = d3.select("#" + this.placeholderName)
			.append("svg:svg")
			.attr("class", "gauge")
			.attr("width", this.config.size)
			.attr("height", this.config.size);

		this.body.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", this.config.raduis)
			.style("fill", "#ccc")
			.style("stroke", "#000")
			.style("stroke-width", "0.5px");

		this.body.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", 0.9 * this.config.raduis)
			.style("fill", "#fff")
			.style("stroke", "#e0e0e0")
			.style("stroke-width", "2px");

		for (let index in this.config.greenZones) {
			this.drawBand(this.config.greenZones[index].from,
				this.config.greenZones[index].to,
				self.config.greenColor);
		}

		for (let index in this.config.yellowZones) {
			this.drawBand(this.config.yellowZones[index].from,
				this.config.yellowZones[index].to,
				self.config.yellowColor);
		}

		for (let index in this.config.redZones) {
			this.drawBand(this.config.redZones[index].from,
				this.config.redZones[index].to,
				self.config.redColor);
		}

		if (undefined != this.config.label) {
			const fontSize = Math.round(this.config.size / 9);
			this.body.append("svg:text")
				.attr("x", this.config.cx)
				.attr("y", this.config.cy / 2 + fontSize / 2)
				.attr("dy", fontSize / 2)
				.attr("text-anchor", "middle")
				.text(this.config.label)
				.style("font-size", fontSize + "px")
				.style("fill", "#333")
				.style("stroke-width", "0px");
		}

		const fontSize = Math.round(this.config.size / 16);
		const majorDelta = this.config.range / (this.config.majorTicks - 1);
		for (let major = this.config.min; major <= this.config.max; major += majorDelta) {
			const minorDelta = majorDelta / this.config.minorTicks;
			for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
				const point1 = this.valueToPoint(minor, 0.75);
				const point2 = this.valueToPoint(minor, 0.85);

				this.body.append("svg:line")
					.attr("x1", point1.x)
					.attr("y1", point1.y)
					.attr("x2", point2.x)
					.attr("y2", point2.y)
					.style("stroke", "#666")
					.style("stroke-width", "1px");
			}

			const point1 = this.valueToPoint(major, 0.7);
			const point2 = this.valueToPoint(major, 0.85);

			this.body.append("svg:line")
				.attr("x1", point1.x)
				.attr("y1", point1.y)
				.attr("x2", point2.x)
				.attr("y2", point2.y)
				.style("stroke", "#333")
				.style("stroke-width", "2px");

			if (major == this.config.min || major == this.config.max) {
				const point = this.valueToPoint(major, 0.63);

				this.body.append("svg:text")
					.attr("x", point.x)
					.attr("y", point.y)
					.attr("dy", fontSize / 3)
					.attr("text-anchor", major == this.config.min ? "start" : "end")
					.text(major)
					.style("font-size", fontSize + "px")
					.style("fill", "#333")
					.style("stroke-width", "0px");
			}
		}

		const pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

		const midValue = (this.config.min + this.config.max) / 2;

		const pointerPath = this.buildPointerPath(midValue);

		const pointerLine = d3.svg.line()
			.x(function(d) { return d.x })
			.y(function(d) { return d.y })
			.interpolate("basis");

		pointerContainer.selectAll("path")
			.data([pointerPath])
			.enter()
				.append("svg:path")
					.attr("d", pointerLine)
					.style("fill", "#dc3912")
					.style("stroke", "#c63310")
					.style("fill-opacity", 0.7)

		pointerContainer.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", 0.12 * this.config.raduis)
			.style("fill", "#4684EE")
			.style("stroke", "#666")
			.style("opacity", 1);

		const smallFontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text")
			.data([midValue])
			.enter()
				.append("svg:text")
					.attr("x", this.config.cx)
					.attr("y", this.config.size - this.config.cy / 4 - smallFontSize)
					.attr("dy", smallFontSize / 2)
					.attr("text-anchor", "middle")
					.style("font-size", smallFontSize + "px")
					.style("fill", "#000")
					.style("stroke-width", "0px");

		this.redraw(this.config.min, 0);
	}

	buildPointerPath(value) {
		const self = this;
		const delta = this.config.range / 13;
		const head = valueToPoint(value, 0.85);
		const head1 = valueToPoint(value - delta, 0.12);
		const head2 = valueToPoint(value + delta, 0.12);

		const tailValue = value - (this.config.range * (1/(270/360)) / 2);
		const tail = valueToPoint(tailValue, 0.28);
		const tail1 = valueToPoint(tailValue - delta, 0.12);
		const tail2 = valueToPoint(tailValue + delta, 0.12);


		return [head, head1, tail2, tail, tail1, head2, head];


		function valueToPoint(value, factor) {
			const point = self.valueToPoint(value, factor);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}

	drawBand(start, end, color) {
		if (0 >= end - start) {
			return;
		}
		const self = this;

		this.body.append("svg:path")
			.style("fill", color)
			.attr("d", d3.svg.arc()
				.startAngle(this.valueToRadians(start))
				.endAngle(this.valueToRadians(end))
				.innerRadius(0.65 * this.config.raduis)
				.outerRadius(0.85 * this.config.raduis))
			.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
	}

	redraw(value, transitionDuration) {
		const self = this;
		const pointerContainer = this.body.select(".pointerContainer");

		pointerContainer.selectAll("text").text(Math.round(value * 10)/10);

		const pointer = pointerContainer.selectAll("path");
		pointer.transition()
			.duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
			//.delay(0)
			//.ease("linear")
			//.attr("transform", function(d)
			.attrTween("transform", function() {
				let pointerValue = value;
				if (value > self.config.max) {
					pointerValue = self.config.max + 0.02*self.config.range;
				} else if (value < self.config.min) {
					pointerValue = self.config.min - 0.02*self.config.range;
				}
				const targetRotation = (self.valueToDegrees(pointerValue) - 90);
				const currentRotation = self._currentRotation || targetRotation;
				self._currentRotation = targetRotation;

			return function(step) {
				const rotation = currentRotation + (targetRotation-currentRotation)*step;
				return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
			}
		});
	}

	valueToDegrees(value) {
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
	}

	valueToRadians(value) {
		return this.valueToDegrees(value) * Math.PI / 180;
	}

	valueToPoint(value, factor) {
		return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
			y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value)) 		};
	}
}
