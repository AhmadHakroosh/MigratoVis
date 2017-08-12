// Compile the final version of the data, after filtration.
// And get it ready to be visualized.

'use strict';

let csv = require('csv');
let fs = require('fs');

module.exports = (grunt) => {
	// Turn csv data into a JSON matrix
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
				// TODO
			})
			.on('end', () => {
				// TODO
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