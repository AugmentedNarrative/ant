//TODO refactor this.. :)
ant.charts.map = function (container, width, height) {
	this.scale = 200000;
	this.translate = [width / 2, height / 2];
	this.refCenter = [.5, .5];
	this.translate = [width * this.refCenter [0], height * this.refCenter [1]]; 
	this.center = 0;
	this.width = width;
	this.height = height;
	this.container = container;
	this.topology = {};
	this.features = {};
	this.rateById = d3.map ();
	this.svg = d3.select (container).append ("svg").attr ("width", width).attr ("height", height); 
	this.topologies = {};
	this.projection = d3.geo.mercator ();
	this.redraw = function (topo, quantifier, plot) {
		if (!topo) {
			for (t in this.topologies) {
				this.redraw (t, quantifier, plot);
			}
			return;
		}
		this.topologies[topo].redraw (quantifier, plot);
	}
	this.setScaleAndCenter = function (s, c) {
		this.scale = s;
		this.center = c;
		this.redraw ();
	}
	this.setScale = function (s) {
		this.scale = s;
		this.redraw ();
	}
	this.setCenter = function (c) {
		this.center = c;
		this.redraw ();
	}
	this.getPath = function () {
		if (!this.center) throw "No center defined";
		//TODO accomodate the lack of center coordinate.
		this.projection
			.scale(this.scale)
			.rotate ([-this.center.lon, 0])
			.center ([0, this.center.lat])
			.translate (this.translate);

		return d3.geo.path ().projection (this.projection);
	}
	this.getArc = function () {
		return d3.geo.greatArc().precision(3);
	}
	/*
	this.lineConnectElements = function (elmA, elmB) {
		var path = this.getPath ();
		var arc = this.getArc ();
		var a = d3.select(elmA);

		var centroidA = path.centroid (a.datum ());
		var b = d3.select (elmB);
		var centroidB = path.centroid (b.datum ())
		var links = [];

		links.push ({"source": path.projection().invert (centroidA), "target": path.projection ().invert (centroidB)});
		var layer = this.svg.append ("g").attr ("class", "lineLayer");
		layer.append ("path")
			.data (links)
			.attr ("d", function (x) { return path(arc (x)); })
			.attr ("vector-effect", "non-scaling-stroke")
			.style ({'stroke-width': 1, 'stroke': '#B10000', 'stroke-linejoin': 'round', 'fill': 'none'})
	},
	*/
	this.zoomSelector = null,
	this.zoomContext = 20,
	this.reZoom = function () {
		if (this.zoomSelector != null) {
			this.zoomTo (this.zoomSelector, this.zoomContext);
		}
	},
	this.removeClass = function (selector, cls) { 
		this.svg.selectAll (selector).classed (cls, false);
	},
	this.addClass = function (selector, cls) { 
		this.svg.selectAll (selector).classed (cls, true);
	}
	this.zoomTo = function (selector, context) {
		if (!context) context = this.context 
		var e = d3.select (selector);
		if (!e) throw "No element found: " + selector;
		this.zoomSelector = selector;
		this.zoomContext = context;
		var path = this.getPath ();
		var width = this.width;
		var height = this.height;
		var bounds = path.bounds(e.datum ()),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			scale = (context / 100) / Math.max(dx / width, dy / height),
			translate = [width * this.refCenter [0] - scale * x, height * this.refCenter [1] - scale * y];

		this.svg
			.selectAll ("path")
			.attr ("transform", "translate(" + translate + ")scale(" + scale + ")");
		this.svg
			.selectAll ("text")
			.attr ("transform", "translate(" + translate + ")scale(" + scale + ")");
		this.svg
			.selectAll ("circle")
			.attr ("transform", "translate(" + translate + ")scale(" + scale + ")")
	}
	this.addFeatures = function (topo, collection, key, quantifier, plot) {
		if (!plot) plot = "lines"
		if (this.topologies [topo]) throw "A topology " + topo + " already exists.";
		if (collection && collection.objects) {
			var features = collection.objects [key];
			if (features) {
				this.svg.append ("g")
					.attr ("class", topo);
				this.topologies [topo] = new ant.charts.map.topology (this.svg, topo, this.getPath (), collection, features);
				this.redraw (topo, quantifier, plot);

				return this.topologies [topo];
			} else {
				throw "No Features found: (" + topo + ")" + key;
			}
		} else {
			throw "Empty features collections? " + topo;
		}
	}
};
ant.charts.map.topology = function (cont, name, path, t, f) {
	this.container = cont;
	this.name = name;
	this.topology = t;
	this.features = f;
	this.path = path;
	this.redraw = function (setId, quantifier, plot) {
		if (!plot) plot = "lines";
		this.container.select ("g." + this.name).selectAll ("text").remove ();
		var path = this.path;
		
		var qn = quantifier ? $.proxy (
				function (selector, d, plot) {  
					var attrs = quantifier.fn.apply (quantifier.context, [d, quantifier.args, quantifier.data])
					if (attrs) { 
						if (plot == "points") { 
							attrs.cx = path.centroid (d) [0];
							attrs.cy = path.centroid (d) [1];
						}
						if (attrs.text) {
							var xs = {"x": path.centroid (d)[0], "y": path.centroid (d)[1]};
							d3.select (selector.parentNode)
								.append ("svg:text")
								.attr (xs)
								.attr (attrs)
								.text (attrs.text);
						}
						// This section adds the data-* attributes returned from the quantifier to the element...!!! 
						// This allows the cascading of visualizations
						var data = attrs.data;
						attrs.data = null;
						selector.attr (attrs);
						if (data) { 
							for (var d in data) { 
								var val = data [d];
								if (val === Object (val)) { 
									val = JSON.stringify (val);
								}
								selector.attr ("data-" + d, val);
							}
						}
					}
				},
			quantifier) : function (selector, d) { selector.attr ("class", ""); };

		if (plot == "lines") {
			this.container.select ("g." + this.name).selectAll ("path")
				.data (topojson.feature (this.topology, this.features).features)
				.each (function (d) { qn (d3.select (this), d, plot); })
				.attr ("id", setId)
				.attr ("d", function (x) { return path (x); })
				.enter ()
				.append ("path")
				.on ("click", this.createCallback ("click"))
				.on ("mouseover", this.createCallback ("mouseover"))
				.on ("mouseout", this.createCallback ("mouseout"))
		}
		if (plot == "points") {
			this.container.select ("g." + this.name).selectAll ("circle")
				.data (topojson.feature (this.topology, this.features).features)
				.each (function (d) { qn (d3.select (this), d, plot); }) 
				.attr ("id", setId)
				.enter ()
				.append ("circle")
				.on ("click", this.createCallback ("click"))
				.on ("mouseover", this.createCallback ("mouseover"))
				.on ("mouseout", this.createCallback ("mouseout"))
		}
	}
	this.createCallback = function (type) {
		var me = this;
		return function () {
			var args = [];
			for (var a in arguments) {
				args.push (arguments [a]);
			}
			args.push (this);
			me.callback.apply (me, [type, args]);
		}
	}
	this.callbacks = {};
	this.on = function (ev, cb, scope) {
		if (!this.callbacks [ev]) {
			this.callbacks [ev] = [];
		}
		if (!scope) { scope = this; }
		this.callbacks [ev].push ({ scope: scope, callback: cb});	
	}
	this.removeCallback = function (ev, cb) {
		for (var x in this.callbacks [ev]) {
			if (this.callbacks [ev] [x].callback == cb) {
				this.callbacks [ev].splice (x, 1);
			}
		}
	}
	this.callback = function (ev, args) {
		if (!this.callbacks [ev]) return;
		for (cb in this.callbacks [ev]) {
			if (cb) { 
				var x = this.callbacks [ev][cb];	
				x.callback.apply (x.scope, args); 
			}
		}
	}
}
