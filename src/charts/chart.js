function Chart (container, conf) {
	return this;
}
var asChart = function () {
	this.updateSize = function () { 
		var rect = this.container.node ().getBoundingClientRect ();
		this.width = rect.width - this.margin.left - this.margin.right;
		this.height = rect.height - this.margin.top - this.margin.bottom; 
		this.svg.attr ({"width": this.width + this.margin.left + this.margin.right, "height": this.height + this.margin.top + this.margin.bottom})
			.attr ("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
	}
	this.drawAxes = function (yScale) { 
		var yAxis = d3.svg.axis ()
				.scale (yScale)
				.orient ("right")
				.tickSize (this.width); 

		this.svg.selectAll ("g.axis").remove();
		var gy = this.svg.append ("g")
			.attr ("class", "y axis")
			.attr ("transform", "translate (0, " + this.margin.top + ")")
			.call (yAxis);

		gy.selectAll("text")
			.attr("x", 0)
			.attr("dy", -4);
	}
	this.quantifierCallback = function (quantifier, callback, innerCallback) {
		if (quantifier) {
			// this generates a callback that gives us the chance to edit every attribute in the chart element, and edit it with the users' values (class, degrees, x, y, etc).
			return function (selector, k, a, i) {  
				var qn = quantifier;
				var rets = [];
				if (a !== Object (a)) { //no objects please, only arrays.
					// this is for a nested collection. It only supports the first two dimensions. AFAIK. 
					for (var d in a) { 
						var ret = qn.fn.apply (qn.context, [k, {key: d}, qn.args, qn.data]); //calls the users' callback for every item. 
						if (innerCallback) rets.push (innerCallback.apply (this, [ret])); // calls charts' "inner" callback with users' input.
					}
					var attrs = callback.apply (this, [rets]); // calls charts' normal callback with the collected return values from the inner callback;
				} else if (callback) {
					var ret = qn.fn.apply (qn.context, [k, {key: d}, qn.args, qn.data]);
					var attrs = callback.apply (this, [ret]); 
				} else {
					var attrs = qn.fn.apply (qn.context [k, {key: d}, qn.args, qn.data]);
				}
				d3.select (selector).attr (attrs);
			}
		}
		return function (selector, d) { d3.select (selector).attr ("class", ""); };
	}
	this.init = function (container, conf) {
		this.conf = conf;
		this.container = d3.select ("#" + container);
		this.margin = conf.margin ? conf.margin : {top: 0, right: 0, bottom: 0, left: 0};
		this.svg = this.container.append ("svg");
		this.updateSize ();

		return this;
	}
	this.addClass = function (sel, cls) { 
		this.svg.selectAll (sel).classed (cls, true);
	}
	this.removeClass = function (sel, cls) { 
		this.svg.selectAll (sel).classed (cls, false);
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
	return this;
}
