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

		var after = function (container, origAttrs) { 
			return function (rets, a) { 
				var ys = [], rs = [];
				var attrs = {};
				var cHeight = height;
				for (var i in rets) {
					var origY = cHeight - rets [i].y;
					rets [i].y = 0;
					rets [i].x = pointDistance * i;
					rets [i].width = pointDistance;
					rets [i].height = cHeight; 

					var rect = container.insert ("rect", ":first-child")
						.on ("click", this.createCallback ("mouseover"))
						.on ("mouseover", this.createCallback ("mouseover"))
						.on ("mouseout", this.createCallback ("mouseout"));
					this.setElementAttributes (rect, rets [i]);

					rets [i].y = origY;
					rets [i].cx = rets [i].x;
					rets [i].cy = rets [i].y;
					ys.push (rets [i].y);
					rs.push (rets [i].r);

					var circle = container.insert ("circle")
						.on ("click", this.createCallback ("mouseover"))
						.on ("mouseover", this.createCallback ("mouseover"))
						.on ("mouseout", this.createCallback ("mouseout"));
					this.setElementAttributes (circle, rets [i]);
					rets [i].y = null;
				//	$.extend (attrs, rets);
				}
				var x = function (d, e) { return pointDistance * e; };
				var y = function (d, e) { return ys [e]; };

				var line = container.insert ("path");
				var svgLine = d3.svg.line ().x (x).y (y);
				line.attr ("d", function (t) { return svgLine (ys) });
				this.setElementAttributes (line, origAttrs);
				

				return attrs;
			}
		}

		var bar = this.svg.selectAll ("g")
			.data (lines);
		var quantifierCb = this.quantifierCallback, me = this; 

		bar.enter ().append ("g")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.each (function (d, e) { 
				var data, attrs = d.attrs;
				var qn = quantifierCb.apply (me, [quantifier, after (bar, attrs)]); 
				qn.apply  (me, [this, d.values, e]);  
				me.setElementAttributes (d3.select (this), attrs);
			})
			.on ("click", this.createCallback ("mouseover"))
			.on ("mouseover", this.createCallback ("mouseover"))
			.on ("mouseout", this.createCallback ("mouseout"));

	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
