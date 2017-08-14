// Here we gonna filter data regarding selected countries in the file "countries.csv":
// Where selected country is has 1 in the "show" column

'use strict';

var csv = require('csv');
var fs = require('fs');

module.exports = function (grunt) {
	var countries = function (filename, done) {
		var codes = [];
		// Read from csv stream
		csv()
			.from.stream(fs.createReadStream(filename))
			.on('record', function (row, index) {
				if (index === 0) {
					return;
				} else if (row[2] === '1') {
					codes.push(row[0]);
				}
			})
			.on('end', function () {
				done(null, codes);
			})
			.on('error', function (error) {
				console.error(error.message);
				done(error);
			});
	};

	var filter = function (source, dest, codes, options, done) {
		var headers = [];

		// Creates an object based on row data
		var obj = function (row) {
			return row.reduce(function (data, col, i) {
				data[headers[i]] = col;
				return data;
			}, {});
		};

		csv()
			.from.stream(fs.createReadStream(source))
			.to.stream(fs.createWriteStream(dest))
			.transform(function (row, index) {
				if (index === 0) {
					headers = row;
					return headers;
				}
				// Create object from row
				var object = obj(row);
				
				if (options.sample) {
					if (!object.origin_name.match(options.sample) || !object.destination_name.match(options.sample)) {
						return null;
					}
				}
				// If origin country is not enabled
				if (codes.indexOf(object.origin_iso) === -1) {
					return null;
				}
				// If destination country is not enabled
				if (codes.indexOf(object.destination_iso) === -1) {
					return null;
				}
				// Return row data
				return row;
			})
			.on('end', function () {
				done(null);
			})
			.on('error', function (error) {
				console.error(error.message);
				done(error);
			});
	};

	grunt.registerMultiTask('filter', 'Filter csv data', function () {

		var options = this.options({
			countries: grunt.option('countries'),
			sample: grunt.option('sample')
		});

		// when sample option is set, only use countries starting with `A`
		if (options.sample === true) {
			options.sample = 'A';
		}

		if (options.sample) {
			options.sample = new RegExp('^' + options.sample);
		}

		var done = this.async();
		var files = this.files;

		grunt.log.write('Reading countries ' + options.countries + '...');
		countries(options.countries, function (error, codes) {
			if (error) {
				grunt.log.error(error);
			} else {
				grunt.log.ok();

				files.forEach(function (file) {
					file.src.forEach(function (src) {
						grunt.log.write('Filtering ' + src + '...');

						filter(src, file.dest, codes, options, function (error) {
							if (error) {
								grunt.log.error(error);
							} else {
								grunt.log.ok();
							}
							done(!error);
						});
					});
				});
			}
		});
	});
};