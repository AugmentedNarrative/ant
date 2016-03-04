var asBars = function () {
	this.redraw = function (d, quantifier) {
		this.callbacks = {};
		var data = d.data;
		d.scale.range ([0, this.height]);

		var barWidth = this.width / data.length;
		var chartHeight = this.height;
		//TODO migrate this to the new quantifierCallback method
		var qn = quantifier ? $.proxy (
				function (selector, d) {  
					var attrs = quantifier.fn.apply (quantifier.context, [d, quantifier.args, quantifier.data])
					var height = attrs === Number (attrs) ? attrs : attrs.height;
					var data = attrs.data;
					attrs.data = null;
					if (isNaN (height)) height = 0;
					var calcY = chartHeight - height;
					if (isNaN (calcY)) calcY = 0;
					d3.select (selector) 
						.attr ("y", calcY)
						.attr ("height", height + 1)
						.attr (attrs);
					if (!attrs.width) d3.select (selector).attr ("width", barWidth ); 

					if (data) { 
						for (var d in data) { 
							var val = data [d];
							if (val === Object (val)) {
								val = JSON.stringify (val);
							}
							d3.select (selector).attr ("data-" + d, val);
						}
					}
				},
			quantifier) : function (selector, d) { d3.select (selector).attr ("class", ""); };
		var margin = this.margin;
		this.svg.selectAll ("g").remove (); //HACK. Sucks. 
		var items = data;
		if (typeof data.items === "function") { 
			items = data.items ();
		}
		var bar = this.svg.selectAll ("g")
			.data (items);

		bar.enter ().append ("g")
			.attr ("transform", function (d, i) { return "translate(" + i * barWidth + ", " + margin.top + ")"; });	
		bar.append ("rect")
			.each (function (d) { qn (this, d); })
			.on ("click", this.createCallback ("click"))
			.on ("mouseover", this.createCallback ("mouseover"))
			.on ("mouseout", this.createCallback ("mouseout"))
			
	}
	return this;
}
ant.charts.bars = function (container, conf) { this.init (container, conf); }
//charts.bars.prototype.constructor = asChart.init;
asChart.call (ant.charts.bars.prototype);
asBars.call (ant.charts.bars.prototype);
