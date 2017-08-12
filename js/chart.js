// Initialize diagram
// Build main application infrastructure and configuration
((scope) => {
	scope.chart = (data, config) => {
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

		let colors = d3.scale.category10().domain(data.regions);

		if (config.layout.colors) {
			colors.range(config.layout.colors);
		}

		function arcColor (d) {
			if (d.region === d.id) {
				return colors(d.region);
			}
			let hsl = d3.hsl(colors(d.region));
			let r = [hsl.brighter(0.75), hsl.darker(2), hsl, hsl.brighter(1.5), hsl.darker(1)];
			return r[(d.id - d.region) % 5];
		}

		function chordColor (d) {
			return arcColor(d.source);
		}

		// state before animation
		let previous = {
			countries: []
		};

		Number.prototype.mod = (n) => {
			return ((this % n) + n) % n;
		};

		// Calculate label position
		function labelPosition (angle) {
			let temp = angle.mod(2*π);
			return {
				x: Math.cos(temp - π / 2) * config.labelRadius,
				y: Math.sin(temp - π / 2) * config.labelRadius,
				r: (temp - π / 2) * 180 / π
			};
		}

		function formatNumber (nStr, seperator) {
			seperator = seperator || ',';

			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			let regex = /(\d+)(\d{3})/;
			while (regex.test(x1)) {
				x1 = x1.replace(regex, '$1' + seperator + '$2');
			}
			return x1 + x2;
		}

		function luminicity (color) {
			let rgb = d3.rgb(color);
			return 0.21 * rgb.r + 0.71 * rgb.g + 0.07 * rgb.b;
		}
    }
});