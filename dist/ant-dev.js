(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Ant = factory());
}(this, function () { 'use strict';

	function eventsInit(ant) {
		ant.events = new ant._events(ant);
	}
	function eventsMixin(ant) { 
		ant.prototype.emit = function (event, args) {
			console.log (arguments);
		};
		ant.prototype.on = function(event, fn) {
		};
		ant.prototype.off = function() {
		};

		let events = function (ant) {
			this.ant = ant;
		};
		events.prototype.connect = function () { 
			if (typeof window !== 'undefined' && typeof document !== 'undefined') {
				document.addEventListener ("DOMContentLoaded", this.ant.events.getHandler(this.ant.events.Ready));
			}
		};
		events.prototype.getHandler = function (fn) { 
			var ant = this.ant;
			return function (event) { 
				ant.element.parse(event.target);
				fn.apply(ant, [event]);
			}
		};
		
		events.prototype.Ready = function (ev) {
			//TODO: parse elements with ant-onload, download data defined in options, etc.
			for (let elm of document.querySelectorAll ('[ant-onload]')) {
				this.element.parse(elm);
			}
		};

		ant.prototype._events = events;


	}

	function init (element) {
		let message = element.getAttribute ('ant-debug');
		console.log (message);
	}

	/* download.js */

	function init$1 (element) { 
		let id = element.getAttribute ("ant-download_id"), url = element.getAttribute("ant-download");
	}

	function initParsers (ant) {
		ant.element.registerHook ("ant-debug", init);	
		ant.element.registerHook ("ant-download", init$1);	

	}

	function elementInit(ant) {
		ant.element = new ant._element(ant);

		initParsers (ant);
	}
	function elementsMixin(ant) {
		function element (ant) {
			this.ant = ant;
		}
		element.prototype = {
			hooks: {},
			registerHook: function(hook, cb) { 
				if (!this.hooks[hook]) this.hooks[hook] = [];

				this.hooks[hook].push(cb);
			},
			callHook: function(hook, element) { 
				console.log (this.hooks);
				if (this.hooks && Object.keys(this.hooks).indexOf(hook) !== -1) { 
					for (var ix in this.hooks[hook]) { 
						this.hooks[hook][ix](element);
					}
				}
			},
			parse: function (element) {
				for (var x in element.attributes) {
					if (element.attributes[x].name && element.attributes[x].name.indexOf("ant-") === 0) {
						this.callHook (element.attributes[x].name, element);
					}
				}
			}
		};
		ant.prototype._element = element;
	}

	function initMixin (ant) {
		ant.prototype._init = function () {
			// TODO: connect events, parsers
			elementInit(this);
			eventsInit(this);


			this.events.connect();

		};
	}

	function Ant (options) {
		if (!this instanceof Ant) {
			throw "Ant should be instantiated using the 'new' keyword"
			return;
		}
		this.options = options;

		this._init();
	}
	/*Ant.prototype = {
		constructor: Ant
	}*/

	initMixin(Ant);
	elementsMixin(Ant);
	eventsMixin(Ant);

	return Ant;

}));
