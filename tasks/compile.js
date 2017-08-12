// Compile the final version of the data, after filtration.
// And get it ready to be visualized.

'use strict';

let csv = require('csv');
let fs = require('fs');

module.exports = (grunt) => {
	// Turn csv data into a JSON mapping
	function compile (filename, options, done) {
		let data = {
			years: {
				1990: {},
				1995: {},
				2000: {},
				2005: {}
			},
			migrations: {},
			regions: {}
		};

		let years = Object.keys(data.years);
		let header = [];

		// Define sort order
		let sortedRegions = ['North America', 'Africa', 'Europe', 'Fmr Soviet Union', 'West Asia', 'South Asia', 'East Asia', 'South-East Asia', 'Oceania', 'Latin America'];

		// Creates an object based on row data
		function obj (row) {
			return row.reduce(function(data, col, i) {
				data[headers[i]] = col;
				return data;
			}, {});
		}

		csv()
			.from.stream(fs.createReadStream(filename))
			.on('record', (row, index) => {
				if (index === 0) {
					return headers = row;
				}
				// Build object from csv row
				row = obj(row);
				// When sample option is set, show only countries that start with 'A'
				if (options.sample === true) {
					options.sample = 'A';
				}
				// Check for each entry if the country name does not start with 'A'
				if (options.sample) {
					let test = new RegExp('^' + options.sample);
					if (!row.origin_name.match(test) || !row.destination_name.match(test)) {
						return;
					}
				}
				// Now, build region-country mappings
				data.regions[row.originregion_name] = data.regions[row.originregion_name] || [];
				// Check whether the origin already exists, and if not add it to the regions
				if (data.regions[row.originregion_name].indexOf(row.origin_name) === -1) {
					data.regions[row.originregion_name].push(row.origin_name);
				}
				// Set migration data
				data.migrations[row.origin_name] = data.migrations[row.origin_name] || {};
				// Set country-to-country
				data.migrations[row.origin_name][row.destination_name] = data.migrations[row.origin_name][row.destination_name] || {};
				// Set country-to-region
				data.migrations[row.origin_name][row.destinationregion_name] = data.migrations[row.origin_name][row.destinationregion_name] || {};
				data.migrations[row.originregion_name] = data.migrations[row.originregion_name] || {};
				// Set region-to-country
				data.migrations[row.originregion_name][row.destination_name] = data.migrations[row.originregion_name][row.destination_name] || {};
				// Set region-to-region
				data.migrations[row.originregion_name][row.destinationregion_name] = data.migrations[row.originregion_name][row.destinationregion_name] || {};

				// Set data in years order
				years.forEach((year) => {
					let value = parseInt(row['countryflow_' + year], 10);
					// country to country
					data.migrations[row.origin_name][row.destination_name][year] = value;
					// country to region
					data.migrations[row.origin_name][row.destinationregion_name][year] = data.migrations[row.origin_name][row.destinationregion_name][year] || 0;
					data.migrations[row.origin_name][row.destinationregion_name][year] += value;
					// region to country
					data.migrations[row.originregion_name][row.destination_name][year] = data.migrations[row.originregion_name][row.destination_name][year] || 0;
					data.migrations[row.originregion_name][row.destination_name][year] += value;
					// region to region
					data.migrations[row.originregion_name][row.destinationregion_name][year] = data.migrations[row.originregion_name][row.destinationregion_name][year] || 0;
					data.migrations[row.originregion_name][row.destinationregion_name][year] += value;
				});
			})
			.on('end', () => {
				let keys = grunt.util._.union(sortedRegions, Object.keys(data.regions)).reduce((memo, region) => {
					memo.indices.push(memo.keys.length);
					memo.keys.push(region);
					memo.keys = memo.keys.concat(data.regions[region] && data.regions[region].sort());
					return memo;
				}, {
					indices: [],
					keys: []
				});

				let mapping = {};
				years.forEach((year) => {
					mapping[year] = keys.keys.map((source) => {
						return keys.keys.map((destination) => {
							return data.migrations[source] && data.migrations[source][destination] && data.migrations[source][destination][year];
						});
					});
				});

				done(null, {
					names: keys.keys,
					regions: keys.indices,
					mapping: mapping
				});
			})
			.on('error', (error) => {
				console.error(error.message);
				done(error);
			});
	}

	// Register compile grunt task
	grunt.registerMultiTask('compile', 'Compile csv data', () => {
		let options = this.options();

		let done = this.async();

		this.files.forEach((file) => {
			file.src.forEach((src) => {
				grunt.log.write('Compiling ' + src + '...');

				compile(src, options, (error, data) => {
					if (error) {
						grunt.log.error(error);
					} else {
						grunt.log.ok();
						grunt.file.write(file.dest, JSON.stringify(data, null, options.sample ? 2 : 0));
					}

					done(!error);
				});
			});
		});
	});
};