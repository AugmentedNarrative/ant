function Scenify (selector) {
	this.selector = selector;
	this.controller = new ScrollMagic.Controller ();
	this.callbacks = {
		scene: { progress: [], enter: [], leave: [] }
	};
	this.scenes = {};
	this.highlightedElements = {};
	this.init ();
	return this;
}
//TODO Refactor and paramaterize this... 
Scenify.prototype = {
	constructor: Scenify,
	init: function () {
		$(this.selector).children ().each ($.proxy (function (index, child) {
			var sceneElement = $(child);
			var sceneData = sceneElement.data ();
			var hook = sceneData.scene_trigger ? sceneData.scene_trigger : 0.9;
			var scene = new ScrollMagic.Scene ({triggerElement: child, tweenChanges: true, duration: "100%"})
					.triggerHook (hook)
					.addTo (this.controller);
			$(sceneElement).addClass ("scene");

			scene.on ("enter", $.proxy (this.enterCallback, this));
			scene.on ("leave", $.proxy (this.leaveCallback, this));
			scene.on ("progress", $.proxy (this.progressCallback, this));
			this.scenes [sceneElement.attr ('id')] = scene;

		}, this));
		return this;
	},
	scrollTo: function (sel) { 
		this.controller.scrollTo (this.scenes [sel]);
	},
	progressCallback: function (ev) { 
		if (ev.type == "progress") {
			var elm = ev.target.triggerElement ();
			this.trigger ("scene_progress", [elm]);
		}
	},
	enterCallback: function (ev) { 
		var elm = ev.target.triggerElement ();
		this.trigger ("scene_enter", [elm]);
	},
	leaveCallback: function (ev) {
		var elm = ev.target.triggerElement ();
		this.trigger ("scene_leave", [elm]);
	},
	trigger: function (eventName, args) {
		for (c in this.callbacks [eventName]) {
			var cb = this.callbacks [eventName] [c];
			cb.apply (this, args);
		}
	},
	on: function (eventName, callback) {
		if (!this.callbacks [eventName]) this.callbacks [eventName] = [];
		this.callbacks [eventName].push (callback);
		return this;
	}
};
