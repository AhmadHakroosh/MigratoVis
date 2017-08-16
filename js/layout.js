// The application layout configuration

(function (scope) {
	scope.layout = function() {
		var chord = {},
			chords,
			groups,
			data,
			matrix,
			indices,
			countries,
			year,
			n,
			padding = 0,
			threshold = null,
			sortGroups,
			sortSubgroups,
			sortChords,
			alpha;

		function region (index) {
			var r = 0;
			for (var i = 0; i < data.regions.length; i++) {
				if (data.regions[i] > index) {
					break;
				}
				r = i;
			}
			return data.regions[r];
		}

		function relayout () {
			// TODO
		}

		function resort () {
			chords.sort(function (a, b) {
				return sortChords(a.source.value, b.source.value);
			});
		}

		chord.data = function (x) {
			if (!arguments.length) {
				return data;
			}
			data = x;
			indices = data.regions.slice();
			n = indices.length;
			chords = groups = null;
			return chord;
		}

		chord.year = function (x) {
			if (!arguments.length) {
				return year;
			}
			year = x;
			chords = groups = null;
			return chord;
		};

		chord.countries = function (x) {
			if (!arguments.length) {
				return countries;
			}
			countries = x;
			indices = scope.countrymerge(data, countries);
			n = indices.length;
			chords = groups = null;
			return chord;
		};

		chord.padding = function (x) {
			if (!arguments.length) {
				return padding;
			}
			padding = x;
			chords = groups = null;
			return chord;
		};

		chord.threshold = function (x) {
			if (!arguments.length) {
				return threshold;
			}
			threshold = x;
			chords = groups = null;
			return chord;
		};

		chord.sortGroups = function (x) {
			if (!arguments.length) {
				return sortGroups;
			}
			sortGroups = x;
			chords = groups = null;
			return chord;
		};

		chord.sortSubgroups = function (x) {
			if (!arguments.length) {
				return sortSubgroups;
			}
			sortSubgroups = x;
			chords = null;
			return chord;
		};

		chord.sortChords = function (x) {
			if (!arguments.length) {
				return sortChords;
			}
			sortChords = x;
			if (chords) {
				resort();
			}
			return chord;
		};

		chord.chords = function () {
			if (!chords) {
				relayout();
			}
			return chords;
		};

		chord.groups = function () {
			if (!groups) {
				relayout();
			}
			return groups;
		};

		// start angle for first region (decimal degrees)
		// (stored internally in radians)
		chord.alpha = function (x) {
			if (!arguments.length) {
				return alpha * degrees;
			}
			alpha = (x === 0) ? 0.00001 : x; // small but not zero
			alpha *= radians;
			alpha = alpha.mod(2*π);
			chords = groups = null;
			return chord;
		};

		// proper modulus (works taking the sign of the divisor not of the dividend)
		Number.prototype.mod = function (n) {
			return ((this % n) + n) % n;
		};

		return chord;
	};	
})(window.migrato || (window.migrato = {}));

