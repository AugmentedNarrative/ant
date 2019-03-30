# ANT

## ANT stands for Augmented Narrative Toolkit

A framework that enables web developers to easily create data driven documents as it integrates the power and complexity of a variety of tools that can be controlled by directly by HTML5 data tags, CSS3 and a little javascript. 

An example of its use would be:

```html
<div id="my_map" data-chart="map" data-map_layers="countries" style="width: 600px; height: 350px;"></div>
```

Along with this JavaScript code

```javascript
$(document).ready (function () { 
	var conf = {
		data: {
			countries: {
				type: d3.json,
				url: '/data/world.json',
				id: "world",
				key: "countries",
				enumerator: "geometries",
				idProperty: function (a) { return a.id; } 
			}
		}
	};
	new Ant (conf); 
```

Will result in a map:

![a map](http://i.imgur.com/eOWAUpj.png)

And it all starts there. There are many, many, options and features. 

## Demos

- [A world's population explorer](http://augmentednarrative.github.io)
- [Visualizing Boston's Police Department drug investigations and arrests](http://warondrugs.justicesos.org/)
- [Mexico City's air quality dashboard](http://pa-w.github.io/airecdmx)

The tools/libraries it integrates are:

- D3
- ScrollMagic
- jQuery
- PopcornJS 

And others.
