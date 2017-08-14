// Initialize diagram
// Build main application infrastructure and configuration
(function (scope) {
	scope.chart = function (data, config) {
		// Get data if defined; instantiate otherwise
    	data = data || {regions: [], names: [], mapping: []};
    	// Get application configuration if defined; initialize otherwise
    	config = config || {};
    	config.element = config.element || 'body';
    	// Set a period to show on application run
    	config.now = config.now || Object.keys(data.mapping)[0];

    	// Geometry configuration
		config.width = config.width || 1100;
		config.height = config.height || 1100;
		config.margin = config.margin || 125;
		config.outerRadius = config.outerRadius || (Math.min(config.width, config.height) / 2 - config.margin);
		config.arcWidth = config.arcWidth || 24;
		config.innerRadius = config.innerRadius || (config.outerRadius - config.arcWidth);
		config.arcPadding = config.arcPadding || 0.005;
		config.sourcePadding = config.sourcePadding || 3;
		config.targetPadding = config.targetPadding || 20;
		config.labelPadding = config.labelPadding || 10;
		config.labelRadius = config.labelRadius || (config.outerRadius + config.labelPadding);

		// Animation configuration
		config.animationDuration = config.animationDuration || 1000;
		config.initialAngle = config.initialAngle || {};
		config.initialAngle.arc = config.initialAngle.arc || {startAngle: 0, endAngle: µ};
		config.initialAngle.chord = config.initialAngle.chord || {source: config.initialAngle.arc, target: config.initialAngle.arc};

		// Layout configuration
		config.layout = config.layout || {};
		config.layout.sortSubgroups = config.layout.sortSubgroups || d3.descending;
		config.layout.sortChords = config.layout.sortChords || d3.descending;
		config.layout.threshold = config.layout.threshold || 1000;
		config.layout.labelThreshold = config.layout.labelThreshold || 100000;
		// Start angle for first region (0 - is up North)
		config.layout.alpha = config.layout.alpha || µ;
		// Maximum open regions at a time
		config.maxRegionsOpen = config.maxRegionsOpen || 2;
		// Data info pop-up delay
		config.infoPopupDelay = config.infoPopupDelay || 300;

		var colors = d3.scale.category10().domain(data.regions);

		if (config.layout.colors) {
			colors.range(config.layout.colors);
		}

		var arcColor = function (d) {
			if (d.region === d.id) {
				return colors(d.region);
			}
			var hsl = d3.hsl(colors(d.region));
			var r = [hsl.brighter(0.75), hsl.darker(2), hsl, hsl.brighter(1.5), hsl.darker(1)];
			return r[(d.id - d.region) % 5];
		};

		var chordColor = function (d) {
			return arcColor(d.source);
		};

		// state before animation
		var previous = {
			countries: []
		};

		Number.prototype.mod = function (n) {
			return ((this % n) + n) % n;
		};

		// Calculate label position
		var labelPosition = function (angle) {
			var temp = angle.mod(2*π);
			return {
				x: Math.cos(temp - π / 2) * config.labelRadius,
				y: Math.sin(temp - π / 2) * config.labelRadius,
				r: (temp - π / 2) * 180 / π
			};
		};

		var formatNumber = function (nStr, seperator) {
			seperator = seperator || ',';

			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var regex = /(\d+)(\d{3})/;
			while (regex.test(x1)) {
				x1 = x1.replace(regex, '$1' + seperator + '$2');
			}
			return x1 + x2;
		};

		var luminicity = function (color) {
			var rgb = d3.rgb(color);
			return 0.21 * rgb.r + 0.71 * rgb.g + 0.07 * rgb.b;
		};
    }

	// arc path generator
	var textPathArc = d3.svg.arc()
		.innerRadius(config.outerRadius + 10)
		.outerRadius(config.outerRadius + 10);

	var textPathArc2 = d3.svg.arc()
		.innerRadius(config.outerRadius + 18)
		.outerRadius(config.outerRadius + 18);

	// arc generator
	var arc = d3.svg.arc()
		.innerRadius(config.innerRadius)
		.outerRadius(config.outerRadius);

	// chord diagram
	var layout = Globalmigration.layout()
		.padding(config.arcPadding)
		.threshold(config.layout.threshold)
		.data(data)
		.year(config.now);

	if (config.layout.sortGroups) {
		layout.sortGroups(config.layout.sortGroups);
	}

	if (config.layout.sortSubgroups) {
		layout.sortSubgroups(config.layout.sortSubgroups);
	}

	if (config.layout.sortChords) {
		layout.sortChords(config.layout.sortChords);
	}

	if (config.layout.alpha) {
		layout.alpha(config.layout.alpha);
	}

	// chord path generator
	var chordGenerator = Globalmigration.chord()
		.radius(config.innerRadius)
		.sourcePadding(config.sourcePadding)
		.targetPadding(config.targetPadding);

	// svg element
	var svg = d3.select(config.element).append("svg")
		.attr('preserveAspectRatio', 'xMidYMid')
		.attr('viewBox', '0 0 ' + config.width + ' ' + config.height)
		.attr("width", config.width)
		.attr("height", config.height);

	var element = svg.append("g")
		.attr("id", "circle")
		.attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");

	d3.select(window).on('resize.svg-resize', function () {
		var width = svg.node().parentNode.clientWidth;

		if (width) {
			// make height adapt to shrinking of page
			if (width < config.width) {
				svg.attr('height', width);
			}
		}
	});

	// needed for fade mouseover
	var circle = element.append("circle").attr("r", config.outerRadius + 24);
	var filter = svg.append('filter').attr('id', 'dropshadow');

	filter.append('feGaussianBlur').attr({
		in: 'SourceAlpha',
		stdDeviation: 2
	});

	filter.append('feOffset').attr({
		dx: 0,
		dy: 1,
		result: 'offsetblur'
	});

	filter.append('feComponentTransfer').append('feFuncA').attr({
		type: 'linear',
		slope: 0.5
	});

	var femerge = filter.append('feMerge');

	femerge.append('feMergeNode');
	femerge.append('feMergeNode').attr('in', 'SourceGraphic');

	var info = svg.append('g')
		.attr('class', 'info-group')
		.attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")")
		.append('g')
		.attr('class', 'info')
		.attr('opacity', 0);

	info.append('rect').style('filter', 'url(#dropshadow)');

	info.append('g').attr('class', 'text');

	svg.on('mousemove', function () {
		info.transition().duration(10).attr('opacity', 0);
	});

	circle.on('mouseout', function () {
		if (infoTimer) {
			clearTimeout(infoTimer);
		}
		info.transition().duration(10).attr('opacity', 0);
	});

	var infoTimer;

	// eg: West Africa: Total inflow 46, Total outflow 2
	var groupInfo = function (d) {
		var el = this;

		if (infoTimer) {
			clearTimeout(infoTimer);
		}

		var bbox = el.getBBox();
		infoTimer = setTimeout(function () {
			var color = d3.select(el).style('fill');

			info.attr('transform', 'translate(' + (bbox.x + bbox.width / 2) + ',' + (bbox.y + bbox.height / 2) + ')');

			var text = info.select('.text').selectAll('text')
				.data([
					data.names[d.id],
					'Total In: ' + formatNumber(d.inflow),
					'Total Out: ' + formatNumber(d.outflow)
				]);

			text.enter().append('text');
			text.text(function (t) { return t; }).style({
				fill: luminicity(color) > 160 ? 'black' : 'white'
			}).attr({
				transform: function (t, i) {
					return 'translate(6, ' + (i * 14 + 16) + ')';
				}
			});

			text.exit().remove();
			var tbbox = info.select('.text').node().getBBox();

			info.select('rect').style('fill', color).attr({
				width: tbbox.width + 12,
				height: tbbox.height + 10
			});

			info.transition().attr('opacity', 1);
		}, config.infoPopupDelay);
	};

	// chord info
	// eg: West Asia → Pacific: 46
	var chordInfo = function (d) {
		var el = this;

		if (infoTimer) {
			clearTimeout(infoTimer);
		}

		var bbox = el.getBBox();
		infoTimer = setTimeout(function () {
			var color = d3.select(el).style('fill');

			info.attr('transform', 'translate(' + (bbox.x + bbox.width / 2) + ',' + (bbox.y + bbox.height / 2) + ')')
				.attr('opacity', 0)
				.transition()
				.attr('opacity', 1);

			var text = info.select('.text').selectAll('text').data([
				data.names[d.source.id] + ' → ' + data.names[d.target.id] + ': ' + formatNumber(d.source.value)
			]);

			text.enter().append('text');
			text.exit().remove();
			text.text(function (t) { return t; }).style({
				fill: luminicity(color) > 160 ? 'black' : 'white'
			}).attr('transform', function (t, i) {
				return 'translate(6, ' + (i * 12 + 16) + ')';
			});

			info.selectAll('rect').style('fill', d3.select(el).style('fill'));

			var tbbox = info.select('.text').node().getBBox();
			info.select('rect').attr({
				width: tbbox.width + 12,
				height: tbbox.height + 10
			});
		}, config.infoPopupDelay);
	};

	var rememberTheGroups = function () {
		previous.groups = layout.groups().reduce(function (sum, d) {
			sum[d.id] = d;
			return sum;
		}, {});
	};

	var rememberTheChords = function () {
		previous.chords = layout.chords().reduce(function (sum, d) {
			sum[d.source.id] = sum[d.source.id] || {};
			sum[d.source.id][d.target.id] = d;
			return sum;
		}, {});
	};

	var getCountryRange = function (id) {
		var end = data.regions[data.regions.indexOf(id) + 1];

		return {
			start: id + 1,
			end: end ? end - 1 : data.names.length - 1
		};
	};

	var inRange = function (id, range) {
		return id >= range.start && id <= range.end;
	};

	var inAnyRange = function (d, ranges) {
		return !!ranges.filter(function (range) {
			return inRange(d.source.id, range) || inRange(d.target.id, range);
		}).length;
	};

	// Transition countries to region:
	// Use first country's start angle and last countries end angle. 
	var meltPreviousGroupArc = function (d) {
		if (d.id !== d.region) {
			return;
		}

		var range = getCountryRange(d.id);
		var start = previous.groups[range.start];
		var end = previous.groups[range.end];

		if (!start || !end) {
			return;
		}

		return {
			angle: start.startAngle + (end.endAngle - start.startAngle) / 2,
			startAngle: start.startAngle,
			endAngle: end.endAngle
		};
	};

	// Used to set the startpoint for
	// countries -> region
	// transition, that is closing a region.
	var meltPreviousChord = function (d) {
		if (d.source.id !== d.source.region) {
			return;
		}

		var c = {
			source: {},
			target: {}
		};

		Object.keys(previous.chords).forEach(function (sourceId) {
			Object.keys(previous.chords[sourceId]).forEach(function (targetId) {
				var chord = previous.chords[sourceId][targetId];

				if (chord.source.region === d.source.id) {
					if (!c.source.startAngle || chord.source.startAngle < c.source.startAngle) {
						c.source.startAngle = chord.source.startAngle;
					}

					if (!c.source.endAngle || chord.source.endAngle > c.source.endAngle) {
						c.source.endAngle = chord.source.endAngle;
					}
				}

				if (chord.target.region === d.target.id) {
					if (!c.target.startAngle || chord.target.startAngle < c.target.startAngle) {
						c.target.startAngle = chord.target.startAngle;
					}

					if (!c.target.endAngle || chord.target.endAngle > c.target.endAngle) {
						c.target.endAngle = chord.target.endAngle;
					}
				}
			});
		});

		c.source.startAngle = c.source.startAngle || 0;
		c.source.endAngle = c.source.endAngle || µ;
		c.target.startAngle = c.target.startAngle || 0;
		c.target.endAngle = c.target.endAngle || µ;

		// transition from start
		c.source.endAngle = c.source.startAngle + µ;
		c.target.endAngle = c.target.startAngle + µ;

		return c;
	};
})(window.migrato || (window.migrato = {}))