// Initialize diagram
// Build main application infrastructure using configuration and data objects
((scope) => {
	scope.chart = (data, config) => {
		// Get data if defined; instantiate otherwise
    	data = data || {regions: [], names: [], mapping: []};
    	// Get application configuration if defined; initialize otherwise
    	config = config || {};
    	config.element = config.element || 'body';
    }
});