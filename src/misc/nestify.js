function Nestify (data, keys, rollup, interiorKey) {
	this.data = this.init (data, keys, rollup, interiorKey);
	return this;
}
Nestify.prototype = {
	constructor: Nestify,
	init: function (data, keys, rollup, interiorKey) {
		if (!data) throw "No data in nestify";
		var n = d3.nest ();
		if (keys) {
			for (x in keys) {
				var cb = function (k) { 
					return function (r) { if (interiorKey) { r = r [interiorKey]; } return r [k] }; 
				}
				n = n.key (cb (keys [x]));
			}
		}
		n = n.rollup (
			function (r) { 
				var obj = {}; 
				for (d in rollup) { 
					var cb = function (col) { 
						return function (a) { if (interiorKey) { a =  a [interiorKey]; } return a [col]; }
					}
					obj [ rollup [d]] = d3.sum (r, cb (rollup [d]));
				} 
				return obj; 
			}
		);
		n = n.map (data);
		var summarize = function (leaf, key) {
			var length = 0;
			var hasChildren = false;
			for (var k in leaf) { 
				if (leaf [k] === Object(leaf [k])) {
					var x = summarize (leaf [k], k);
					length ++;
					hasChildren = true;
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

		n = summarize (n);

		return n;
	}
}
