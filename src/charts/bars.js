var asBars = function () {
	this.redraw = function (d, quantifier) {
		var data = d.data;
		d.scale.range ([0, this.height]);

		var barWidth = this.width / data.length;
		var chartHeight = this.height;
		//TODO migrate this to the new quantifierCallback method
		var qn = quantifier ? $.proxy (
				function (selector, d) {  
					var attrs = quantifier.fn.apply (quantifier.context, [d, quantifier.args, quantifier.data])
					if (!attrs) throw "Quantifier did not respond";
					var height = attrs === Number (attrs) ? attrs : attrs.height;
					d3.select (selector).attr (attrs) 
						.attr ("y", chartHeight - height)
						.attr ("height", height + 1);
					if (!attrs.width) d3.select (selector).attr ("width", barWidth ); 
				},
			quantifier) : function (selector, d) { d3.select (selector).attr ("class", ""); };
		var margin = this.margin;
		this.svg.selectAll ("g").remove (); //HACK. Sucks. 
		var bar = this.svg.selectAll ("g")
			.data (data.items ());

		bar.enter ().append ("g")
			.attr ("transform", function (d, i) { return "translate(" + i * barWidth + ", " + margin.top + ")"; });	

		bar.append ("rect")
			.each (function (d) { qn (this, d); })
	}
	return this;
}
ant.charts.bars = function (container, conf) { this.init (container, conf); }
//charts.bars.prototype.constructor = asChart.init;
asChart.call (ant.charts.bars.prototype);
asBars.call (ant.charts.bars.prototype);
