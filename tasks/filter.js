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
};