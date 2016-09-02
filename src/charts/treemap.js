var asTreemap = function () {
	this.redraw = function (d, quantifier) {
	}
	return this;
}
ant.charts.treemap = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.treemap.prototype);
asTreemap.call (ant.charts.treemap.prototype);
