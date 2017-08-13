/* jshint node: true */

module.exports = (grunt) => {
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
		},

		concat: {
			js: {
				options: {
					separator: ';'
				},
				src: [
					'lib/modernizr.js',
					'lib/d3.min.js',
					'js/chart.js'
				],
				dest: 'dest/index.js'
			},
			css: {
				options: {
					separator: '\n'
				},
				src: [
					'css/normalize.css',
					'css/style.css'
				],
				dest: 'dest/style.css'
			}
		},

		uglify: {
			js: {
				files: {
					'dest/index.min.js': ['dest/index.js']
				}
			}
		},

		cssmin: {
			css: {
				src: 'dest/style.css',
				dest: 'dest/style.min.css'
			}
		},

		copy: {
			fonts: {
				files: [
					{
						expand: true,
						cwd: 'css/fonts/',
						src: ['*'],
						dest: 'dest/fonts',
						flatten: true
					}
				]
			}
		},

		clean: ['dest']
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('build', ['concat', 'cssmin', 'uglify', 'copy']);
	grunt.registerTask('default', ['jshint', 'filter', 'compile', 'build']);
};