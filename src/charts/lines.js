var asLines = function () {
	this.redraw  = function (d, quantifier) { 
		if (!d || !d.scale) throw "no data or scale. Scale should be added in the prequantifier";
		this.callbacks = {};
		var data = d.data;

		this.svg.selectAll ("g").remove (); //HACK lets see later how to UPDATE the elements instead of just removing all... 
		var yAxis, xAxis, axisWidth = this.width, axisHeight = this.height;	
		if (d.scale && (d.scale.x || d.scale.y)) { 
			if (d.scale.x) {
				d.scale.x.range ([0, this.width]);
				xAxis = d3.svg.axis ().scale (d.scale.x).tickSize (axisHeight).orient ("bottom");
			}
			if (d.scale.y) {
				d.scale.y.range ([0, this.height]);
				yAxis = d3.svg.axis ().scale (d.scale.y).tickSize (axisWidth).orient ("left");
			}
		} else {
			d.scale.range ([0, this.height]); // this comes from the prequantifier and it is used by the quantifier 
			yAxis = d3.svg.axis().scale (d.scale).tickSize (axisWidth).orient ("left");
		}
		if (yAxis) {
			this.svg.append ("g").attr("class", "axis").attr ("transform", "translate("+parseInt(this.width+this.margin.left)+",0)").call (yAxis);
		}
		if (xAxis) {
			this.svg.append ("g").attr ("class", "axis").attr ("transform", "translate("+parseInt(this.margin.left)+",0)").call (xAxis);
		}


		var lines = data; //TODO verify if this works with a single line..
		if (data.nests == 2) {
			lines = data.items ();
		}
		var itemsMax = d3.max (lines, function (l) { return l.values.length; });
		var pointDistance = this.width / itemsMax;
		var height = this.height;

		var after = function (container, origAttrs) { 
			return function (orets, a) { 
				var ys = [], rs = [], origYs = [];
				var attrs = {};
				var cHeight = height;
				var rets = jQuery.extend({}, orets, true);
				for (var i in rets) {
					var origY = rets [i].y, origX = rets [i].x;
					rets [i].y = 0;
					rets [i].x = pointDistance * i;
					rets [i].width = pointDistance;
					rets [i].height = cHeight; 
					var rect = container.insert ("rect", ":first-child")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (rect, {data: rets [i]["data"], width: pointDistance, height: cHeight, x: rets [i].x - (pointDistance / 2), y: 0, "class": rets [i]["class"]});
					rect.classed ("background", true);

					rets [i].y = origY;
					rets [i].x = origX ? origX : rets [i].x;
					rets [i].cx = rets [i].x;
					rets [i].cy = rets [i].y;
					origYs.push (rets [i].y);
					if (origAttrs && origAttrs.closed && i == 0) {
						ys.push ({y: cHeight, x: rets [i].x});
					}
					if (origAttrs && origAttrs ["stepped"] == true) {
						ys.push ({y: rets [i].y, x: rets [i].x - (pointDistance / 2)});
						ys.push ({y: rets [i].y, x: rets [i].x});
						ys.push ({y: rets [i].y, x: rets [i].x + (pointDistance / 2)});
					} else {
						ys.push ({y: rets [i].y, x: rets [i].x});
					}
					rs.push (rets [i].r);

				}
				if (origAttrs && origAttrs.closed) {
					ys.push ({y: cHeight, x: rets [i].x});
				}
				var x = function (d, e) { return d.x; };
				var y = function (d, e) { return d.y; };
				var line = container.insert ("path");
				var svgLine = d3.svg.line ().x (x).y (y);
				line.attr ("d", function (t) { return svgLine (ys) })
					.on ("mouseover", this.createCallback ("mouseover"))
					.on ("click", this.createCallback ("click"));
				//this.setElementAttributes (line, {data: rets [i]["data"], "class": rets [i]["class"], "closed": rets [i].closed});
				if (origAttrs && origAttrs.closed) {
				}
				this.setElementAttributes (line, origAttrs);


				//FOREGROUND 	
				for (var i in rets) { 
					var attrs = {
						y: origYs [i] - (pointDistance / 2), 
						x: (pointDistance * i) - (pointDistance / 2), 
						width: pointDistance, 
						height: pointDistance, 
						data: rets [i].data,
						"class": rets [i]["class"]
					};
					var rect = container.append ("rect")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (rect, {y: rets [i].y, x: rets [i].x, width: rets [i].width, height: rets [i].height > 0 ? rets [i].height : 0, data: rets [i].data});
					rect.classed ("square", true);

					var col = container.append ("rect")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"));
					attrs.height = cHeight - attrs.y;
					attrs.height = attrs.height > 0 ? attrs.height : 0;
					this.setElementAttributes (col, attrs);
					col.classed ("column", true);

					var circle = container.insert ("circle")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"));
					this.setElementAttributes (circle, {"class": rets [i]["class"], cx: rets [i].x, cy: rets [i].y, r: rets [i].r, data: rets [i].data});
					if (rets [i].value) {
						var text = container.append("text").text (rets [i].value);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: rets [i].y});
						text.classed ("value", true);
					}
					if (rets [i].label) {
						var text = container.append ("text").text (rets [i].label);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: cHeight, "transform": "rotate(-90,"+ rets [i].x +","+ cHeight +")"});
						text.classed ("label", true);
					}
					if (rets [i].note) {
						var text = container.append ("text").text (rets [i].note);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: 10, "transform": "rotate(90,"+ rets [i].x+","+10+")"});
						text.classed ("note", true);

					}
				}

				return attrs;
			}
		}

		var quantifierCb = this.quantifierCallback, me = this; 
		

		for (var i in lines) { 
			var line = lines [i];
			var bar = this.svg.append ("g")
				.on ("click", this.createCallback ("mouseover"))
				.on ("mouseover", this.createCallback ("mouseover"));
			var qn = quantifierCb.apply (this, [quantifier, after (bar, line.attrs)]); 
			qn.apply  (this, [bar, line.values, null, line]);  
			this.setElementAttributes (bar, line.attrs);
		}
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
