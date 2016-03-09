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

		var after = function (container) { 
			return function (rets) { 
				var ys = [], rs = [];
				var attrs = {};
				var cHeight = height;
				for (var i in rets) {
					rets [i].y = cHeight - rets [i].y;
					ys.push (rets [i].y);
					rs.push (rets [i].r);
					rets [i].x = pointDistance * i;
					rets [i].cx = rets [i].x;
					rets [i].cy = rets [i].y;
					container.append ("circle").attr (rets [i]);
					rets [i].y = null;
				//	$.extend (attrs, rets);
				}
				var x = function (d, e) { return pointDistance * e; };
				var y = function (d, e) { return ys [e]; };
				var svgLine = d3.svg.line ().x (x).y (y);
				attrs.d = function (t) { return svgLine (ys) };  
				

				return attrs;
			}
		}
		//var qn = this.quantifierCallback (quantifier, after);

		var bar = this.svg.selectAll ("g")
			.data (lines);

		bar.enter ().append ("g")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.on ("click", this.createCallback ("mouseover"))
			.on ("mouseover", this.createCallback ("mouseover"))
			.on ("mouseout", this.createCallback ("mouseout"));
		var quantifierCb = this.quantifierCallback; 
		bar.append ("path")
			.each (function (d, e) { 
				var qn = quantifierCb (quantifier, after (bar)); 
				qn (this, d.values, e);  
				var attrs = d.attrs;
				var data = attrs.data;
				attrs.data = null;
				d3.select (this).attr (d.attrs); 
				if (data) { 
					for (var d in data) { 
						var val = data [d];
						if (val === Object (val)) {
							val = JSON.stringify (val);
						}
						d3.select (this).attr ("data-" + d, val);
					}
				}
			})
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
