// Period selection functionality implementation

(function (scope) {
	scope.periods = function (chart, config) {
		// Find and set years
		var years = Object.keys(chart.data.mapping).map(function (x) { return parseInt(x); });
		// Initialize configuration
		config = config || {};
		config.element = config.element || 'body';
		config.now = config.now || years[0];
		config.incr = config.incr || 5;

		var form = d3.select(config.element).append('form');
		var year = form.selectAll('.year').data(years);
		var span = year.enter().append('span').classed('year', true);
	};
})(window.migrato || (window.migrato = {}));

