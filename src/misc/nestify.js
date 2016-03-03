function Nestify (data, keys, rollup, aggregator, interiorKey) {
	this.data = this.init (data, keys, rollup, aggregator, interiorKey);
	return this;
}
Nestify.prototype = {
	constructor: Nestify,
	init: function (data, keys, rollup, aggregator, interiorKey) {
		if (!data) throw "No data in nestify";
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
					if (!aggregator) { 
						for (i in r) { 
							var a = r [i];
							if (!obj [rollup [d]]) obj [rollup [d]] = {};
							obj [rollup [d]] = a [rollup [d]];
						}
					} else { 
						var cb = function (col, intK) { 
							return function (a) { if (intK) { return  parseInt (a [intK]); } return parseInt (a [col]); }
						}
						if (interiorKey !== undefined) { 
							obj.value = aggregator (r, cb (rollup [d], interiorKey));
						} else {
							obj [rollup [d]] = aggregator (r, cb (rollup [d], interiorKey));
						}
					}

				} 
				return obj; 
			}
		);
		n = n.map (data);
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
				if (!key) {
					leaf.nests = keys.length 
				}
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
				leaf.length = length;
				leaf.hasChilds = hasChildren;
				return leaf;
			}
		}
		n = summarize (n);

		return n;
	}
}
