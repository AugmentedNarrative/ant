import {initParsers} from '../parsers/index'
export function elementInit(ant) {
	ant.element = new ant._element(ant);

	initParsers (ant);
}
export function elementsMixin(ant) {
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
	}
	ant.prototype._element = element;
}
