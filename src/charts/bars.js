var asBars = function () {
	this.redraw = function (d, quantifier) {
		this.callbacks = {};
		var data = d.data;
		d.scale.range ([0, this.height]);

		var barWidth = this.width / data.length;
		var chartHeight = this.height;
		var after = function (attrs) {
			var height = attrs === Number (attrs) ? attrs : attrs.height;
			if (isNaN (attrs.height)) attrs.height = 0;
			var calcY = chartHeight - attrs.height;
			if (isNaN (calcY)) calcY = 0;
			attrs.y = calcY;
			attrs.width = barWidth;

			return attrs;
		}
		var inner = function (ret) {  }
		var qn = this.quantifierCallback (quantifier, after, inner);  
		
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
			.each (function (d, i) { qn (this, d, i); })
			.on ("click", this.createCallback ("click"))
			.on ("mouseover", this.createCallback ("mouseover"))
			.on ("mouseout", this.createCallback ("mouseout"))
			
	}
	return this;
}
ant.charts.bars = function (container, conf) { this.init (container, conf); }
asChart.call (ant.charts.bars.prototype);
asBars.call (ant.charts.bars.prototype);
