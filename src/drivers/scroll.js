function Scenify (selector) {
	this.selector = selector;
	this.controller = new ScrollMagic.Controller ({addIndicators: false});
	this.controller.scrollTo (function (newpos) {
		window.scrollTo (0, newpos + 2);
	});
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
			var hook = sceneData.trigger_position ? sceneData.trigger_position : 0.15;
			var scene = new ScrollMagic.Scene ({triggerElement: child, tweenChanges: true, duration: sceneElement.height ()})
					.triggerHook (hook)
					//.addIndicators ()
					.addTo (this.controller);
			$(sceneElement).addClass ("scene");

			scene.on ("enter", $.proxy (this.enterCallback, this));
			scene.on ("leave", $.proxy (this.leaveCallback, this));
			scene.on ("progress", $.proxy (this.progressCallback, this));
			this.scenes [sceneElement.attr ('id')] = scene;
			//TODO this adds the scenes by id, make it so that we can access it by index too (for 'next' and 'prev' purposes) 

		}, this));
		return this;
	},
	scrollTo: function (sel) { 
		this.controller.scrollTo (this.scenes [sel]);
		this.trigger ("enter", this.scenes [sel]); //TODO Verify why I used enter and not scene_enter here... 
	},
	/*
	* Scroll to next and prev require the scenes to have id, otherwise it wont work
	* TODO: make it work without requiring id
	*/
	scrollToNext: function () { 
		var next = $(this.currentScene.triggerElement ()).next ()
		this.scrollTo (next.attr ('id'));
	},
	scrollToPrev: function () { 
		var prev = $(this.currentScene.triggerElement ()).prev ()
		this.scrollTo (prev.attr ('id'));
	},
	progressCallback: function (ev) { 
		if (ev.type == "progress") {
			var elm = ev.target.triggerElement ();
			this.trigger ("scene_progress", [elm, ev.progress]);
		}
	},
	enterCallback: function (ev) { 
		var elm = ev.target.triggerElement ();
		this.currentScene = ev.target;
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
