function Chart (container, conf) {
	this.init ();
	return this;
}
var asChart = function () {
	this.updateSize = function () { 
		//console.log (rect.width - this.margin.left - this.margin.right);
		this.svg.attrs ({"width": "100%", "height": "100%"})
		var rect = this.container.node ().getBoundingClientRect ();

		this.realSvg = this.svg;
		this.realWidth = rect.width; 
		this.realHeight = rect.height;
		this.svg = this.svg.append ("g")
			.attr ("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")


		this.width = parseInt(rect.width)-parseInt(this.margin.left)-parseInt(this.margin.right);
		this.height = rect.height - this.margin.top - this.margin.bottom; 
	}
	this.quantifierCallback = function (quantifier, callback, innerCallback) {
		if (quantifier) {
			// this generates a callback that gives us the chance to edit every attribute in the chart element, and edit it with the users' values (class, degrees, x, y, etc).
			return function (selector, a, i, args) {  
				var qn = quantifier, attrs;
				if (Array.isArray(a)) { //no objects please, only arrays.
					var rets = [];
					// this is for a nested collection. It only supports the first two dimensions. AFAIK. 
					var fns = [];
					if (!i) { 
						for (var d in a) { 
							fns.push (a [d]);
						}
					} else {
						fns.push (a [i]);
					}
					for (var x in fns) { 
						var ret = qn.fn.apply (qn.context, [fns [x], qn.args, qn.data, args]); //calls the users' callback for every item. 
						if (innerCallback) { 
							ret = innerCallback.apply (this, [ret]); // calls charts' "inner" callback with users' input.
						}
						rets.push (ret);
					}
					attrs = callback.apply (this, [rets ]); // calls charts' normal callback with the collected return values from the inner callback;
				} else if (callback) {
					var ret = qn.fn.apply (qn.context, [a, qn.args, qn.data]);
					attrs = callback.apply (this, [ret]); 
				} else {
					attrs = qn.fn.apply (qn.context [a, qn.args, qn.data]);
				}
				this.setElementAttributes (selector, attrs);
			}
		}
		return function (selector, d) { d3.select (selector).attr ("class", ""); };
	}
	this.setElementAttributes = function (element, oattrs) {
		//var attrs =  jQuery.extend ({}, oattrs, true), data;
		var attrs = oattrs, data;
		if (attrs) { 
			if (attrs.height < 0) attrs.height = 0;
			if (attrs.data) {
				data = attrs.data;	
				attrs.data = null;
			}
			element.attrs (attrs);
		}
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
	this.init = function (container, conf) {
		this.conf = conf;
		this.container = d3.select ("#" + container);
		this.margin = conf.margin ? conf.margin : {top: 10, right: 20, bottom: 10, left: 20};
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
	this.createEmptyCallback = function (type) {
		return function () {
			d3.event.stopPropagation ();
		}
	}
	this.createCallback = function (type) {
		var me = this;
		return function () {
			d3.event.stopPropagation ();
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
