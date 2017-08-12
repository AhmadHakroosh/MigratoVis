'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		// Configuration initialization
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			tasks: {
				src: ['tasks/*.js']
			}
		},
		filter: {
			main: {
				options: {
					countries: 'data/countries.csv'
				},
				src: 'data/migrations.csv',
				dest: 'data/data.csv'
			}
		},
		compile: {
			main: {
				src: 'data/data.csv',
				dest: 'data/data.json'
			}
		}
	});
};