angular.
	module('core').
	factory('Schedule', ['$resource',
		function($resource) {
			return $resource('/api/crontab.php?item=:scheduleId', {}, {
				query: {
					method: 'GET',
					params: {scheduleId: 'list'},
					isArray: true
				}
			});
		}
	]);
