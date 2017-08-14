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
	};	
})(window.migrato || (window.migrato = {}));

