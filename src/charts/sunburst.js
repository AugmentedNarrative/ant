var asSunburst = function () {
	this.redraw = function (d, quantifier) {
		if (!d || !d.scale || !d.data) throw "no data, scale defined. they should be returned from the prequantifier {scale: d3.scaleLinear (), data: [...], children: function (a) { }, sum: function (a) { }}"; 

		var radius = Math.min(this.width, this.height) / 2;

		var xScale = d3.scaleLinear()
		    .range([0, 2 * Math.PI]);

		var yScale = d3.scaleLinear ()
		    .range([0, radius]);

		var partition = d3.partition();

		var arc = d3.arc()
			.startAngle (function(d) { return Math.max (0, Math.min (2 * Math.PI, xScale (d.x0))); })
			.endAngle (function(d) { return Math.max (0, Math.min (2 * Math.PI, xScale (d.x1))); })
			.innerRadius (function(d) { return Math.max (0, yScale (d.y0)); })
			.outerRadius (function(d) { return Math.max (0, yScale (d.y1)); });


		var attrsFn = function (me, qn, tween) { 
			return function (dx, e, xx) { 
				var elm = d3.select (xx [e]); // a "g" element
				var ret = qn.fn.apply (qn.context, [dx, qn.data, e, xx]);
				if (!ret) ret = {};

				var a = arc (dx);
				var path = elm.append ("path").attr ("d", a);
				me.setElementAttributes (elm, ret); 
				me.setElementAttributes (path, ret); 

				if (ret.label !== undefined) {
					var angle = (xScale (dx.x0 + (dx.x1 - dx.x0) / 2) - Math.PI / 2) / Math.PI * 180, 
					translate = yScale (dx.y0 + (dx.y1 - dx.y0) / 2);

					elm.classed ("hidelabel", (xScale (dx.x1 - dx.x0) < 0.03));

					// calculate the brightness of the fill color to determine if the label's own color should be brighter or darker
					var labelCls = "";
					if (ret.fill !== undefined) {
						var c = d3.color (ret.fill).rgb ();
						// ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000

						var idx = ((c.r * 299) + (c.g * 587) + (c.b * 114)) / 1000;
						labelCls = d3.scaleQuantize ().domain ([0, 255]).range (["brighter", "darker"])(idx) + " "+idx;
					}


					elm.append ("svg:text")
						.classed (labelCls, true)
						
						.attr ("transform", "rotate(" + angle + ")translate("+ translate +")rotate("+(angle > 90 ? 180 : 0)+")")
						.attr ("fill-rule", "evenodd")
						.selectAll ("tspan")
						.data (ret.label.split (" ").filter (function (x, i, m) { return x.length >= 3 || m.length == 1}))
						.enter ().append ("tspan")
							.text (function (word, x) { return word; })
							.attr ("x", 0)
							.attr ("text-anchor", "middle")
							.attr ("y", function (w, i) { return i + "em" })
				}
			}
		};
		
		partition (d.data)
		var clickFn = function (me, quantifier) {
			return function (d) { 
				if (!d.children) return;
				//var mFn = function (a) { if (a.data.key !== undefined) { return a.data.key; } },
				var mFn = function (a) { return a;  },
					//key = d.data.key,
					key = d,
					ancestors = d.ancestors ().map (mFn),
					par = d.parent;

				var lblTween = function (elm) {  
					return function (dx) {
						return function () {
							var angle = (xScale (dx.x0 + (dx.x1 - dx.x0) / 2) - Math.PI / 2) / Math.PI * 180, 
							translate = yScale (dx.y0 + (dx.y1 - dx.y0) / 2)

							//d3.select (elm)
							//	.classed ("hidelabel", (xScale (dx.x1 - dx.x0) < 0.03))

							return "rotate(" + angle + ")translate("+ translate +")rotate("+(angle > 90 ? 180 : 0)+")";

						}
					};
				}
				me.svg
					.transition ()
					.duration (2550)
					.selectAll ("g")
					.each (function (xd, xi, xe) { 
						var vis = true;
						if (xd) { 
							//vis = (xd.parent == par ||  ancestors.indexOf (xd.data.key) !== -1 || xd.ancestors ().map (mFn).indexOf (key) !== -1)
							vis = (!xd.parent ||ancestors.indexOf (xd) !== -1 || xd.ancestors ().map (mFn).indexOf (key) !== -1)
						}
						d3.select (this).style ("visibility", (vis ? "visible" : "hidden"));
						if (!vis) return;

						var tweenFn = function () {
							var xd = d3.interpolate(xScale.domain (), [d.x0, d.x1]),
							yd = d3.interpolate(yScale.domain (), [d.y0, 1]),
							yr = d3.interpolate(yScale.range (), [d.y0 ? 20 : 0, radius]);
							return function(t) { xScale.domain (xd(t)); yScale.domain (yd(t)).range (yr(t)); };
						}
						d3.select (this)
							.selectAll ("path")
							.transition ()
							.tween ("scale", tweenFn) 
							.attrTween ("d", function (d)  { return function () { return arc (d); } } ) 

						d3.select (this)
							.selectAll ("text")
							.transition ()
							.tween ("scale", tweenFn) 
							.attrTween ("transform", lblTween (this))
					});
			}
			
		}

		this.svg.append ("g")
			.attr ('transform', 'translate(' + this.width/2 + ',' + this.height/2 + ')')
			.selectAll ("path")
			.data (d.data.descendants ())
			.enter ().append ("g")
				.on ("click", this.createCallback ("click", clickFn (this, quantifier)))
				.on ("mouseover", this.createCallback ("mouseover"))
				.on ("mouseout", this.createEmptyCallback ("mouseout"))
				.each (attrsFn (this, quantifier))
	}
	return this;
}
ant.charts.sunburst = function (container, conf) { this.init (container,conf); }
asChart.call (ant.charts.sunburst.prototype);
asSunburst.call (ant.charts.sunburst.prototype);
