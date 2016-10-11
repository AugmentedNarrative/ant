//TODO refactor this.. :)
ant.charts.map = function (container, width, height) {
	this.scale = 1;
	this.translate = [width / 2, height / 2];
	this.refCenter = [.5, .5];
	this.translate = [width * this.refCenter [0], height * this.refCenter [1]]; 
	this.center = {lat: 34.5133, lon: -94.1629};
	this.width = width;
	this.height = height;
	this.container = container;
	this.topology = {};
	this.features = {};
	this.rateById = d3.map ();
	this.svg = d3.select (container).append ("svg").attr ("width", width).attr ("height", height); 
	this.topologies = {};
	this.projection = d3.geoMercator ();
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

		return d3.geoPath ().projection (this.projection);
	}
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
		if (!context) context = this.zoomContext 
		var e = this.svg.selectAll (selector);
		if (!e) throw "No element found: " + selector;
		this.zoomSelector = selector;
		this.zoomContext = context;
		var path = this.getPath ();
		var width = this.width;
		var height = this.height;
		var bounds = [], dx = [], dy = [], x = [], y = [];
		var bleft = [], bright = [], btop = [], bbottom = [];
		var dat = e.data ();
		for (var i in dat) { 
			var data = dat [i];
			var bn = path.bounds (data);
			bounds.push (bn);
			bleft.push (bn [0] [0]);
			btop.push (bn [0] [1]);
			bright.push (bn [1] [0]);
			bbottom.push (bn [1] [1]);
		}
		var minLeft = Math.min.apply (null, bleft), maxRight = Math.max.apply (null, bright), 
			minTop = Math.min.apply (null, btop), maxBottom = Math.max.apply (null, bbottom),
			height = maxBottom - minTop, width = maxRight - minLeft; 

		this.svg.attrs ({"viewBox": minLeft + " " + minTop + " " + width + " " + height});

	}
	this.addElement = function (tag, attrs) {
		var element = this.svg.append (tag); 
		element
			.on ("click", this.createCallback ("click"))
			.on ("mouseover", this.createCallback ("mouseover"));
		var data = attrs.data;
		attrs.data = null;
		element.attrs (attrs);
		if (data) { 
			for (var d in data) { 
				var val = data [d];
				if (val === Object (val)) { 
					val = JSON.stringify (val);
				}
				element.attr ("data-" + d, val);
			}
		}
	}
	this.addFeatures = function (topo, collection, key, quantifier, plot) {
		if (!plot) plot = "lines"
		if (this.topologies [topo]) throw "A topology " + topo + " already exists.";
		if (collection && collection.objects) {
			var features = collection.objects [key];
			if (features) {
				this.svg.append ("g")
					.attr ("class", topo);
				this.topologies [topo] = new ant.charts.map.topology (this, topo, collection, features);
				this.redraw (topo, quantifier, plot);

				return this.topologies [topo];
			} else {
				throw "No Features found: (" + topo + ")" + key;
			}
		} else {
			throw "Empty features collections? " + topo;
		}
	}
	/*
	* Duplicated code. TODO: refactor this:
	* TODO: Fix inheritance
	* TODO: refactor code
	*/
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
	return this;
};
ant.charts.map.topology = function (map,name, t, f) {
	this.plot = "lines";
	this.parentMap = map;
	this.name = name;
	this.topology = t;
	this.features = f;
	this.redraw = function (setId, quantifier, plot) {
		this.callbacks = {};
		if (!plot) plot = "lines";
		this.plot = plot;
		this.parentMap.svg.select ("g." + this.name).selectAll ("text").remove ();
		var path = this.parentMap.getPath ();
		var parentSvg = this.parentMap.svg;
		
		var qn = quantifier ? $.proxy (
				function (selector, d, plot) {  
					var attrs = quantifier.fn.apply (quantifier.context, [d, quantifier.args, quantifier.data])
					if (!attrs) attrs = {};
					if (plot == "points") { 
						attrs.cx = path.centroid (d) [0];
						attrs.cy = path.centroid (d) [1];
					}
					if (attrs.text) {
						//TODO add <text> to centroid.
					}
					// This section adds the data-* attributes returned from the quantifier to the element...!!! 
					// This allows the cascading of visualizations
					var data = attrs.data;
					attrs.data = null;
					attrs ["vector-effect"] = "non-scaling-stroke";
					selector.attrs (attrs);
					if (data) { 
						for (var d in data) { 
							var val = data [d];
							if (val === Object (val)) { 
								val = JSON.stringify (val);
							}
							selector.attr ("data-" + d, val);
						}
					}
				},
			quantifier) : function (selector, d) { };

		if (plot == "lines") {
			this.parentMap.svg.select ("g." + this.name).selectAll ("path")
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
			this.parentMap.svg.select ("g." + this.name).selectAll ("circle")
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
