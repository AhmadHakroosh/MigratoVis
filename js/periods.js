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

		var periods = (function () {
			$('#periods').append('<div id="years" class="btn btn-group" data-toggle="buttons"></div>');
			return d3.select('#years');
		})();

		var yearButtons = periods.selectAll('.year').data(years);

		var label = yearButtons.enter().append('label')
			.attr('for', function (d) {
				return 'year-' + d;
			})
			.classed('year year-button btn btn-secondary', true)
			.text(function (d) {
				return ""+ d + (config.incr === 1 ? "" : "-" + (d + config.incr));
			});

		label.append('input')
			.attr({
				name: 'year',
				type: 'radio',
				id: function (d) { return 'year-' + d; },
				value: function (d) { return d; },
				checked: function (d) { 
					return d === config.now || null; 
				}
			});

		$('.year-button').each(function (idx, button) {
			$(button).on('click', function (e) {
				var year = e.target.firstElementChild;
				year.checked = (function (d) {
					return year.value === d || null;
				})();
				chart.draw(year.value);
			});
		});			

		// keyboard control
		d3.select(document.body).on('keypress', function () {
			var idx = d3.event.which - 49;
			var y = years[idx];
			if (y) {
				year.selectAll('input').each(function (d) {
					if (d === y) {
						d3.select(this).on('click')(d);
					}
				});
			}
		});
	};
})(window.migrato || (window.migrato = {}));

