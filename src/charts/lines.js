var asLines = function () {
	this.redraw  = function (d, quantifier) { 
		var data = d.data;
		d.scale.range ([this.height, 0]); // this comes from the prequantifier and it is used by the quantifier 
		var lines = data; //TODO verify if this works with a single line..
		if (data.nests == 2) {
			lines = data.items ();
		}
		var itemsMax = d3.max (lines, function (l) { return l.values.length; });
		var pointDistance = this.width / itemsMax;
		var height = this.height;

		var after = function (rets) { 
			var ys = [];
			var attrs = {};
			for (var i in rets) {
				ys.push (rets [i].y);
				rets [i].y = null;
				$.extend (attrs, rets);
			}
			var cHeight = height;
			var x = function (d, e) { return pointDistance * e; };
			var y = function (d, e) { return cHeight - ys [e]; };
			var svgLine = d3.svg.line ().x (x).y (y);
			attrs.d = function (t) { return svgLine (ys) };  
			return attrs;
		}
		var qn = this.quantifierCallback (quantifier, after);
		this.svg.selectAll ("path")
			.data (lines)
			.enter ()
			.append ("path")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.each (function (d, e) {  qn (this, d.values, e); })
		/*
		var bar = this.svg.selectAll ("path")
			.data (lines)
			.enter ()
			.append ("path")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.each (function (d, e) {  qn (this, d, e); })
		*/
		
		//this.drawAxes (d.scale);
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
