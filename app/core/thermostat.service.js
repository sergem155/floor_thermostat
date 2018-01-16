angular.
	module('core').
	factory('Thermostat', ['$resource',
		function($resource) {
			return $resource('/api/thermostat-status.php');
		}
	]);
