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
					if (origAttrs && origAttrs ["stepped"] == true) {
						ys.push ({y: rets [i].y, x: rets [i].x - (pointDistance / 2)});
						ys.push ({y: rets [i].y, x: rets [i].x});
						ys.push ({y: rets [i].y, x: rets [i].x + (pointDistance / 2)});
					} else {
						ys.push ({y: rets [i].y, x: rets [i].x});
					}
					rs.push (rets [i].r);

					var circle = container.insert ("circle")
						.on ("click", this.createCallback ("mouseover"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (circle, rets [i]);
					if (rets [i].value) {
						var text = container.append("text").text (rets [i].value);
						this.setElementAttributes (text, rets [i]);
						text.classed ("value", true);
					}
					if (rets [i].label) {
						var text = container.append ("text").text (rets [i].label);
						var r = rets [i];
						r.y = cHeight; 
						this.setElementAttributes (text, r);
						text.classed ("label", true);
					}
					if (rets [i].note) {
						var text = container.append ("text").text (rets [i].note);
						var r = rets [i];
						r.y = 0;
						this.setElementAttributes (text, r);
						text.classed ("note", true);

					}
					rets [i].y = null;
				//	$.extend (attrs, rets);
				}
				var x = function (d, e) { return ys [e].x; };
				var y = function (d, e) { return ys [e].y; };

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
