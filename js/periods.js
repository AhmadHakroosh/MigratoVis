// Period selection functionality implementation

((scope) => {
	scope.periods = (chart, config) => {
		// Find and set years
		let years = Object.keys(chart.data.mapping).map((x) => { return parseInt(x); });
		// Initialize configuration
		config = config || {};
		config.element = config.element || 'body';
		config.now = config.now || years[0];
		config.incr = config.incr || 5;

		let form = d3.select(config.element).append('form');
		let year = form.selectAll('.year').data(years);
		let span = year.enter().append('span').classed('year', true);
	};
})(window.migrato || (window.migrato = {}));