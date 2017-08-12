(() => {
	// Filtered data file
	let datafile = 'data/data.json';

	d3.json(datafile, (data) => {
		let now = 1990;
		let chart = migrato.chart(data, {
			element: '#chart',
			now: now,
			animationDuration: 1000,
			margin: 125,
			arcPadding: 0.04,
			layout: {
				alpha: 0,
				threshold: 50000,
				labelThreshold: 5000,
				colors: 'cd3d08 ec8f00 6dae29 683f92 b60275 2058a5 00a592 009d3c 378974 ffca00'.split(' ').map((c) => {
					return '#' + c;
				})
			}
		});

		migrato.periods(chart, {
			now: now,
			element: '#periods',
			incr: 5
		});

		chart.draw(now);
	});
})();