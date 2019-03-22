function Nestify (data, keys, rollup, aggregator, interiorKey) {
	this.nest = this._nest (keys, rollup, aggregator, interiorKey)
	this.data = this.init (data, this.nest, aggregator, interiorKey);
	this.asHierarchy = function (sum, sort) {
		return d3.hierarchy ({values: this.nest.entries (data)}, function(d) { return d.values; })
			.sum (sum)
			.sort (sort)
	}
	return this;
}
Nestify.prototype = {
	constructor: Nestify,
	_nest: function (keys, rollup, aggregator, interiorKey) {
		var n = d3.nest ();
		if (keys) {
			for (x in keys) {
				var cb = function (k) { 
					return function (r) { if (interiorKey) { return interiorKey; } return r [k] }; 
				}
				n = n.key (cb (keys [x]));
			}
		}
		n = n.rollup (
			function (r) { 
				var obj = {}; 
				for (d in rollup) { 
					if (!obj [rollup [d]]) obj [rollup [d]] = [];
					for (i in r) {
						obj [rollup [d]].push (r [i] [rollup [d]]);
					}
					if (!aggregator) { 
						obj [rollup [d]] = d3.sum (obj [rollup [d]]);
					} else { 
						obj [rollup [d]] = aggregator (obj [rollup [d]], rollup [d])
					}
					if (!obj [rollup [d]]) obj [rollup [d]] = r [i] [rollup [d]];
						/*
						var cb = function (col, intK) { 
							return function (a) { if (intK) { return  parseInt (a [intK]); } return parseInt (a [col]); }
						}
						if (interiorKey !== undefined) { 
							obj.value = aggregator (r, cb (rollup [d], interiorKey));
						} else {
							obj [rollup [d]] = aggregator (r, cb (rollup [d], interiorKey));
						}
						*/

				} 
				return obj; 
			}
		);

		return n;
	},
	init: function (data, nest, aggregator, interiorKey) {
		var n = nest.object (data);
		var summarize = function (leaf, key) {
			if (leaf) {
				var length = 0;
				var hasChildren = false;
				for (var k in leaf) { 
					if (leaf [k] === Object(leaf [k])) {
						var x = summarize (leaf [k], k);
						length ++;
						hasChildren = true;
					} else if (Array.isArray (leaf)) {
						length = leaf.length;
						//IMPORTANT: leaf [k] NEEDS to be an object so it can be used with values () and items (), etc. This is key.
						var col;
						if (interiorKey !== undefined) { 
							col = leaf [interiorKey];
							leaf = {};
						} else {
							col = leaf [k];
							leaf [col] = {};
						}
						hasChildren = false;
					} else {
						//LEAF at this point is key:value... where should we set it up?
						if (interiorKey !== undefined) {
							val = leaf [k] [interiorKey];
							leaf = {value: val}
						} else {
							var val = leaf [k];
							leaf [k] = {value: val}
						}

					}
				}
				/*	if (!key) {
					leaf.nests = keys.length 
				}*/
				leaf.values = function () { var ks = []; for (var k in this) {if (this [k] === Object (this [k]) && typeof this [k] != "function") { ks.push (this [k]);} } return ks; }
				//TODO add keyName, this way we can match it to key == "2010" and keyName == "year" 
				leaf.items = function () { var ks = [];  for (var k in this) { if (this [k] === Object (this [k]) && typeof this [k] != "function") { ks.push ({key: k, values: this [k]}); } } return ks; }
				leaf.max = function (accessor) { return d3.max (this.items (), accessor); } 
				leaf.min = function (accessor) { return d3.min (this.items (), accessor); } 
				leaf.mean = function (accessor) { return d3.mean (this.items (), accessor); } 
				leaf.sum = function (accessor) { return d3.sum (this.items (), accessor); }
				leaf.extent = function (accessor) { return d3.extent (this.items (), accessor); } 
				leaf.minsum = function (accessor) { var t = this.items (); return [d3.min (t, accessor), d3.sum (t, accessor)]}
				leaf.minmean = function (accessor) { var t = this.items (); return [d3.min (t, accessor), d3.mean (t, accessor)]}
				leaf.meanmax = function (accessor) { var t = this.items (); return [d3.mean (t, accessor), d3.max (t, accessor)]}
				leaf.sortBy = function (s) { var t = this.items (); return t.sort (function (a, b) { return a.values [k] < b.values [k]; }) }
				leaf.length = length;
				leaf.hasChildren = hasChildren;
				return leaf;
			}
		}
		n = summarize (n);

		return n;
	}
}
