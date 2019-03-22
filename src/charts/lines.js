var asLines = function () {
	this.redraw  = function (d, quantifier) { 
		if (!d || !d.scale || !d.data) throw "no data or scale. Scale should be added in the prequantifier";
		this.callbacks = {};
		var data = d.data;
	
		this.svg.selectAll ("g").remove (); //HACK lets see later how to UPDATE the elements instead of just removing all... 
		var yAxis, xAxis;
		if (d.scale && (d.scale.x || d.scale.y)) { 
			if (d.scale.x) {
				d.scale.x.range ([0, this.width]);
				xAxis = d3.axisBottom (d.scale.x).tickSize (this.height);
			}
			if (d.scale.y) {
				d.scale.y.range ([0, this.height]);
				yAxis = d3.axisLeft (d.scale.y).tickSize (this.width);
			}
		} else {
			d.scale.range ([0, this.height]); // this comes from the prequantifier and it is used by the quantifier 
			yAxis = d3.axisLeft (d.scale).tickSize (this.width);
		}

		if (xAxis) { 
			this.svg.append ("g").classed ("axis", true).call (xAxis). attr ("transform", "translate(0,0)");
		}
		this.svg.append ("g").classed ("axis", true).call (yAxis).attr ("transform", "translate("+ this.width  +",0)");
	
		var lines = data; //TODO verify if this works with a single line..
		if (data.nests == 2) {
			lines = data.items ();
		}
		var itemsMax = d3.max (lines, function (l) { return l.values.length; });
		var pointDistance = this.width / itemsMax;
		var height = this.height;

		var after = function (container, bgLayer, origAttrs) { 
			return function (rets, a) {
				var ys = [], rs = [], origYs = [];
				var bgCont = bgLayer.insert ("g").classed ("background", true);
				var colCont = container.insert ("g").classed ("column", true);
				var cirCont = container.insert ("g").classed ("circle", true);
				var linesCont = container.insert ("g").classed ("lines", true);
	
				for (var i in rets) {
					var origY = rets [i].y, origX = rets [i].x, bgX = pointDistance * i;
					rets [i].y = 0;
					rets [i].x = pointDistance * i;
					rets [i].width = pointDistance;
					rets [i].height = height; 

					var rect = bgCont.insert ("rect", ":first-child")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"))
						.on ("mouseout", this.createEmptyCallback ("mouseout"));
					this.setElementAttributes (rect, {data: rets [i]["data"], width: pointDistance, height: height, x: bgX, y: 0, "class": rets [i]["class"]});

					rets [i].y = origY;
					rets [i].x = origX ? origX : rets [i].x;
					rets [i].cx = rets [i].x;
					rets [i].cy = rets [i].y;
					if (origAttrs && origAttrs.closed && i == 0) {
						ys.push ({y: height, x: rets [i].x});
					}
					if (origAttrs && origAttrs ["stepped"] == true) {
						ys.push ({y: rets [i].y, x: rets [i].x});
						ys.push ({y: rets [i].y, x: rets [i].x + pointDistance});
					} else {
						ys.push ({y: rets [i].y, x: rets [i].x});
					}
					rs.push (rets [i].r);

					//FOREGROUND

					var attrs = {
						y: rets [i].y, 
						x: rets [i].x, 
						width: pointDistance, 
						height: pointDistance, 
						data: rets [i].data,
						"class": rets [i]["class"]
					};
					var col = colCont.append ("rect")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"))
						.on ("mouseout", this.createEmptyCallback ("mouseout"));
					attrs.height = height - attrs.y;
					this.setElementAttributes (col, attrs);
					col.classed ("column", true);

					var circle = cirCont.insert ("circle")
						.on ("click", this.createCallback ("click"))
						.on ("mouseover", this.createCallback ("mouseover"))
						.on ("mouseout", this.createEmptyCallback ("mouseout"));
					this.setElementAttributes (circle, {"class": rets [i]["class"], cx: rets [i].x, cy: rets [i].y, r: rets [i].r, data: rets [i].data});
					if (rets [i].value) {
						var text = container.append("text").text (rets [i].value);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: rets [i].y});
						text.classed ("value", true);
					}
					if (rets [i].label) {
						var text = container.append ("text").text (rets [i].label);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: height, "transform": "rotate(-90,"+ rets [i].x +","+ height +")"});
						text.classed ("label", true);
					}
					if (rets [i].note) {
						var text = container.append ("text").text (rets [i].note);
						this.setElementAttributes (text, {"class": rets [i]["class"], x: rets [i].x, y: 0});
						text.classed ("note", true);

					}
					// line between points
					if (i > 0) {
						var points = [rets [(i-1)], rets [i]];
						var dir = "eq";
						if (rets [i].y < rets [(i-1)].y) dir = "down"; else if (rets [i].y > rets [(i-1)].y) dir = "up"; 
						this.setElementAttributes (linesCont.append ("path").attr ("d", function (t) { return d3.line ().x (function (a) { return a.x; }).y (function (a) { return a.y; }) (points); }), {"class": rets [i]["class"] + " " + dir, data: rets [i].data});
					}
				}
				if (origAttrs && origAttrs.closed) {
					ys.push ({y: height, x: rets [i].x});
				}
				var x = function (d, e) { return d.x; };
				var y = function (d, e) { return d.y; };
				var line = container.insert ("path");
				line.classed ("line", true);
				var svgLine = d3.line ().x (x).y (y);
				line.attr ("d", function (t) { return svgLine (ys) })
					.on ("mouseover", this.createCallback ("mouseover"))
					.on ("mouseout", this.createEmptyCallback ("mouseout"))
					.on ("click", this.createCallback ("click"));
				this.setElementAttributes (line, origAttrs);
			} 
		}; 

		var quantifierCb = this.quantifierCallback, me = this; 
		

		var bgCont = this.svg.append ("g").classed ("backgrounds", true);
		for (var i in lines) { 
			var line = lines [i];
			var bar = this.svg.append ("g")
				.on ("click", this.createCallback ("click"))
				.on ("mouseover", this.createCallback ("mouseover"))
				.on ("mouseout", this.createEmptyCallback ("mouseout"));
			var qn = quantifierCb.apply (this, [quantifier, after (bar, bgCont, line.attrs)]); 
			qn.apply  (this, [bar, line.values, null, line]);  
			if (line.attrs) {
				this.setElementAttributes (bar, {"class": line.attrs ["class"], "id": line.attrs ["id"]});
			}
		}
	}
	return this;
}
ant.charts.lines = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.lines.prototype);
asLines.call (ant.charts.lines.prototype);
