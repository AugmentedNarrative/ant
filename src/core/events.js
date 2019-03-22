import { DomEventsMixin } from './events/dom'
export function eventsInit(ant) {
	ant.events = new ant._events(ant);
}
export function eventsMixin(ant) { 
	ant.prototype.emit = function (event, args) {
		console.log (arguments);
	}
	ant.prototype.on = function(event, fn) {
	}
	ant.prototype.off = function() {
	}

	let events = function (ant) {
		this.ant = ant;
	}
	events.prototype.connect = function () { 
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			document.addEventListener ("DOMContentLoaded", this.ant.events.getHandler(this.ant.events.Ready))
		}
	}
	events.prototype.getHandler = function (fn) { 
		var ant = this.ant;
		return function (event) { 
			ant.element.parse(event.target)
			fn.apply(ant, [event]);
		}
	}
	
	events.prototype.Ready = function (ev) {
		//TODO: parse elements with ant-onload, download data defined in options, etc.
		for (let elm of document.querySelectorAll ('[ant-onload]')) {
			this.element.parse(elm);
		}
	}

	ant.prototype._events = events;


}
