var asPie = function () {
	this.redraw = function (d, quantifier) { 
		var data = d.data;
		d.scale.range ([0, 365]);
		var cb = this.quantifierCallback (quantifier, function () { console.log (arguments); });

		var g = this.svg.selectAll(".arc")
			.data(data.items ())
			.enter().append("g")
			.each (function (d, e) {  cb (this, d.key, d.values, e); })
			.attr("class", "arc");

	}
	return this;
}
ant.charts.pie = function (container, conf) { this.init (container, conf); }
asChart.call (ant.charts.pie.prototype);
asPie.call (ant.charts.pie.prototype);
