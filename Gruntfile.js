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
		}
	});
};