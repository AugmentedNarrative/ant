import { initMixin } from './core/init'
import { eventsMixin } from './core/events'
import { elementsMixin } from './core/elements'

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

initMixin(Ant)
elementsMixin(Ant)
eventsMixin(Ant)

export default Ant
