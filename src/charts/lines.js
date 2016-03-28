var asLines = function () {
	this.redraw  = function (d, quantifier) { 
		this.callbacks = {};
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
					var origY = rets [i].y;
					rets [i].y = 0;
					rets [i].x = pointDistance * i;
					rets [i].width = pointDistance;
					rets [i].height = cHeight; 

					var rect = container.insert ("rect", ":first-child")
						.on ("click", this.createCallback ("mouseover"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (rect, rets [i]);

					rets [i].y = origY;
					rets [i].cx = rets [i].x;
					rets [i].cy = rets [i].y;
					ys.push (rets [i].y);
					rs.push (rets [i].r);

					var circle = container.insert ("circle")
						.on ("click", this.createCallback ("mouseover"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (circle, rets [i]);
					if (rets [i].value) {
						var text = container.append("text").text (rets [i].value);
						this.setElementAttributes (text, rets [i]);
					}
					if (rets [i].label) {
						var text = container.append ("text").text (rets [i].label).classed ("label", true);
						var r = rets [i];
						r.y = cHeight; 
						this.setElementAttributes (text, rets [i]);
					}
					rets [i].y = null;
				//	$.extend (attrs, rets);
				}
				var x = function (d, e) { return pointDistance * e; };
				var y = function (d, e) { return ys [e]; };

				var line = container.insert ("path");
				var svgLine = d3.svg.line ().x (x).y (y);
				line.attr ("d", function (t) { return svgLine (ys) })
					.on ("click", this.createCallback ("mouseover"));
				this.setElementAttributes (line, origAttrs);
				

				return attrs;
			}
		}

		var quantifierCb = this.quantifierCallback, me = this; 
		this.svg.selectAll ("g").remove (); //HACK lets see later how to UPDATE them the elements instead of just removing all... 
		for (var i in lines) { 
			var line = lines [i];
			var bar = this.svg.append ("g")
				.on ("click", this.createCallback ("mouseover"))
				.on ("mouseover", this.createCallback ("mouseover"));
			var qn = quantifierCb.apply (this, [quantifier, after (bar, line.attrs)]); 
			qn.apply  (this, [bar, line.values]);  
			this.setElementAttributes (bar, line.attrs);
		}
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
