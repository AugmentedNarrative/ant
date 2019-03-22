import {eventsInit } from './events'
import {elementInit } from './elements'
export function initMixin (ant) {
	ant.prototype._init = function () {
		// TODO: connect events, parsers
		elementInit(this);
		eventsInit(this);


		this.events.connect();

	}
}

