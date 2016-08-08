/*
* Augmented Narrative Toolkit
* Paola Villarreal, 2016.
* paw@paw.mx
*/


ant = {};
ant.charts = {};
/*
* Coordinator. 
* This object coordinates all the interactions in the layout. 
* Initializes the scrolls, the slides, carousels, charts (including maps)
*/
function Ant (conf) {
	this.conf = conf;
	this.charts = {};
	this.chartTypes = {};
	this.scroll = {};
	this.currentScene = null;
	this.currentElement = null;
	this.dataOrder = [];
	this.medium = {};
	this.slides = {};

	this.data = {};

	this.init ();
	return this;
}
Ant.prototype = {
	constructor: Ant,
	/*
	* Init.
	* Parses the configuration: the first task will be to download the data and then init the sliding, the scrolls and the controls.
	*/
	init: function () {
		// TODO define priorities
		if (this.conf.data) {
			var q = queue ();
			for (c in this.conf.data) {
				var d = this.conf.data [c];
				q.defer (d.type, d.url)
				this.dataOrder.push (d.id);
			}
			q.await ($.proxy (this.dataCallback, this));
		} else {
			this.dataCallback ();
		}
		this.initSlides ();
	},
	/*
	* dataCallback.
	* Receives the data in its arguments. 
	* Will initialize the maps and the charts.
	*/
	dataCallback: function () {
		this.initScroll ();
		this.initControls ();
		if (arguments.length > 0) {
			if (arguments [0]) {
				throw arguments [0];
			}
			for (var i = 1; i < arguments.length; i++) {
				var dataName = this.dataOrder [i-1];
				var conf = this.conf.data [dataName];
				if (conf) {
					var data = arguments [i];
					if (conf.processor) { 
						var ret = $.proxy (conf.processor, this) (arguments [i]);
						if (ret) { 
							data = ret;
						}
					}
					this.data [dataName] = data;
				}
			}
		}
		var cb = function (me) { 
			return function (a) {
				me.parseElement.apply (me, [this]);
			}
		}
		$("[data-onload]").each (cb (this));
		this.initCharts ();
	},
	/*
	* scrollProgress.
	* 
	*/
	scrollProgress: function (scene) {
	},
	scrollLeave: function (element) {
		//TODO test this code as it was migrated from this.maps to this.charts
		this.currentElement = null; 
		var data = $(element).data ();
		var controlMap = data ["control_map"];
		if (controlMap) {
			var onClickLayer = $(element).data ("map_click_layer");
			var onClick = $(element).data ("map_click");
			if (onClick && onClickLayer) {
				this.charts [controlMap].topologies [onClickLayer].removeCallback ("click", this.onClick);
			}
		}
		if (data.scroll_leave_parse) { 
			if (Array.isArray (data.scroll_leave_parse)) { 
				for (var x in data.scroll_leave_parse) { 
					this.parseElement (data.scroll_leave_parse [x], false);
				}
			}
			else {
				var me = this;
				$(data.scroll_leave_parse).each (function () { me.parseElement.apply (me, [$(this) [0]], false); });
			}
			
		}
	},
	scrollEnter: function (element) {
		$(element.parentNode).children ().removeClass ("highlight");
		$(element).addClass ("highlight");
		this.parseElement (element);
		$(element).find ("form[data-control]").change ();
		var data = $(element).data ();
		if (data.scroll_enter_parse) { 
			if (Array.isArray (data.scroll_enter_parse)) { 
				for (var x in data.scroll_enter_parse) { 
					this.parseElement (data.scroll_enter_parse [x], false);
				}
			}
			else {
				var me = this;
				$(data.scroll_enter_parse).each (function () { me.parseElement.apply (me, [$(this) [0]], false); });
			}
		}
	},
	/*
	* getCallback
	* returns the callback that will be used 
	*/
	getCallback: function (cbName) {
		if (this.conf.callbacks && this.conf.callbacks [cbName]) {
			return this.conf.callbacks [cbName]; 
		}
	},
	/*
	* parseElement
	*/
	parseElement: function (element) {
		if (!element) throw "There is no element";
		/* 
		* Lets see what we have here: data? should we quantify something?
		*/
		var data;
		if (typeof element === 'string' || element.tagName) { // this is a string or an HTMLElement (check compatibility with other browsers)
			var id = $(element).attr ("id");
			data = $(element).data ();
		} else { 
			id = element.id;
			data = element;
		}
		var quantify = data.quantify;
		var quantifier = data.quantifier;
		var qArgs = data.quantifier_args;
		var controlChart = !data.control_chart ? id : data.control_chart;
		if (controlChart) { 
			var chartType = this.chartType (controlChart); 
			/*
			* If we have to quantify, lets prequantify :)
			*/
			if (quantify && quantifier) {
				var qObj = {fn: quantifier, ar: qArgs};
				try {
					qObj.data = this.prequantify (qObj);
					if (!qObj.data) qObj.data = this.data [quantify];
					if (chartType == "lines" || chartType == "bars" || chartType == "pie" || chartType == "treemap") {
						this.quantifyChart (controlChart, qObj);
					}
					if (chartType == "map") {
						this.quantifyMap (controlChart, quantify, qObj);
					}
				} catch (e) { console.log (e); console.log (e.stack); }
			}
			if (chartType == "lines" || chartType == "bars" || chartType == "pie" || chartType == "treemap") {
				this.parseChart (element, data);
			}
			/*
			* Chart: Map.
			*/
			if (chartType == "map") {
				this.parseMap (element, data);
			}
		}
		/*
		* Media
		*/
		if (data.control_media) { 
			var m = this.medium [data.control_media];
			if (m) { 
				if (data.media_play !== undefined) { 
					m.play ();
					m.muted (false);
				}
				if (data.media_stop !== undefined) { 
					m.pause ();
					m.currentTime (0);
				}
				if (data.media_time !== undefined) {
				//	m.pause ();
					m.currentTime (parseInt (data.media_time));
				//	m.play ();
				}
				if (data.media_pause !== undefined) {
					m.pause ();
				}
				if (data.media_mute !== undefined) {
					m.muted (true);
				}
				if (data.media_unmute !== undefined) { 
					m.muted (false);
				}
			}
		}
		/*
		* HTML element
		*/
		if (data.control_element) {
			
			var s = $(data.control_element);
			if (data.element_text) { s.text (data.element_text); }
			if (data.element_add_class) { s.addClass (data.element_add_class); }
			if (data.element_remove_class) { s.removeClass (data.element_remove_class); }
			if (data.element_hide !== undefined) { s.hide (); }
			if (data.element_show !== undefined) { s.show (); }
			if (data.element_toggle !== undefined) { s.toggle (); }
			if (data.element_remove !== undefined) { s.remove (); }
			if (data.element_remove_children !== undefined) { 
				for (var i = 0; i < s.length; i++) {
					var cNode = s [i].cloneNode (false);
					s [i].parentNode.replaceChild (cNode, s [i]); 
				}
			}
			if (data.element_attrs) { 
				//s.attr (data.element_attrs); 
				if (data.element_attrs === Object (data.element_attrs)) { 
					data.element_attrs = Object (data.element_attrs);
					s.attr (data.element_attrs);
				}
			}
		}
		/*
		* Callback
		*/
		if (data.callback) {
			var cb = this.conf.callbacks [data.callback]
			if (cb) {
				try { 
					cb.apply (this, [data.callback_args]);
				} catch (e) { 
					console.log ("error in callback: " + e);
					console.log (e.stack);
				}
			}
		}
		/*
		* Hide and show.
		*/
		if (data.hide !== undefined) {
			if (data.hide == "") { 
				$(element).hide (); $(element).css ("visibility", "hidden"); 
			} else if (data.hide.split) { 
				var x = data.hide.split (",");
				for (var d in x) { 
					$("#" + x [d]).hide (); 
					$("#" + x [d]).css ("visibility", "hidden"); 
				}
			}
		}
		if (data.show !== undefined) {
			if (data.show == "") { 
				$(element).show (); 
				$(element).css ("visibility", "visible"); 
			} else if (data.hide.show) { 
				var x = data.show.split (",");
				for (var d in x) { 
					$("#" + x [d]).show (); 
					$("#" + x [d]).css ("visibility", "visible"); 
				}
			}
		}
		/*
		* Scroll control
		*/
		if (data.control_scroll != '' && this.scroll [data.control_scroll]) { 
			var scroll = this.scroll [data.control_scroll];
			if (data.scroll_to !== undefined) { 
				scroll.scrollTo (data.scroll_to);
			}
			if (data.scroll_to_next !== undefined) { 
				scroll.scrollToNext ();
			}
			if (data.scroll_to_previous !== undefined) { 
				scroll.scrollToPrev ();
			}
		}
		/*
		* Slide control
		*/
		if (data.control_slide != '' && this.slides [data.control_slide]) {
			if (data.scroll_to !== undefined) { 
				this.slides [data.control_slide].controller.scrollTo (this.slides [data.control_slide].slides [data.scroll_to]);
			}
		}
		if (data.debug) { 
			console.log (data.debug);
		}
		/*
		* data catalogs 
		*/
		if (data.catalog) {
			if (!this.data [data.catalog] && !this.callbacks [data.catalog]) throw "No catalog " + data.catalog + " in data collection"; 
			var dt = this.data [data.catalog];
			if (!dt && this.callbacks && this.callbacks [data.catalog]) dt = this.callbacks [data.catalog].apply (this, [data.catalog_args]);
			var container = d3.selectAll (data.element_container);
			if (dt.columns != "undefined") {
				var elm = container.append (data.create_element);
				if (data.item_element) { 
					for (var a in dt.columns) {
						elm.append (data.item_element).html (dt.columns [a]);
					}
				}
			}
			for (var x in dt) {
				var elm = container.append (data.create_element);
				if (data.element_attrs) {
					var attrs = {};
					for (var a in data.element_attrs) {
						attrs [a] = dt [x] [data.element_attrs [a]];
					}
					elm.attrs (attrs);
				}
				if (data.element_html) {
					elm.html (dt [x] [data.element_html]);
				}
				if (data.item_element) {
					for (var a in dt [x]) {
						if (x != "columns") { 
							elm.append (data.item_element).html (dt [x][a]);
						}
					}
				}

			}

		}

		/*
		* Data download and parsing
		*/
		if (data.download) {
			var q = queue (), queryData = {}, type = data.type ? data.type : "csv";
			if (!type) type = "csv";
			if (data.query_string_elements) {
				var sel = document.querySelectorAll (data.query_string_elements);
				for (var e in sel) {
					if (sel [e].name != undefined) {
						if ((sel [e].type == "checkbox" && sel [e].checked) || (sel [e].type != "checkbox")) {
							queryData [sel [e].name] = sel [e].value;
						}
					}
				}
			}
			if (data.query_string_form) {
				var form = document.getElementById (data.query_string_form)  
				if (form && form.elements.length > 0) {
					for (var elm in form.elements) {
						//queryData.push ({elm: form.elements [elm].value});
						if (form.elements [elm].name != undefined) {
							if ((form.elements [elm].type == "checkbox" && form.elements [elm].checked) || (form.elements [elm].type != "checkbox")) {
								queryData [form.elements [elm].name] = form.elements [elm].value;
							}
						}
					}
				}
			}
			var queryString = Object.keys(queryData).reduce(function(a,k){a.push(k+'='+encodeURIComponent(queryData[k]));return a},[]).join('&'),method = data.download_method ? data.download_method.toLowerCase() : "get";
			var request = d3.request ((method == "get" && queryString) ? data.download+"?"+queryString : data.download ); 
			if (type == "json") {
				request = request
					.mimeType ("text/json")
					.response (function (xhr) { return JSON.parse(xhr.responseText); });
			}
			if (type == "csv") { 
				request = request
					.mimeType("text/csv")
					.response(function(xhr) { return d3.csvParse (xhr.responseText); })
			}
			q.defer (request [method], queryString);
			q.await ($.proxy (function (err, d) { 
				if (this.conf.callbacks && data.download_processor && this.conf.callbacks [data.download_processor]) {
					d = this.conf.callbacks [data.download_processor].apply (this, [d, data.download_id]); 
				}

				this.data [data.download_id] = d; 

				if (data.download_parse) {
					var me = this;
					$(data.download_parse).each (function () { me.parseElement.apply (me, [$(this) [0]]); });
				}
			}, this));
		}
		/* data process */
		if (data.process) { 
			
		}
		/*
		* Other elements to parse
		*/
		if (data.parse) { 
			if (Array.isArray (data.parse)) { 
				for (var x in data.parse) { 
					this.parseElement (data.parse [x], false);
				}
			}
			else {
				var me = this;
				$(data.parse).each (function () { me.parseElement.apply (me, [$(this) [0]], false); });
			}
		}
		/*
		* This is a comma separated value and each of the elements will be treated as an independent selector and parsed in sequence
		*/
		if (data.parse_sequence) {
			var x = data.parse_sequence.split (",");
			var me = this;
			for (var e in x) {
				$(x[e]).each  (function () { me.parseElement.apply (me, [$(this) [0]], false); });
			}
		}
		/*
		* IMPORTANT! DO not put any more code here as we need to make sure that the other elements are parsed after everything else, to avoid weird behaviour. 
		*/
	},
	prequantify: function (quantifier) {
		if (this.conf.prequantifiers) {
			var pq = quantifier ? this.conf.prequantifiers [quantifier.fn] : null;
			if (pq) { 
				return pq.apply (this, [quantifier.ar]);
			}
		}
	},
	parseChart: function (element, data) {
		var id = $(element).attr ("id");
		var controlChart = data.control_chart ? data.control_chart : id;
		if (!controlChart) throw "No control_chart defined in element: " + element;
		var highlight = data.highlight;
		if (highlight) { 
			this.charts [controlChart].removeClass (".highlight", "highlight");
			this.charts [controlChart].addClass (data.highlight, "highlight");
		}
	},
	/*
	*
	*/
	parseMap: function (element, data) {
		var id = $(element).attr ("id");
		var controlChart = data.control_chart ? data.control_chart : id;
		if (!controlChart) throw "No control_chart defined in element: " + element;

		if (data.clear) {
			var layers = data.clear.split(',');
			for (var l in layers) {
				this.quantifyMap (controlChart, layers [l.trim()], {fn: function () { return {"class": ""} } });
			}
		}
		var zoomTo = data.zoom_to;
		var zoomLevel = data.zoom_level; 
		if (data.map_center_lat && data.map_center_lon) { 
			this.charts [controlChart].setCenter ({lat: data.map_center_lat, lon: data.map_center_lon});
		}
		if (zoomTo) {
			this.charts [controlChart].zoomTo (zoomTo, zoomLevel);
		} else if (zoomLevel) {
			this.charts [controlChart].setScale (zoomLevel); 
		}
		if (data.select) { 
			if (data.select_add_class) { 
				this.charts [controlChart].addClass (data.select, data.select_add_class);
			}
			if (data.select_remove_class) { 
				this.charts [controlChart].removeClass (data.select, data.select_remove_class);
			}
		}
		var highlight = data.highlight;
		if (highlight) { 
			this.charts [controlChart].removeClass (".highlight", "highlight");
			this.charts [controlChart].addClass (data.highlight, "highlight");
		}

	},
	/*
	* quantiyChart:
	* 	starts up the quantifying process by calling the charts native 'redraw' method with the quantifier.
	*	Arguments:
	*		chart: string, the chart container's id.
	*		quantify: string, the key found in the 'data' config object 
	*		quantifier: object, the function that is going to quantify it and its arguments.
	*/
	quantifyChart: function (chart /* where is it going to be displayed*/, quantifier /* who is going to quantify it */) {
		var chartType = this.chartType (chart);
		if (this.conf.quantifiers && this.conf.quantifiers [chartType]) {
			var q = quantifier ? this.conf.quantifiers [chartType] [quantifier.fn] : null;
		}
		if (!q && quantifier) throw "No quantifier found: " + chartType + " " + quantifier.fn;
		var qn = quantifier ? {fn: q, context: this, args: quantifier.ar, data: quantifier.data} : null;
		this.charts [chart].redraw (quantifier.data, qn);
		this.charts [chart].on ("click", function (a, id, x, el) { this.parseElement (el); }, this); 
		this.charts [chart].on ("mouseover", function (a, id, x, el) { this.parseElement (el); }, this); 
		//this.charts [chart].on ("mouseout", function (a, id, x, el) { this.parseElement (el); }, this); 
	},
	quantifyMap: function (map, layer, quantifier) {
		if (this.conf.quantifiers && this.conf.quantifiers ["maps"]) {
			var q = quantifier ? this.conf.quantifiers ["maps"] [quantifier.fn] : null;
		}
		var l = this.conf.data [layer];
		if (!q && quantifier) q = quantifier.fn; 
		if (!l) throw "No data found: " + layer;

		var qn = quantifier ? {fn: q, context: this, args: quantifier.ar, data: quantifier.data} : null;
		if (!this.charts [map].topologies[layer]) throw "No layer: "+layer + " for map: " + map;

		/*
		* This is where the difference between maps and normal charts resides: maps have different layers and we just want to quantify one of them here.
		*/
		var plot = l.plot ? l.plot : "lines"
		var l = this.charts [map].topologies [layer];
		l.redraw (this.setFeatureId (this.conf.data [layer]), qn, plot);
		l.on ("click", function (a, id, x, el) { this.parseElement (el); }, this); 
		l.on ("mouseover", function (a, id, x, el) { this.parseElement (el); }, this); 
		//l.on ("mouseout", function (a, id, x, el) { this.parseElement (el); }, this); 
		this.charts [map].reZoom ();
	},
	setFeatureId: function (layer) {
		return function (x) { 
			var val = x.properties [layer.idProperty];
			if (typeof layer.idProperty === "function") {
				val = layer.idProperty (x); 
			}
			return layer.id + "_" + val;
		};
	},
	initControls: function () {
		$("form[data-control]").change({me: this},
			function (a) {
				var args = {};
				$.each ($(this).find (":input").serializeArray (), function (_, kv) { if (kv.value != "IGNORE") { args [kv.name] = kv.value; } });
				$(this).data ("quantifier_args", args);
				a.data.me.parseElement.apply (a.data.me, [this, false]);
			}
		);
		//TODO check if this is redundant from the method above
		$("select[data-control]").change ({me: this},
			function (a) {
				var sel = this;
				for (var i = 0; i < sel.options.length; i++) {
					if (sel.options [i].selected) {
						a.data.me.parseElement.apply (a.data.me, [sel [i]]);
					}
				}
				//a.data.me.parseElement.apply (a.data.me, [$(this).children (":selected")]);
			}
		)
		var evcb = function (ev) { 
			return function (a) { 
				var mo = $(this).data () [ev];
				if (mo) { 
					var cb = function (ant) { 
						return function () { 
							ant.parseElement.apply (ant, [this]);	
						}
					}
					$(mo).each (cb (a.data.me));
				} else {
					var x = a.data.me;
					x.parseElement.apply (x, [this]);
				}
			}
		}
		$("[data-mouseover]").mouseover ({me: this}, evcb ("mouseover"))
		$("[data-mouseout]").mouseout ({me: this}, evcb ("mouseout"))
		$("[data-click]").click ({me: this}, evcb ("click"))
		$("[data-change]").change ({me: this}, evcb ("change"))

		var cb = function (me) { 
			return function (r) { 
				me.addMedia.apply (me, [$(this) [0]]); 
			}
		};
		$("[data-media]").each (cb (this));
	},
	initControl: function (node) {
		var data = $(node).data ();
		var evcb = function (ev) { 
			return function (a) { 
				var mo = $(this).data () [ev];
				if (mo) { 
					var cb = function (ant) { 
						return function () { 
							ant.parseElement.apply (ant, [this]);	
						}
					}
					$(mo).each (cb (a.data.me));
				} else {
					var x = a.data.me;
					x.parseElement.apply (x, [this]);
				}
			}
		}
		if (data.change !== undefined) { $(node).change ({me: this, data: data}, evcb ("change")); }
		if (data.mouseover !== undefined) { $(node).mouseover ({me: this, data: data}, evcb ("mouseover")); }
		if (data.mouseout !== undefined) { $(node).mouseout ({me: this, data: data}, evcb ("mouseout")); }
		if (data.click !== undefined) {  $(node).click ({me: this, data: data}, evcb ("click")); }
		if (node.tagName == "SELECT" && data.control !== "undefined") {
			$(node).change (
				{me: this, data: data},
				function (a) {
					var sel = this;
					for (var i = 0; i < sel.options.length; i++) {
						if (sel.options [i].selected) {
							a.data.me.parseElement.apply (a.data.me, [sel [i]]);
						}
					}
				}
			);
		}
	},
	addMedia: function (elm) { 
		var id = elm.id;
		var data = $(elm).data ();
		var type = data.media;
		var x, alt;
		switch (type) {
			case 'youtube': x = new Popcorn.HTMLYouTubeVideoElement( elm ); break
			case 'vimeo': x = new Popcorn.HTMLVimeoVideoElement( elm ); break;
			case 'video': 
				elm.preload = "auto";
				var alt = new VideoInLine (elm);
				if (window.makeVideoPlayableInline !== undefined) { window.makeVideoPlayableInline (elm); } 
				break;
			case 'audio': x = "#" + id; break;
			case 'timer': alt = new Timefy (data.timer_args); break;
		}
		if (x) { 
			x.src = $(elm).data ("media_url");
			var media = new Popcorn (x);
		} else if (alt) {
			var media = alt; 
		}
		media.load ();
		var cb = function (context, obj, elm) { 
			return function (e) { 
				var currentTime = obj.currentTime (), currentSecond = Math.floor (currentTime), millisecond = currentTime - currentSecond, currentMillisecond = Math.floor (millisecond * 10);
				var parseCb = function (me) { 
					return function () { 
						me.parseElement.apply (me, [$(this) [0]]);
					} 
				}
				if (obj.currentSecond != currentSecond) {
					var every = [1,2,3,4,5,10,15,20,30,40,45,50,55,60];	
					var trigg = [];
					for (var i in every) { 
						if (currentSecond % every [i] === 0) trigg.push (every [i]);
					}
					for (var i in trigg) {  
						$("[data-subscribe_media='" + elm.id + "'][data-subscribe_every='" + trigg [i] + "']").each (parseCb (context));
					}
					$("[data-subscribe_media='" + elm.id + "'][data-subscribe_time='" + currentSecond + "']").each (parseCb (context));
					obj.currentSecond = currentSecond;
				}
				$("[data-subscribe_media='" + elm.id + "'][data-subscribe_time='" + currentSecond + "." + currentMillisecond + "']").each (parseCb (context));
			}
		}
		var intervalCb = function (a, media, c, cb) { return function () { media.interval = setInterval.apply (null, [cb (a, media, elm), 100]); } }
		var removeIntervalCb = function (a,media,c) { return function () { if (media.interval) clearInterval.apply (null, [media.interval]); } }
		media.on ("play", intervalCb (this, media, elm, cb));
		media.on ("pause", removeIntervalCb (this,media,elm));
		media.play (); media.pause ();
		//media.on ("timeupdate", cb (this, media, elm));
		//TODO subscribers for play, stop, etc.

		this.medium [id] = media;
	},
	chartType: function (chartName) {
		return this.chartTypes [chartName];
	},
	initChart: function (element) { 
		var id = $(element).attr ('id');
		if (!this.charts [id]) {
			var data = $(element).data ();
			var dChart = data.chart;
			this.chartTypes [id] = dChart; 
			var obj;
			if (dChart == "map") {
				obj  = new ant.charts.map ("#" + id, $(element).width (), $(element).height ());
			//	obj.setCenter ({lat: data.map_center_lat, lon: data.map_center_lon});
				// TODO fix this following lines: the layers should be drawn by the quantifier.
				if (data.map_layers) { 
					var layers = data.map_layers.split (',');
					for (var a in layers) {
						var l = this.conf.data [layers [a]];
						var plot = l.plot ? l.plot : "lines";
						var topo = obj.addFeatures (l.id, this.data [l.id], l.key); 
						// TODO FIX THIS.. it is needed for when using points layers.
						topo.redraw (this.setFeatureId (l), null, plot)
					}
				}
				this.charts [id] = obj;
				//this.charts [id].on ("click", function (a, id, x, el) { this.parseElement (el); }, this); 
				//this.charts [id].on ("mouseover", function (a, id, x, el) { this.parseElement (el); }, this); 
				this.parseElement ("#" + id);
			}
			if (dChart == "bars" || dChart == "lines" || dChart == "pie" || dChart == "treemap") { 
				obj  = new ant.charts [dChart] (id, $(this).data ())	
				this.charts [id] = obj;
				this.parseElement ("#" + id);
			}
		} else {
			console.log ("Chart already exists: " + id);
		}
	},
	initCharts: function () {
		var m = this;
		$("[data-chart]").each (function (e) { m.initChart.apply (m, [$(this)]); });
	},
	initSlides: function () { 
		var slides = {};
		$("[data-slide]").each (function (i) { 
			var slide = $(this).data ("slide"); 
			if (!slides [slide]) slides [slide] = {};
			var id = $(this).attr ('id');
			slides [slide][id] = $(this) [0]; 
		});
		for (var c in slides) {
			var controller = new ScrollMagic.Controller ({
				globalSceneOptions: {
					triggerHook: 'onLeave'
				}
			});
			var scenes = {}
			for (var p in slides [c]) {
				var panel = slides [c] [p];
				var scene = new ScrollMagic.Scene ({ 
					triggerElement: panel
				})
				.setPin (panel)
				.addTo (controller);
				var cb = function (me) { return function (e) { me.parseElement.apply (me, [e.target.triggerElement ()]); } };
				scene.on ("enter", cb (this));
				var lv = function (me) { 
					return function (e) { 
						var d = $(e.target.triggerElement()).data ();
						if (d.slide_leave_parse !== undefined) { 
							var x = d.slide_leave_parse.split (',');
							for (a in x) { 
								me.parseElement.apply (me, ["#" + x [a]]);
							}
						}
					};
				};
				scene.on ("leave", lv (this));
				scenes [p] = scene;
			}
			this.slides [c] = {controller: controller, slides: scenes};
		}
	},
	initScroll: function () {
		var cb = function (me) { 
			return function () { 
				var id = $(this).attr ('id');
				var scroll = new Scenify ("#" + id);
				scroll.on ("scene_progress", $.proxy (me.scrollProgress, me));
				scroll.on ("scene_enter", $.proxy (me.scrollEnter, me));
				scroll.on ("scene_leave", $.proxy (me.scrollLeave, me));
				me.scroll [id] = scroll;
			};
		}
		$("[data-movie]").each (cb (this));
	}
};
function Timefy () { 
	this.init ();
	return this;
}
Timefy.prototype = {
	constructor: Timefy,
	_interval: null,
	_tic: -1,
	_paused: true,
	init: function () {
		this.paused (true);
		this._tic = -1;
		this._interval = null;
	},
	load: function () {},
	play: function () {
		this.paused (false);
		if (!this._interval) { 
			var cb = function (me) { return function () { if (!me.paused.apply (me)) {  me._tic+=100; me.callback.apply (me, ["timeupdate"]); } }} 
			this._interval = setInterval (cb (this), 100);	
		}
		this.callback ("play");
	},
	currentTime: function (tic) { if (tic !== undefined) { this._tic = tic; } return this._tic / 1000;},
	muted: function () {},
	pause: function () {  
		if (!this.paused ()) this.paused (true);
		this.callback ("pause");
	},
	paused: function (paused) { if (paused !== undefined) { this._paused = paused; } return this._paused },
	stop: function () {
		clearInterval (this._interval);
		this.callback ("pause");
		this.init ();
	},
	callbacks: {},
	on: function (ev, cb) {
		if (!this.callbacks [ev]) { this.callbacks [ev] = []; }
		this.callbacks [ev].push (cb);
	},
	callback: function (ev) { 
		if (!this.callbacks [ev]) return;
		for (cb in this.callbacks [ev]) {
			var x = this.callbacks [ev] [cb];
			if (x) x (); //TODO check scopes;
		}
	}
}
function VideoInLine (vid) { 
	this.init (vid);
	return this;
}
VideoInLine.prototype = {
	constructor: VideoInLine,
	_element: null,
	_tic: -1,
	init: function (vid) { 
		this.callbacks = {};
		this._element = vid;
	},
	load: function () { this._element.load (); },
	play: function () { 
		this._element.play ();
	},
	pause: function () { 
		this._element.pause ();
	},
	stop: function () { 
		this._element.pause ();
	},
	currentTime: function (tic) { if (tic !== undefined) { this._element.currentTime = tic; } return this._element.currentTime; },
	muted: function () { 
	},
	callbacks: {},
	on: function (ev, cb) { 
		//this._element.addEventListener (ev, function (me) { return function () { cb.apply (me, arguments); } } (this));
		this._element.addEventListener (ev, cb);
	},
	callback: function (ev) { 
		if (!this.callbacks [ev]) return;
		for (cb in this.callbacks [ev]) {
			var x = this.callbacks [ev] [cb];
			if (x) x ();
		}
	}
}
