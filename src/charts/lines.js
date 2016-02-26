var asLines = function () {
	this.redraw  = function (d, quantifier) { 
		var data = d.data;
		d.scale.range ([this.height, 0]); // this comes from the prequantifier and it is used by the quantifier 
		var lines = [data]; //TODO verify if this works with a single line..
		if (data.nests == 2) {
			lines = data.items ();
		}
		var itemsMax = d3.max (lines, function (l) { return l.values.length; });
		var pointDistance = this.width / itemsMax;
		var height = this.height;

		var qn = quantifier ? $.proxy (
				function (selector, k, a, i) {  
					var qn = quantifier;
					var ys = [];
					for (var d in a) {
						var ret = qn.fn.apply (qn.context, [k, {key: d}, qn.args, qn.data]);
						ys.push (ret.y)
						ret.y = null;
						d3.select (selector).attr (ret);
					}
					var x = function (d, e) { return pointDistance * e; };
					var y = function (d, e) { return ys [e]; };
					var svgLine = d3.svg.line ().x (x).y (y)
					d3.select (selector).attr ("d", function (t) { return svgLine (t.values.items ());});

				},
			quantifier) : function (selector, d) { d3.select (selector).attr ("class", ""); };

		var bar = this.svg.selectAll ("path")
			.data (lines)
			.enter ()
			.append ("path")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.each (function (d, e) {  qn (this, d.key, d.values, e); })
		
		this.drawAxes (d.scale);
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
