// Here we gonna filter data regarding selected countries in the file "countries.csv":
// Where selected country is has 1 in the "show" column

'use strict';

let csv = require('csv');
let fs = require('fs');

module.exports = (grunt) => {
	function countries (filename, done) {
		let codes = [];
		// Read from csv stream
		csv()
			.from.stream(fs.createReadStream(filename))
			.on('record', (row, index) => {
				if (index === 0) {
					return;
				} else if (row[2] === '1') {
					codes.push(row[0]);
				}
			})
			.on('end', () => {
				done(null, codes);
			})
			.on('error', (error) => {
				console.error(error.message);
				done(error);
			});
	}

	function filter (source, dest, codes, options, done) {
		let headers = [];

		// Creates an object based on row data
		function obj (row) {
			return row.reduce(function(data, col, i) {
				data[headers[i]] = col;
				return data;
			}, {});
		}

		csv()
			.from.stream(fs.createReadStream(source))
			.to.stream(fs.createWriteStream(dest))
			.transform((row, index) => {
				if (index === 0) {
					return headers = row;
				}
				// Create object from row
				let object = obj(row);

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
			.on('end', () => {
				done(null);
			})
			.on('error', (error) => {
				console.error(error.message);
				done(error);
			});
	}
};